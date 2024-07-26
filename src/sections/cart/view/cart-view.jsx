// import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useRouter } from 'src/routes/hooks';

import { numberWithCommas } from 'src/utils/format-number';

function createData(name, calories, fat, carbs, cover) {
  return { name, calories, fat, carbs, cover };
}

const rows = [
  createData('Frozen yoghurt dfasf afds  fadsfds f ds dfas', 1, 6000000, 24, `/assets/images/products/product_1.jpg`),
  createData('Ice cream sandwich', 1, 9.0, 37, `/assets/images/products/product_2.jpg`),
  createData('Eclair', 1, 16.0, 24, `/assets/images/products/product_3.jpg`),
  createData('Cupcake', 1, 3.7, 67, `/assets/images/products/product_4.jpg`),
  createData('Gingerbread', 1, 16.0, 49, `/assets/images/products/product_5.jpg`),
];

function CartItemTable() {
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
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Stack direction="row">
                  <Box
                    component="img"
                    alt={row.name}
                    src={row.cover}
                    sx={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Link color="inherit" underline="hover" variant="subtitle2">
                      {row.name}
                    </Link>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      {/* <ColorPreview colors={product.colors} /> */}
                      {numberWithCommas(row.fat)} VND
                    </Stack>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <QuantityButtonGroup value={row.calories} />
              </TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>
                {numberWithCommas(row.fat)} VND
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete">
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

function QuantityButtonGroup({ value }) {
  return (
    <ToggleButtonGroup orientation="horizontal" exclusive>
      <ToggleButton value="list" aria-label="list">
        <RemoveIcon />
      </ToggleButton>
      <ToggleButton
        value="module"
        aria-label="module"
        disabled
        sx={{ width: 60 }}
        style={{ color: 'black' }}
      >
        {value}
      </ToggleButton>
      <ToggleButton value="quilt" aria-label="quilt">
        <AddIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

QuantityButtonGroup.propTypes = {
  value: PropTypes.number,
};

export default function CartView() {

  const router = useRouter();

  const handlePaymentClick = () => {
    router.push('/payment');
  };

  return (
    <Container>
      {/* <Typography variant="h4">Cart</Typography> */}
      <Grid container spacing={5}>
        <Grid xs={12} sm={12} md={8}>
          <CartItemTable />
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Box sx={{ border: '1px solid rgba(145, 158, 171, 0.2)' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
              <Typography variant="body2">Total</Typography>
              <Typography variant="body2" fontWeight="600">
                100.000 VND
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
