import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link as RLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

import { useResponsive } from 'src/hooks/use-responsive';

import { fViCurrency } from 'src/utils/format-number';

import {
  removeCartItem,
  selectCartItems,
  updateCartItemQuantity,
} from 'src/app/api/cart/cartSlice';

import { ColorPreview } from 'src/components/color-utils';
import EmptyContainer from 'src/components/empty-container/empty-container';
import QuantityButtonGroup from 'src/components/product/quantity-button-group';

import CheckoutItem from '../checkout-item';

// -------------------------------------------------------------------

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
  const { t } = useTranslation('product', { keyPrefix: "cart.cart-item-table" });

  const dispatch = useDispatch();

  const handleQuantityChange = (cartItem, newValue) => {
    dispatch(updateCartItemQuantity({ selectedProduct: cartItem, newQuantity: newValue }));
  };

  const handleDeleteCartItem = (cartItem) => {
    dispatch(removeCartItem({ selectedProduct: cartItem }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'black' }}>{t('product')}</TableCell>
            <TableCell sx={{ color: 'black' }} />
            <TableCell sx={{ color: 'black' }} align="center">
              {t('quantity')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('total')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('delete')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems?.map((item) => (
            <TableRow
              key={item?.productDetailId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" sx={{
                minHeight: '150px',
                minWidth: '150px'
              }}>
                <Box
                  component="img"
                  alt={item?.name}
                  src={item?.image}
                  sx={{
                    height: '150px',
                    width: '150px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              </TableCell>
              <TableCell>
                <Stack spacing={2} sx={{ p: 2 }}>
                  <Link
                    component={RLink}
                    color="inherit"
                    underline="hover"
                    variant="subtitle2"
                    to={`/${item?.slug}`}
                  >
                    {item?.name}
                  </Link>
                  <Stack direction="row" sx={{ mb: 2 }}>
                    <ColorPreview colors={[item?.color]} sx={{ mx: 0.75 }} />
                    <Typography variant="caption">{item?.size}</Typography>
                  </Stack>
                  <Typography variant="caption">{fViCurrency(item?.price)}</Typography>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <QuantityButtonGroup
                  value={item?.quantity}
                  setValue={handleQuantityChange}
                  cartItem={item}
                  lbsx={{ width: "10px", height: "10px" }}
                  mbsx={{ width: "10px", height: "10px" }}
                  rbsx={{ width: "10px", height: "10px" }}
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

function CartItemStack({ cartItems }) {

  const dispatch = useDispatch();

  const handleQuantityChange = (cartItem, newValue) => {
    dispatch(updateCartItemQuantity({ selectedProduct: cartItem, newQuantity: newValue }));
  };

  const handleDeleteCartItem = (cartItem) => {
    dispatch(removeCartItem({ selectedProduct: cartItem }));
  };

  return (
    <Card>
      {cartItems?.map((item, index) => (
        <CheckoutItem
          key={item?.productDetailId}
          item={item}
          divider={index < cartItems.length - 1}
          cart
          handleQuantityChange={handleQuantityChange}
          handleDeleteCartItem={handleDeleteCartItem}
        />
      ))}
    </Card>
  );
}

CartItemStack.propTypes = {
  cartItems: PropTypes.array,
};

export default function CartView() {
  const { t } = useTranslation('product', { keyPrefix: 'cart' });

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const cartItems = useSelector(selectCartItems);

  const handlePaymentClick = () => {
    router.push('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <EmptyContainer title={t('empty.title')} message={t('empty.message')} />
    );
  }

  return (
    <Container>
      <Typography variant="h5">{t('title')}</Typography>
      <Grid container spacing={5}>
        <Grid xs={12} sm={6} md={8}>
          {mdUp ?
            <CartItemTable cartItems={cartItems} /> :
            <CartItemStack cartItems={cartItems} />
          }
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <Card sx={{ border: '1px solid rgba(145, 158, 171, 0.2)' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
              <Typography variant="body2">{t('total')}</Typography>
              <Typography variant="body2" fontWeight="600">
                {fViCurrency(calCartTotalPrice(cartItems))}
              </Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 9, textAlign: 'center', borderRadius: '3px' }}>
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
                {t('btn-payment')}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
