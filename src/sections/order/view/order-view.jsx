import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
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

import { PAGE_SIZE } from 'src/config';
import { useGetAllOrdersQuery } from 'src/app/api/order/orderApiSlice';

import ModalPopup from 'src/components/modal/modal';
import { ColorPreview } from 'src/components/color-utils';
import PageDisplay from 'src/components/pagination/PageDisplay';
import EmptyContainer from 'src/components/empty-container/empty-container';

import OrderStatus from '../order-status';
import OrderSummary from '../order-summary';

function OrderItemTable({ orderItems, handleOrderClick }) {
  const { t } = useTranslation('profile', { keyPrefix: 'order' });
  return (
    <>
      <Typography variant="h5">{t('title')}</Typography>
      <Card>

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
    </>
  );
}

OrderItemTable.propTypes = {
  orderItems: PropTypes.array,
  handleOrderClick: PropTypes.func,
};

export default function OrderView() {
  const { t } = useTranslation('profile', { keyPrefix: 'order' });

  const [orderItems, setOrderItems] = useState([]);

  const [params] = useSearchParams();

  const page = params.get('page') || 1;

  const [totalPage, setTotalPage] = useState(0);

  const { data: orderData, isLoading } = useGetAllOrdersQuery({ userOnly: true, sort: 'desc', pageNo: page - 1, pageSize: PAGE_SIZE });

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

  if (!isLoading && orderData?.data?.totalPages === 0) {
    return (
      <EmptyContainer title='' message={t('no-order')} />
    );
  }

  return (
    <Container>
      <ModalPopup open={orderDetailModalOpen} setOpen={setOrderDetailModalOpen} sx={{ pt: 2, pb: 5 }}>
        <OrderSummary orderCode={selectedOrderCode} />
      </ModalPopup>
      <Box>
        <OrderItemTable orderItems={orderItems} handleOrderClick={handleOrderClick} />
        <PageDisplay totalPage={totalPage} page={page} />
      </Box>
    </Container>
  );
}
