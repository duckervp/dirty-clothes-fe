import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fViCurrency } from 'src/utils/format-number';

import Logo from 'src/layouts/homepage/logo';
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

export default function PaymentView() {
  const [searchParams] = useSearchParams();

  const buyNowMode = searchParams.get('buyNow');

  const buyNow = useSelector(selectBuyNow);

  const cartItems = useSelector(selectCartItems);

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid container xs={12} sm={12} md={8}>
          <Grid xs={12} sm={12} md={12}>
            <Logo sx={{ fontSize: '40px', m: 0 }} />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Typography variant="body1" fontWeight={700}>
              Shipping Information
            </Typography>
            <AddressForm />
          </Grid>
          <Grid xs={12} sm={12} md={6}>
            <Box>
              <Typography variant="body1" fontWeight={700}>
                Shipping Method
              </Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
                <Typography variant="subtitle1">Delivery</Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  100.000 VND
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
          <Typography variant="h4" sx={{ fontWeight: '600', mt: 1 }}>
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
              <Typography variant="body2">100.000 VND</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2">20.000 VND</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1">120.000 VND</Typography>
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
            >
              Complete Order
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
