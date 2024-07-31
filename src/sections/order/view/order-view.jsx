// import { useEffect } from 'react';
// import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
// import Grid from '@mui/material/Unstable_Grid2';
// import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

// import { useRouter } from 'src/routes/hooks';

import { fViCurrency } from 'src/utils/format-number';

import {  selectCartItems } from 'src/app/api/cart/cartSlice';

import { ColorPreview } from 'src/components/color-utils';

const calTotalPrice = (price, quantity) => price * quantity;

// const calCartTotalPrice = (cartItems) => {
//   if (!cartItems) return 0;
//   let total = 0;

//   for (let i = 0; i < cartItems.length; i += 1) {
//     total += cartItems.at(i).price * cartItems.at(i).quantity;
//   }

//   return total;
// };

function CartItemTable({ cartItems }) {
  // const dispatch = useDispatch();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {cartItems?.map((item) => (
            <TableRow
              key={item?.productDetailId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">
                <Stack alignItems="center">
                  <Typography variant="caption">Order No: asfadsf-daf-</Typography>
                  <Typography variant="caption">2024/Nov/12 10:00:00</Typography>
                </Stack>
              </TableCell>
              <TableCell component="th" scope="row">
                <Stack direction="row">
                  <Box
                    component="img"
                    alt={item?.name}
                    src={item?.image}
                    sx={{
                      // width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <Stack spacing={2} sx={{ p: 2 }}>
                    <Link color="inherit" underline="hover" variant="subtitle2">
                      {item?.name}
                    </Link>
                    <Stack direction="row" sx={{ mb: 2 }}>
                      <ColorPreview colors={[item?.color]} sx={{ mx: 0.75 }} />
                      <Typography variant="caption">{item?.size}</Typography>
                    </Stack>
                    <Typography variant="caption">{fViCurrency(item?.price)}</Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell align="center">Status: ORDER</TableCell>
              <TableCell align="center">SL: {item?.quantity}</TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>
                {fViCurrency(calTotalPrice(item?.price, item?.quantity))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CartItemTable.propTypes = {
  cartItems: PropTypes.array,
};

export default function OrderView() {
  // const router = useRouter();

  const cartItems = useSelector(selectCartItems);

  // const handlePaymentClick = () => {
  //   router.push('/payment');
  // };

  return (
    <Container>
      <Box>
        <CartItemTable cartItems={cartItems} />
      </Box>
    </Container>
  );
}
