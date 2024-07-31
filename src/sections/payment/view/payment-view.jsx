import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { handleError } from 'src/utils/notify';
import { fViCurrency } from 'src/utils/format-number';

import Logo from 'src/layouts/homepage/logo';
import { selectCurrentUser } from 'src/app/api/auth/authSlice';
import { useGetFeeMutation } from 'src/app/api/payment/ghnApiSlice';
import { useCreateOrderMutation } from 'src/app/api/order/orderApiSlice';
import { selectBuyNow, selectCartItems } from 'src/app/api/cart/cartSlice';

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
          <Link color="inherit" underline="hover" variant="subtitle2">
            {item?.name}
          </Link>
          <Stack direction="row" sx={{ mb: 1 }}>
            <ColorPreview colors={[item?.color]} sx={{ mx: 0.75 }} />
            <Typography variant="caption">{item?.size}</Typography>
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

  const [searchParams] = useSearchParams();

  const user = useSelector(selectCurrentUser);

  const buyNowMode = searchParams.get('buyNow');

  const buyNow = useSelector(selectBuyNow);

  const cartItems = useSelector(selectCartItems);

  const [ward, setWard] = useState(null);

  const [shippingFee, setShippingFee] = useState(null);

  const [shippingAddress, setShippingAddress] = useState(defaultShippingAddress);

  const [shippingAddressId] = useState(-1);

  const [createOrder] = useCreateOrderMutation();

  const [getFee] = useGetFeeMutation();

  useEffect(() => {
    const fetchShippingFee = async () => {
      const payload = {
        to_district_id: ward?.DistrictID,
        to_ward_code: ward?.WardCode,
      };
      const { data } = await getFee(payload).unwrap();
      console.log(data);
      setShippingFee(data);
    };

    if (ward) {
      fetchShippingFee();
    }
  }, [getFee, ward]);

  const getServiceFee = () => {
    if (shippingFee) {
      return shippingFee.total;
    }
    return 0;
  };

  const getTotal = () => calTotalPrice(buyNowMode ? [buyNow] : cartItems) + getServiceFee();

  const handleCheckout = async () => {
    try {
      const response = await createOrder(produceOrder()).unwrap();
      console.log(response);

      if (!user) {
        // do some thing
      }
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
      shippingAddressId,
      receiverName: shippingAddress.name,
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
      shippingFee: getFee(),
      total: getTotal(),
      paymentMethod: 'CASH_ON_DELIVERY',
      shippingInfo: JSON.stringify({
        to_district_id: ward?.DistrictID,
        to_ward_code: ward?.WardCode,
      }),
      orderDetails,
    };
  };

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid container xs={12} sm={12} md={8}>
          <Grid xs={12} sm={12} md={12}>
            <Logo sx={{ fontSize: '40px', m: 0 }} />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
              Shipping Information
            </Typography>
            <AddressForm
              ward={ward}
              setWard={setWard}
              address={shippingAddress}
              setAddress={setShippingAddress}
            />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box>
              <Typography variant="body1" fontWeight={700}>
                Shipping Method
              </Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 2, pl: 1, pr: 3 }}>
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
                  <Typography variant="subtitle1">GHN</Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight="600">
                  {fViCurrency(shippingFee?.total)}
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" fontWeight={700}>
                Payment Method
              </Typography>
              <UseRadioGroup />
            </Box>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={4} sx={{ borderLeft: '1px solid rgba(145, 158, 171, 0.2)' }}>
          <Typography variant="h3" sx={{ fontWeight: '600', mt: 1, mb: 2 }}>
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
        </Grid>
      </Grid>
    </Container>
  );
}
