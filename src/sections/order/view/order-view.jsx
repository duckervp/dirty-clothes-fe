// import { useEffect } from 'react';
// import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';

import { fViCurrency } from 'src/utils/format-number';

import {
  removeCartItem,
  selectCartItems,
  updateCartItemQuantity,
} from 'src/app/api/cart/cartSlice';

import { ColorPreview } from 'src/components/color-utils';
import QuantityButtonGroup from 'src/components/product/quantity-button-group';

const calTotalPrice = (price, quantity) => price * quantity;

const calCartTotalPrice = (cartItems) => {
  if (!cartItems) return 0;
  let total = 0;

  for (let i = 0; i < cartItems.length; i += 1) {
    total += cartItems.at(i).price * cartItems.at(i).quantity;
  }

  return total;
};

function CartItemTable({ cartItems }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (cartItem, newValue) => {
    dispatch(updateCartItemQuantity({ selectedProduct: cartItem, newQuantity: newValue }));
  };

  const handleDeleteCartItem = (cartItem) => {
    dispatch(removeCartItem({ selectedProduct: cartItem }));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'black' }}>Product</TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Quantity
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Total
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Delete
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems?.map((item) => (
            <TableRow
              key={item?.productDetailId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
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
              <TableCell align="center">
                <QuantityButtonGroup
                  value={item?.quantity}
                  setValue={handleQuantityChange}
                  cartItem={item}
                />
              </TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>
                {fViCurrency(calTotalPrice(item?.price, item?.quantity))}
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" onClick={() => handleDeleteCartItem(item)}>
                  <DeleteIcon />
                </IconButton>
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
  const router = useRouter();

  const cartItems = useSelector(selectCartItems);

  const handlePaymentClick = () => {
    router.push('/payment');
  };

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid xs={12} sm={12} md={8}>
          <CartItemTable cartItems={cartItems} />
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Box sx={{ border: '1px solid rgba(145, 158, 171, 0.2)' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
              <Typography variant="body2">Total</Typography>
              <Typography variant="body2" fontWeight="600">
                {fViCurrency(calCartTotalPrice(cartItems))}
              </Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 4, textAlign: 'center', borderRadius: '3px' }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  background: 'black',
                  border: '1px solid black',
                  '&:hover': { background: 'white', color: 'black' },
                }}
                onClick={handlePaymentClick}
              >
                PAYMENT
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
