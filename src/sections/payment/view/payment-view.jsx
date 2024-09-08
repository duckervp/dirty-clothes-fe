import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { useRouter } from 'src/routes/hooks';

import useNotify from 'src/hooks/use-notify';

import { fViCurrency } from 'src/utils/format-number';

import Logo from 'src/layouts/common/logo';
import { FREE_SHIPPING_MODE } from 'src/config';
import { useGetFeeMutation } from 'src/app/api/payment/ghnApiSlice';
import { useCreateOrderMutation } from 'src/app/api/order/orderApiSlice';
import { selectBuyNow, selectCartItems, removeAllCartItems } from 'src/app/api/cart/cartSlice';
import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
} from 'src/app/api/address/addressApiSlice';

import ModalPopup from 'src/components/modal/modal';

import AddressForm from '../address-form';
import UseRadioGroup from '../radio-group';
import CheckoutItem from '../../cart/checkout-item';

// --------------------------------------------------------

const calTotalPrice = (items) => {
  if (!items) return 0;
  let total = 0;

  for (let i = 0; i < items.length; i += 1) {
    total += items.at(i).price * items.at(i).quantity;
  }

  return total;
};

export default function PaymentView() {
  const { t } = useTranslation('product', { keyPrefix: 'payment' });

  const { showErrorMsg, showSuccessMsg, showCustomErrorMsg } = useNotify();

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

  const [selectedAddress, setSelectedAddress] = useState({ name: t('shipping-info.placeholder') });

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
      showCustomErrorMsg('custom.payment.shipping-address-required');
      return;
    }

    try {
      await createOrder(produceOrder()).unwrap();
      dispatch(removeAllCartItems());
      showSuccessMsg('custom.order.create-success');
      router.push('/order');
    } catch (error) {
      showErrorMsg(error);
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

    if (!FREE_SHIPPING_MODE) {
      const { shippingInfo } = address;

      if (shippingInfo) {
        fetchShippingFee(shippingInfo);
      }
    }
  };

  const fetchShippingFee = async (shippingInfo) => {
    const payload = JSON.parse(shippingInfo);
    const { data } = await getFee(payload).unwrap();
    setShippingFee(data);
  };

  const handleCreateAddressClick = () => {
    setCreateAddressModalOpen(true);
  };

  const handleAddAddressClick = () => {
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
    };

    if (!FREE_SHIPPING_MODE) {
      payload.shippingInfo = JSON.stringify({
        to_district_id: ward?.DistrictID,
        to_ward_code: ward?.WardCode,
      });
    }

    createNewAddress(payload);
    setCreateAddressModalOpen(false);
  };

  const createNewAddress = async (payload) => {
    const { data } = await createAddress(payload).unwrap();
    const newAddresses = [...addresses];
    newAddresses.push(data);
    setAddresses(newAddresses);
  };

  return (
    <Container sx={{ py: 3 }}>
      <ModalPopup open={changeAddressModalOpen} setOpen={setChangeAddressModalOpen}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h5" textAlign="left" sx={{ mb: 1 }} style={{ margin: 0 }}>
            {t('address.title')}
          </Typography>
          <Button startIcon={<AddBoxIcon />} onClick={handleCreateAddressClick}>
            {t('address.btn-new')}
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
          {t('address.form.title')}
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
          {t('address.form.btn-submit')}
        </LoadingButton>
      </ModalPopup>
      <Grid container spacing={5}>
        <Grid container xs={12} sm={12} md={7}>
          <Stack sx={{ p: 2, width: 1 }}>
            <Logo sx={{ fontSize: '40px', m: 0, textAlign: {xs: "center", md: "left"} }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
              }}
            >
              <Box sx={{ width: '100%', pr: { lg: 2, md: 2, sm: 0, xs: 0 } }}>
                <Typography variant="body1" fontWeight={700} sx={{ mb: 1, mt: 5 }}>
                  {t('shipping-info.label')} <span style={{ color: 'red' }}>*</span>
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>{selectedAddress?.name}</Typography>
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
                    {t('shipping-method.label')}
                  </Typography>
                  <Card sx={{ boxShadow: 3 }}>
                    {FREE_SHIPPING_MODE ?
                      <Stack direction="row" justifyContent="space-between" sx={{ py: 3, px: 3 }}>
                        <Stack direction="row" alignItems="center">
                          <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                            {t('shipping-method.standard')}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                          {t('shipping-method.free')}
                        </Typography>
                      </Stack>
                      :
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
                    }
                  </Card>
                </Box>
                <Box sx={{ mt: 5 }}>
                  <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
                    {t('payment-method.label')}
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
              {t('order-summary.title')}
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
                <Typography variant="body2">{t('order-summary.subtotal')}</Typography>
                <Typography variant="body2">
                  {fViCurrency(calTotalPrice(buyNowMode ? [buyNow] : cartItems))}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">{t('order-summary.shipping')}</Typography>
                <Typography variant="body2">{fViCurrency(FREE_SHIPPING_MODE ? 0 : getServiceFee())}</Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
                <Typography variant="subtitle1">{t('order-summary.total')}</Typography>
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
                {t('order-summary.btn-complete-order')}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
