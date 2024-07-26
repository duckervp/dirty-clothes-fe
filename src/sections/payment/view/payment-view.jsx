// import { useState } from 'react';
// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { numberWithCommas } from 'src/utils/format-number';

import Logo from 'src/layouts/homepage/logo';

import AddressForm from '../AddressForm';
import UseRadioGroup from '../RadioGroup';
// import { LOGO_NAME } from '../../../../config';

function createData(name, calories, fat, carbs, cover) {
  return { name, calories, fat, carbs, cover };
}

const rows = [
  createData(
    'Frozen yoghurt dfasf afds  fadsfds f ds dfas',
    1,
    6000000,
    24,
    `/assets/images/products/product_1.jpg`
  ),
  createData('Ice cream sandwich', 1, 9.0, 37, `/assets/images/products/product_2.jpg`),
];

export default function PaymentView() {
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
            {rows.map((row, index) => (
              <Box>
                <Stack direction="row" sx={{ my: 1 }}>
                  <Box
                    component="img"
                    alt={row.name}
                    src={row.cover}
                    sx={{
                      width: '75px',
                      height: '75px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <Stack spacing={1} sx={{ px: 1 }}>
                    <Link color="inherit" underline="hover" variant="subtitle1">
                      {row.name}
                    </Link>

                    <Typography variant="caption">{numberWithCommas(row.fat)} VND</Typography>
                  </Stack>
                </Stack>
                {index < rows.length - 1 && <Divider />}
              </Box>
            ))}

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
