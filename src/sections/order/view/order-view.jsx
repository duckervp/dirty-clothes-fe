import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fViCurrency } from 'src/utils/format-number';

import { useGetAllOrdersQuery } from 'src/app/api/order/orderApiSlice';

import ModalPopup from 'src/components/modal/modal';
import { ColorPreview } from 'src/components/color-utils';
import EmptyContainer from 'src/components/empty-container/empty-container';

import OrderSummary from '../order-summary';

function OrderItemTable({ orderItems, handleOrderClick }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {orderItems?.map((item) => (
            <TableRow
              key={item?.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              onClick={() => handleOrderClick(item)}
            >
              <TableCell component="th" scope="row">
                <Tooltip title={item?.code}>
                  <Stack alignItems="center">
                    <Typography variant="subtitle2">Order No</Typography>
                    <Typography variant="caption">
                      {item?.code?.length > 10
                        ? item?.code?.slice(0, 10).concat('...')
                        : item?.code}
                    </Typography>
                  </Stack>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Stack direction="row">
                  <Box
                    component="img"
                    alt={item?.firstItem?.productName}
                    src={item?.firstItem?.imageUrl}
                    sx={{
                      height: '150px',
                      width: '150px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <Stack spacing={2} sx={{ p: 2 }}>
                    <Link color="inherit" underline="none" variant="subtitle2">
                      {item?.firstItem?.productName}
                    </Link>
                    <Stack direction="row" sx={{ mb: 2 }} alignItems="center">
                      <ColorPreview colors={[item?.firstItem?.color]} sx={{ mx: 0.75 }} />
                      <Typography variant="subtitle2">{item?.firstItem?.size}</Typography>
                      <Typography variant="subtitle2" sx={{ ml: 0.75, fontWeight: 700 }}>
                        x{item?.firstItem?.quantity}
                      </Typography>
                    </Stack>
                    <Typography variant="caption">{fViCurrency(item?.firstItem?.price)}</Typography>
                    <Typography
                      variant="subtitle2"
                      sx={
                        item && item.totalItems > 1
                          ? { ml: 0.75, fontWeight: 700 }
                          : { display: 'none' }
                      }
                    >
                      View more {item ? item.totalItems - 1 : 0}{' '}
                      {item && item.totalItems - 1 > 1 ? 'items' : 'item'}
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">Status</Typography>
                <Typography variant="caption">{item?.status}</Typography>
              </TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="caption">{fViCurrency(item?.total)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

OrderItemTable.propTypes = {
  orderItems: PropTypes.array,
  handleOrderClick: PropTypes.func,
};

export default function OrderView() {
  const [orderItems, setOrderItems] = useState([]);

  const { data: orderData } = useGetAllOrdersQuery({ userOnly: true, sort: 'desc' });

  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);

  const [selectedOrderCode, setSelectedOrderCode] = useState('');

  useEffect(() => {
    if (orderData) {
      setOrderItems(orderData?.data?.content);
    }
  }, [orderData]);

  const handleOrderClick = (item) => {
    setSelectedOrderCode(item?.code);
    setOrderDetailModalOpen(true);
  };

  if (orderItems.length === 0) {
    return (
      <EmptyContainer title='' message='You have no order yet.' />
    );
  }

  return (
    <Container>
      <ModalPopup open={orderDetailModalOpen} setOpen={setOrderDetailModalOpen}>
        <OrderSummary orderCode={selectedOrderCode} />
      </ModalPopup>
      <Box>
        <OrderItemTable orderItems={orderItems} handleOrderClick={handleOrderClick} />
      </Box>
    </Container>
  );
}
