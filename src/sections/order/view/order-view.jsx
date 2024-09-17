import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

import { useResponsive } from 'src/hooks/use-responsive';

import { fViCurrency } from 'src/utils/format-number';

import { PAGE_SIZE, ORDER_STATUS } from 'src/config';
import { useGetAllOrdersQuery } from 'src/app/api/order/orderApiSlice';

import ModalPopup from 'src/components/modal/modal';
import { ColorPreview } from 'src/components/color-utils';
import PageDisplay from 'src/components/pagination/PageDisplay';
import EmptyContainer from 'src/components/empty-container/empty-container';

import CheckoutItem from 'src/sections/cart/checkout-item';

import OrderStatus from '../order-status';
import OrderFilter from '../order-filter';
import OrderSummary from '../order-summary';
import OrderNoData from '../order-not-found';

function OrderItemTable({ orderItems, handleOrderClick }) {
  const { t } = useTranslation('profile', { keyPrefix: 'order' });
  return (
    <Card>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="order item table">
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
                      <Typography variant="subtitle2">{t('order-no')}</Typography>
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
                          item && item.totalItemQuantity > 1
                            ? { ml: 0.75, fontWeight: 700 }
                            : { display: 'none' }
                        }
                      >
                        View more {item && item.firstItem ? item.totalItemQuantity - item.firstItem.quantity : 0}{' '}
                        {item && item.firstItem && item.totalItemQuantity - item.firstItem.quantity > 1 ? 'items' : 'item'}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2">{t('status')}</Typography>
                  <OrderStatus sx={{ fontWeight: 300 }} status={item?.status} />
                </TableCell>
                <TableCell align="center" sx={{ width: '150px' }}>
                  <Typography variant="subtitle2">{t('total')}</Typography>
                  <Typography variant="subtitle2">{fViCurrency(item?.total)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

OrderItemTable.propTypes = {
  orderItems: PropTypes.array,
  handleOrderClick: PropTypes.func,
};

function OrderItemStack({ orderItems, handleOrderClick }) {
  const { t } = useTranslation('profile', { keyPrefix: 'order' });
  return (

    <Card sx={{ py: 1 }}>
      {orderItems?.map((item, index) => (
        <Stack key={item?.id} onClick={() => handleOrderClick(item)}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 0.5 }} >
            <Tooltip title={item?.code}>
              <Typography variant="subtitle2">
                {item?.code?.length > 20
                  ? item?.code?.slice(0, 20).concat('...')
                  : item?.code}
              </Typography>
            </Tooltip>
            <OrderStatus sx={{ fontWeight: 300 }} status={item?.status} />
          </Stack>
          <Stack sx={{ px: 1, py: 0.5 }} >
            <CheckoutItem
              item={item?.firstItem}
              divider={false}
              viewMoreQuantity={item.totalItemQuantity - item.firstItem.quantity || 0}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                  {item?.totalItemQuantity} {" "}
                  {item?.totalItemQuantity > 1 ? t('items') : t('item')}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Typography variant="subtitle2">{t('total')}:</Typography>
                <Typography variant="subtitle2">{fViCurrency(item?.total)}</Typography>
              </Stack>
            </Stack>
          </Stack>
          {index < orderItems.length - 1 && <Divider sx={{ mt: 1 }} />}
          {index < orderItems.length - 1 && <Divider sx={{ mt: 1 }} />}
        </Stack>
      ))}
    </Card>
  );
}

OrderItemStack.propTypes = {
  orderItems: PropTypes.array,
  handleOrderClick: PropTypes.func,
};

export default function OrderView() {
  const { t } = useTranslation('profile', { keyPrefix: 'order' });

  const mdUp = useResponsive('up', 'md');

  const [orderItems, setOrderItems] = useState([]);

  const [params] = useSearchParams();

  const page = params.get('page') || 1;

  const [totalPage, setTotalPage] = useState(0);

  const [filter, setFilter] = useState({ orderStatus: ORDER_STATUS.ALL });

  const getParams = () => {
    const orderParams = {
      userOnly: true,
      sort: 'desc',
      pageNo: page - 1,
      pageSize: PAGE_SIZE
    };

    if (filter.orderStatus !== ORDER_STATUS.ALL) {
      orderParams.status = filter.orderStatus;
    }

    return orderParams;
  }

  const { data: orderData, isLoading } = useGetAllOrdersQuery(getParams());

  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);

  const [selectedOrderCode, setSelectedOrderCode] = useState('');

  useEffect(() => {
    if (orderData) {
      setOrderItems(orderData?.data?.content);
      setTotalPage(orderData?.data?.totalPages);
    }
  }, [orderData]);

  const handleOrderClick = (item) => {
    setSelectedOrderCode(item?.code);
    setOrderDetailModalOpen(true);
  };

  if (!isLoading && !getParams().status && orderData?.data?.totalPages === 0) {
    return (
      <EmptyContainer title='' message={t('no-order-message')} />
    );
  }

  return (
    <Container>
      <ModalPopup open={orderDetailModalOpen} setOpen={setOrderDetailModalOpen} sx={{ pt: 2, pb: 5 }}>
        <OrderSummary orderCode={selectedOrderCode} />
      </ModalPopup>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{t('title')}</Typography>
          <OrderFilter state={filter} setState={setFilter} />
        </Stack>
        {
          !isLoading && getParams().status && orderItems.length === 0 &&
          <OrderNoData query={t(`status-option.${getParams().status}`)} />
        }
        {
          mdUp ?
            <OrderItemTable orderItems={orderItems} handleOrderClick={handleOrderClick} /> :
            <OrderItemStack orderItems={orderItems} handleOrderClick={handleOrderClick} />
        }
        <PageDisplay totalPage={totalPage} page={page} />
      </Box>
    </Container>
  );
}
