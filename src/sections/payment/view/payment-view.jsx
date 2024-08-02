import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RLink, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { useRouter } from 'src/routes/hooks';

import { fViCurrency } from 'src/utils/format-number';
import { handleError, showErrorMessage } from 'src/utils/notify';

import Logo from 'src/layouts/homepage/logo';
import { useGetFeeMutation } from 'src/app/api/payment/ghnApiSlice';
import { useCreateOrderMutation } from 'src/app/api/order/orderApiSlice';
import { selectBuyNow, selectCartItems, removeAllCartItems } from 'src/app/api/cart/cartSlice';
import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
} from 'src/app/api/address/addressApiSlice';

import ModalPopup from 'src/components/modal/modal';
import { ColorPreview } from 'src/components/color-utils';

import AddressForm from '../AddressForm';
import UseRadioGroup from '../RadioGroup';

// import { LOGO_NAME } from '../../../../config';

function CheckoutItem({ item, divider }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Box
          component="img"
          alt={item?.name}
          src={item?.image}
          sx={{
            width: '100px',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />
        <Stack spacing={2} sx={{ p: 1 }}>
          <Link
            component={RLink}
            color="inherit"
            underline="hover"
            variant="subtitle2"
            to={`/${item?.slug}`}
          >
            {item?.name}
          </Link>
          <Stack direction="row" sx={{ mb: 1 }}>
            <ColorPreview colors={[item?.color]} sx={{ mx: 0.75 }} />
            <Typography variant="caption">{item?.size}</Typography>
            <Typography variant="caption" sx={{ ml: 0.75, fontWeight: 700 }}>
              x{item?.quantity}
            </Typography>
          </Stack>
          <Typography variant="caption">{fViCurrency(item?.price)}</Typography>
        </Stack>
      </Stack>
      {divider && <Divider />}
    </Box>
  );
}

CheckoutItem.propTypes = {
  item: PropTypes.object,
  divider: PropTypes.bool,
};

const calTotalPrice = (items) => {
  if (!items) return 0;
  let total = 0;

  for (let i = 0; i < items.length; i += 1) {
    total += items.at(i).price * items.at(i).quantity;
  }

  return total;
};

export default function PaymentView() {
  const defaultShippingAddress = {
    address: null,
    district: null,
    name: null,
    note: null,
    phone: null,
    province: null,
    ward: null,
    zip: null,
  };

  const dispatch = useDispatch();

  const router = useRouter();

  const [searchParams] = useSearchParams();

  const buyNowMode = searchParams.get('buyNow');

  const buyNow = useSelector(selectBuyNow);

  const cartItems = useSelector(selectCartItems);

  const [ward, setWard] = useState(null);

  const [shippingFee, setShippingFee] = useState(null);

  const [shippingAddress, setShippingAddress] = useState(defaultShippingAddress);

  const [createOrder] = useCreateOrderMutation();

  const [getFee] = useGetFeeMutation();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState({ name: 'Select shipping address' });

  const { data: addressData } = useGetAllAddressesQuery({ userOnly: true });

  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);

  const [createAddressModalOpen, setCreateAddressModalOpen] = useState(false);

  const [createAddress] = useCreateAddressMutation();

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData.data.content);
    }
  }, [addressData]);

  const getServiceFee = () => {
    if (shippingFee) {
      return shippingFee.total;
    }
    return 0;
  };

  const getTotal = () => calTotalPrice(buyNowMode ? [buyNow] : cartItems) + getServiceFee();

  const handleCheckout = async () => {
    if (!selectedAddress || !selectedAddress.id) {
      showErrorMessage('Please select shipping address info!');
      return;
    }

    try {
      await createOrder(produceOrder()).unwrap();
      dispatch(removeAllCartItems());
      router.push('/order');
    } catch (error) {
      handleError(error);
    }
  };

  const produceOrder = () => {
    const items = buyNowMode ? [buyNow] : cartItems;

    const orderDetails = items.map((item) => ({
      productDetailId: item.productDetailId,
      price: item.price,
      quantity: item.quantity,
    }));

    return {
      shippingAddressId: selectedAddress.id,
      shippingFee: getServiceFee(),
      total: getTotal(),
      paymentMethod: 'CASH_ON_DELIVERY',
      orderDetails,
    };
  };

  const handleChangeAddressClick = () => {
    setChangeAddressModalOpen(true);
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setChangeAddressModalOpen(false);

    const { shippingInfo } = address;

    if (shippingInfo) {
      fetchShippingFee(shippingInfo);
    }
  };

  const fetchShippingFee = async (shippingInfo) => {
    const payload = JSON.parse(shippingInfo);
    const { data } = await getFee(payload).unwrap();
    console.log('ship', data);
    setShippingFee(data);
  };

  const handleCreateAddressClick = () => {
    setCreateAddressModalOpen(true);
  };

  const handleAddAddressClick = () => {
    console.log(shippingAddress, ward);

    const payload = {
      name: shippingAddress.name,
      phone: shippingAddress.phone,
      note: shippingAddress.note,
      postalCode: shippingAddress.zip,
      detailAddress: ''
        .concat(shippingAddress.address)
        .concat(', ')
        .concat(shippingAddress.ward)
        .concat(', ')
        .concat(shippingAddress.district)
        .concat(', ')
        .concat(shippingAddress.province),
      shippingInfo: JSON.stringify({
        to_district_id: ward?.DistrictID,
        to_ward_code: ward?.WardCode,
      }),
    };

    createNewAddress(payload);
    setCreateAddressModalOpen(false);
  };

  const createNewAddress = async (payload) => {
    const { data } = await createAddress(payload).unwrap();
    console.log(data);
    const newAddresses = [...addresses];
    newAddresses.push(data);
    setAddresses(newAddresses);
  };

  return (
    <Container sx={{ py: 3 }}>
      <ModalPopup open={changeAddressModalOpen} setOpen={setChangeAddressModalOpen}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h5" textAlign="left" sx={{ mb: 1 }} style={{ margin: 0 }}>
            SELECT ADDRESS
          </Typography>
          <Button startIcon={<AddBoxIcon />} onClick={handleCreateAddressClick}>
            NEW
          </Button>
        </Stack>

        <Stack spacing={1}>
          {addresses?.map((item) => (
            <Card
              key={item?.id}
              sx={{
                px: 2,
                py: 3,
                background: '#eee',
                cursor: 'pointer',
                '&:hover': { background: 'rgba(145, 158, 171, 0.2)' },
              }}
              onClick={() => handleAddressClick(item)}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                {item?.name} | {item?.phone}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                {item?.detailAddress}
              </Typography>
            </Card>
          ))}
        </Stack>
      </ModalPopup>

      <ModalPopup open={createAddressModalOpen} setOpen={setCreateAddressModalOpen}>
        <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 1 }}>
          NEW ADDRESS
        </Typography>
        <AddressForm
          ward={ward}
          setWard={setWard}
          address={shippingAddress}
          setAddress={setShippingAddress}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleAddAddressClick}
          sx={{ mt: 2 }}
        >
          Submit
        </LoadingButton>
      </ModalPopup>
      <Grid container spacing={5}>
        <Grid container xs={12} sm={12} md={7}>
          <Stack sx={{ p: 2, width: 1 }}>
            <Logo sx={{ fontSize: '40px', m: 0 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
              }}
            >
              <Box sx={{ width: '100%', pr: { lg: 2, md: 2, sm: 0, xs: 0 } }}>
                <Typography variant="body1" fontWeight={700} sx={{ mb: 1, mt: 5 }}>
                  Shipping Information
                </Typography>

                <Card
                  sx={{ boxShadow: 3, width: '100%', cursor: 'pointer' }}
                  onClick={handleChangeAddressClick}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ '&:hover': { background: 'rgba(145, 158, 171, 0.2)' } }}
                  >
                    <Box sx={{ px: 2, py: 3 }}>
                      <Typography variant="subtitle2">{selectedAddress?.name}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                        {selectedAddress?.phone}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                        {selectedAddress?.detailAddress}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Box>

              <Box sx={{ mt: 5, width: '100%', pl: { lg: 2, md: 2, sm: 0, xs: 0 } }}>
                <Box>
                  <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
                    Shipping Method
                  </Typography>
                  <Card sx={{ boxShadow: 3 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ py: 3, px: 3 }}>
                      <Stack direction="row" alignItems="center">
                        <Box
                          component="img"
                          alt="GHN Logo"
                          src="/assets/icons/ghn.webp"
                          sx={{
                            width: '30px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            mr: 1,
                          }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                          GHN
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                        {fViCurrency(shippingFee?.total)}
                      </Typography>
                    </Stack>
                  </Card>
                </Box>
                <Box sx={{ mt: 5 }}>
                  <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
                    Payment Method
                  </Typography>
                  <Card sx={{ p: 3, boxShadow: 3 }}>
                    <UseRadioGroup />
                  </Card>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid xs={12} sm={12} md={5}>
          <Card sx={{ px: 3, py: 5, boxShadow: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: '600', mb: 2, textAlign: 'center' }}>
              Order Summary
            </Typography>
            <Divider />
            <Box sx={{ pt: 2 }}>
              {buyNowMode ? (
                <CheckoutItem item={buyNow} />
              ) : (
                cartItems?.map((item, index) => (
                  <CheckoutItem
                    key={item?.productDetailId}
                    item={item}
                    divider={index < cartItems.length - 1}
                  />
                ))
              )}

              <Divider sx={{ pt: 1, pb: 2 }} />

              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {fViCurrency(calTotalPrice(buyNowMode ? [buyNow] : cartItems))}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">{fViCurrency(getServiceFee())}</Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">{fViCurrency(getTotal())}</Typography>
              </Stack>

              <Button
                variant="contained"
                sx={{
                  px: 4,
                  background: 'black',
                  border: '1px solid black',
                  '&:hover': { background: 'white', color: 'black' },
                }}
                fullWidth
                onClick={handleCheckout}
              >
                Complete Order
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
