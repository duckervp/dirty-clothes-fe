import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDateTime } from 'src/utils/format-time';
import { fViCurrency } from 'src/utils/format-number';

import { useGetAllOrdersQuery, useGetOrderDetailQuery } from 'src/app/api/order/orderApiSlice';

import ModalPopup from 'src/components/modal/modal';
import { ColorPreview } from 'src/components/color-utils';
import EmptyContainer from 'src/components/empty-container/empty-container';

const calOrderTotalPrice = (orderItems) => {
  if (!orderItems) return 0;
  let total = 0;

  for (let i = 0; i < orderItems.length; i += 1) {
    total += orderItems.at(i).price * orderItems.at(i).quantity;
  }

  return total;
};

function OrderSummary({ orderCode }) {
  const [orderDetail, setOrderDetail] = useState({});

  const { data: orderDetailData } = useGetOrderDetailQuery(orderCode);

  useEffect(() => {
    if (orderDetailData) {
      console.log(orderDetailData);
      setOrderDetail(orderDetailData.data);
    }
  }, [orderDetailData]);

  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: '600', textAlign: 'center' }}>
        Order Info
      </Typography>
      <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
        <Box textAlign="center">
          <Typography variant="body2">{fDateTime(orderDetail?.createdAt)}</Typography>
          <Typography variant="body2">No: {orderDetail?.code}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ px: 2, pt: 2, pb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Current status
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>
          {orderDetail?.status}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2, pt: 2, pb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Shipping Address
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
          {orderDetail?.address?.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
          {orderDetail?.address?.phone}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
          {orderDetail?.address?.detailAddress}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ pt: 2 }}>
        {orderDetail?.orderItems?.map((item, index) => (
          <CheckoutItem
            key={item?.orderDetailId}
            item={item}
            divider={index < orderDetail.orderItems.length - 1}
          />
        ))}

        <Divider sx={{ pt: 1, pb: 2 }} />

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">
            {fViCurrency(calOrderTotalPrice(orderDetail?.orderItems))}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{}}>
          <Typography variant="body2">Shipping</Typography>
          <Typography variant="body2">{fViCurrency(orderDetail?.shippingFee)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2">Payment Method</Typography>
          <Typography variant="body2">
            {orderDetail?.paymentMethod?.replaceAll('_', ' ')}
          </Typography>
        </Stack>

        <Divider />

        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1">{fViCurrency(orderDetail?.total)}</Typography>
        </Stack>
      </Box>
    </>
  );
}

OrderSummary.propTypes = {
  orderCode: PropTypes.string,
};

function CheckoutItem({ item, divider }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Box
          component="img"
          alt={item?.productName}
          src={item?.imageUrl}
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
            {item?.productName}
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

  const { data: orderData } = useGetAllOrdersQuery({ userOnly: true });

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
