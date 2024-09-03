import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import PaginationItem from '@mui/material/PaginationItem';

import { useRouter } from 'src/routes/hooks';
import { absolutePath, ORDER_MANAGEMENT } from 'src/routes/route-config';

import { fViCurrency } from 'src/utils/format-number';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import { PAGE_SIZE, ORDER_STATUS } from 'src/config';
import { useGetAllOrdersQuery, useBulkActionMutation, useUpdateOrderStatusMutation } from 'src/app/api/order/orderApiSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Loading from 'src/components/auth/Loading';
import ModalPopup from 'src/components/modal/modal';
import TableNoData from 'src/components/table/table-no-data';
import CustomTableHead from 'src/components/table/table-head';
import TableEmptyRows from 'src/components/table/table-empty-rows';

import OrderSummary from 'src/sections/order/order-summary';

import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';

// ----------------------------------------------------------------------

export default function OrderView() {
  const router = useRouter();

  const [params] = useSearchParams();

  const [totalPage, setTotalPage] = useState(0);

  const page = params.get('page') || 1;

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [selectedOrders, setSelectedOrders] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [nameFilter, setNameFilter] = useState('');

  const { data: orderData, isLoading } = useGetAllOrdersQuery({
    pageNo: page - 1,
    pageSize: PAGE_SIZE,
    sort: order,
    sortBy: orderBy,
    name: nameFilter.trim() !== '' ? nameFilter : undefined
  });

  useEffect(() => {
    if (orderData) {
      const { totalPages } = orderData.data;
      setTotalPage(totalPages);
    }
  }, [orderData]);

  useEffect(() => {
    if (orderData && selected) {
      const selectedItems = selected.map(id => {
        let selectedOrder = null;
        orderData?.data?.content.forEach(item => {
          if (item.id === id) {
            selectedOrder = item;
          }
        })
        return selectedOrder;
      });
      setSelectedOrders(selectedItems);
    }
  }, [orderData, selected]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderData?.data?.content?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNameFilter(filterName);
    }, 500)

    return () => clearTimeout(timer)
  }, [filterName])

  const notFound = totalPage === 0;

  //----------------------
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [bulkAction] = useBulkActionMutation();

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const { data } = await updateOrderStatus({ id, payload: { status } }).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  const handleAccept = (id) => handleUpdateOrderStatus(id, ORDER_STATUS.ACCEPTED);
  const handleRefuse = (id) => handleUpdateOrderStatus(id, ORDER_STATUS.REFUSED);
  const handleDelivery = (id) => handleUpdateOrderStatus(id, ORDER_STATUS.DELIVERY);
  const handleDone = (id) => handleUpdateOrderStatus(id, ORDER_STATUS.DONE);

  const handleBulkAction = async (status) => {
    try {
      const { data } = await bulkAction({ status, orderIds: selected }).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  const handleBulkActionAccept = () => handleBulkAction(ORDER_STATUS.ACCEPTED);
  const handleBulkActionRefuse = () => handleBulkAction(ORDER_STATUS.REFUSED);
  const handleBulkActionDelivery = () => handleBulkAction(ORDER_STATUS.DELIVERY);
  const handleBulkActionDone = () => handleBulkAction(ORDER_STATUS.DONE);

  const handleCreateNew = () => {
    router.push(absolutePath(ORDER_MANAGEMENT.CREATE));
  }

  const handleRowClick = (id) => {
    setSelectedOrderId(id);
    setOrderDetailModalOpen(true);
  }

  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(0);

  return (
    <Container>
      <ModalPopup open={orderDetailModalOpen} setOpen={setOrderDetailModalOpen}>
        <OrderSummary
          orderId={selectedOrderId}
          handleAccept={handleAccept}
          handleRefuse={handleRefuse}
          handleDelivery={handleDelivery}
          handleDone={handleDone}
        />
      </ModalPopup>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Orders</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleCreateNew}
          sx={{ display: 'none' }}
        >
          New Order
        </Button>
      </Stack>

      {isLoading && <Loading type='linear' />}
      <Card>
        <OrderTableToolbar
          selected={selectedOrders}
          filterName={filterName}
          onFilterName={handleFilterByName}
          handleBulkActionAccept={handleBulkActionAccept}
          handleBulkActionRefuse={handleBulkActionRefuse}
          handleBulkActionDelivery={handleBulkActionDelivery}
          handleBulkActionDone={handleBulkActionDone}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orderData?.data?.content?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'code', label: 'Order No' },
                  { id: 'user', label: 'User' },
                  { id: 'totalItems', label: 'No Of Items', align: "center" },
                  { id: 'total', label: 'Total' },
                  { id: 'status', label: 'Status' },
                  { id: 'createdAt', label: 'Created Date', align: "center" },
                  { id: '' },
                ]}
              />
              {!isLoading && <TableBody>
                {orderData?.data?.content
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      cells={[
                        { value: row.code, type: "code" },
                        { value: row.user.name },
                        { value: row.totalItems, align: "center" },
                        { value: fViCurrency(row.total) },
                        { value: row.status },
                        { value: row.createdAt, type: "datetime", align: "center" },
                      ]}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleAccept={() => handleAccept(row.id)}
                      handleRefuse={() => handleRefuse(row.id)}
                      handleDelivery={() => handleDelivery(row.id)}
                      handleDone={() => handleDone(row.id)}
                      handleRowClick={() => handleRowClick(row.id)}
                      orderStatus={row.status}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>}
            </Table>
          </TableContainer>
        </Scrollbar>

        {totalPage > 1 && (
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap-reverse"
            justifyContent="flex-end"
            sx={{ mt: 3, mb: 2 }}
          >
            <Pagination
              page={parseInt(page, 10)}
              count={totalPage}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                  {...item}
                />
              )}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        )}
      </Card>
    </Container>
  );
}
