import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import useNotify from 'src/hooks/use-notify';

import { fDateTime } from 'src/utils/format-time';
import { fViCurrency } from 'src/utils/format-number';

import { ORDER_STATUS } from 'src/config';
import { useGetOrderDetailQuery, useCancelOrderMutation, useGetOrderDetailByIdQuery } from 'src/app/api/order/orderApiSlice';

import Iconify from 'src/components/iconify';
import Loading from 'src/components/auth/Loading';
import { ColorPreview } from 'src/components/color-utils';

import OrderStatus from './order-status';

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
  const { t } = useTranslation('profile', { keyPrefix: 'order.detail-summary' });

  const { showErrorMsg } = useNotify();

  const [orderDetail, setOrderDetail] = useState({});

  const { data: orderDetailData, isLoading } = useGetOrderDetailQuery(orderCode, { skip: !orderCode });

  const { data: orderDetailData2, isLoading: isLoading2 } = useGetOrderDetailByIdQuery(orderId, { skip: !orderId });

  const [cancelOrder] = useCancelOrderMutation();

  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleCancelClick = async (id) => {
    try {
      setIsCanceling(true);
      await cancelOrder(id)
    } catch (error) {
      showErrorMsg(error);
    }
    setIsCanceling(false);
  }

  if (isLoading || isLoading2 || isCanceling) {
    return <Loading fullScreen/>;
  }

  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: '600', textAlign: 'center' }}>
        {t('title')}
      </Typography>
      <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
        <Box textAlign="center">
          <Typography variant="body2">{fDateTime(orderDetail?.createdAt)}</Typography>
          <Typography variant="body2">{t('no')}: {orderDetail?.code}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack direction="row" sx={{ px: 2, pt: 2, pb: 2 }} spacing={2}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t('current-status')}
        </Typography>
        <OrderStatus sx={{ fontWeight: 300 }} status={orderDetail?.status} />
      </Stack>

      {orderId &&
        <>
          <Divider />
          <Box sx={{ px: 2, pt: 2, pb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('user-account')}
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
          {t('shipping-address')}
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
          <Typography variant="body2">{t('subtotal')}</Typography>
          <Typography variant="body2">
            {fViCurrency(calOrderTotalPrice(orderDetail?.orderItems))}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{}}>
          <Typography variant="body2">{t('shipping')}</Typography>
          <Typography variant="body2">{fViCurrency(orderDetail?.shippingFee)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2">{t('payment-method.label')}</Typography>
          <Typography variant="body2">
            {t(`payment-method.${orderDetail?.paymentMethod}`)}
          </Typography>
        </Stack>

        <Divider />

        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
          <Typography variant="subtitle1">{t('total')}</Typography>
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
            {t('btn-refuse')}
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
            {t('btn-accept')}
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
            {t('btn-delivery')}
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
            {t('btn-done')}
          </Button>
        }

        {orderCode && orderDetail.status === ORDER_STATUS.ORDER &&
          <Button
            variant="contained"
            color='error'
            sx={{
              px: 4
            }}
            fullWidth
            onClick={() => handleCancelClick(orderDetail.id)}
            startIcon={<Iconify icon="eva:close-circle-outline" />}
          >
            {t('btn-cancel')}
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