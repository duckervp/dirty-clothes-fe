import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';
import { fViCurrency } from 'src/utils/format-number';

import { ORDER_STATUS } from 'src/config';
import { useGetOrderDetailQuery, useGetOrderDetailByIdQuery } from 'src/app/api/order/orderApiSlice';

import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

const calOrderTotalPrice = (orderItems) => {
  if (!orderItems) return 0;
  let total = 0;

  for (let i = 0; i < orderItems.length; i += 1) {
    total += orderItems.at(i).price * orderItems.at(i).quantity;
  }

  return total;
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

export default function OrderSummary({
  orderId,
  orderCode,
  handleAccept,
  handleRefuse,
  handleDelivery,
  handleDone
}) {
  const [orderDetail, setOrderDetail] = useState({});

  const { data: orderDetailData } = useGetOrderDetailQuery(orderCode, { skip: !orderCode });

  const { data: orderDetailData2 } = useGetOrderDetailByIdQuery(orderId, { skip: !orderId });

  useEffect(() => {
    if (orderDetailData) {
      setOrderDetail(orderDetailData.data);
    } else if (orderDetailData2) {
      setOrderDetail(orderDetailData2.data);
    }
  }, [orderDetailData, orderDetailData2]);

  const handleAcceptClick = (id) => {
    handleAccept(id);
  }

  const handleRefuseClick = (id) => {
    handleRefuse(id);
  }

  const handleDeliveryClick = (id) => {
    handleDelivery(id);
  }

  const handleDoneClick = (id) => {
    handleDone(id);
  }

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

      {orderId &&
        <>
          <Divider />
          <Box sx={{ px: 2, pt: 2, pb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              User Account
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>
              {orderDetail?.user?.name || "test"}
            </Typography>
          </Box>
        </>
      }

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

      <Stack spacing={1} direction="row">
        {orderDetail.status === ORDER_STATUS.ORDER && handleRefuse &&
          <Button
            variant="contained"
            color='error'
            sx={{
              px: 4
            }}
            fullWidth
            onClick={() => handleRefuseClick(orderDetail.id)}
            startIcon={<Iconify icon="eva:close-circle-outline" />}
          >
            Refuse
          </Button>
        }
        {orderDetail.status === ORDER_STATUS.ORDER && handleAccept &&
          <Button
            variant="contained"
            color='primary'
            sx={{
              px: 4,
            }}
            fullWidth
            onClick={() => handleAcceptClick(orderDetail.id)}
            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          >
            Accept
          </Button>
        }
        {orderDetail.status === ORDER_STATUS.ACCEPTED && handleDelivery &&
          <Button
            variant="contained"
            color='info'
            sx={{
              px: 4
            }}
            fullWidth
            onClick={() => handleDeliveryClick(orderDetail.id)}
            startIcon={<Iconify icon="eva:car-fill" />}
          >
            Delivery
          </Button>
        }
        {orderDetail.status === ORDER_STATUS.DELIVERY && handleDone &&
          <Button
            variant="contained"
            color='success'
            sx={{
              px: 4
            }}
            fullWidth
            onClick={() => handleDoneClick(orderDetail.id)}
            startIcon={<Iconify icon="eva:archive-fill" />}
          >
            Done
          </Button>
        }
      </Stack>
    </>
  );
}

OrderSummary.propTypes = {
  orderId: PropTypes.number,
  orderCode: PropTypes.string,
  handleAccept: PropTypes.func,
  handleDelivery: PropTypes.func,
  handleDone: PropTypes.func,
  handleRefuse: PropTypes.func,
};