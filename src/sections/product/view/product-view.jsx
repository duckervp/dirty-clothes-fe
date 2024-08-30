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

import { fViCurrency } from 'src/utils/format-number';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import { PAGE_SIZE } from 'src/config';
import { useGetAdminProductsQuery, useDeleteProductMutation, useDeleteProductsMutation } from 'src/app/api/product/productApiSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Loading from 'src/components/auth/Loading';
import CustomTableRow from 'src/components/table/table-row';
import TableNoData from 'src/components/table/table-no-data';
import CustomTableHead from 'src/components/table/table-head';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import DeleteConfirmPopup from 'src/components/modal/delete-confirm-popup';

// ----------------------------------------------------------------------

export default function ProductView() {
  const router = useRouter();

  const [params] = useSearchParams();

  const [totalPage, setTotalPage] = useState(0);

  const page = params.get('page') || 1;

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [nameFilter, setNameFilter] = useState('');

  const [deleteMultipleItems, setDeleteMultipleItems] = useState(false);

  const { data: productData, isLoading } = useGetAdminProductsQuery({
    pageNo: page - 1,
    pageSize: PAGE_SIZE,
    sort: order,
    sortBy: orderBy,
    name: nameFilter.trim() !== '' ? nameFilter : undefined
  });

  useEffect(() => {
    if (productData) {
      const { totalPages } = productData.data;
      setTotalPage(totalPages);
    }
  }, [productData]);

  const [deleteProduct] = useDeleteProductMutation();

  const [deleteProducts] = useDeleteProductsMutation();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productData?.data?.content?.map((n) => n.id);
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
  const handleEdit = (id) => {
    router.push(`/admin/product-management/edit-product/${id}`);
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteProduct(id).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  const handleCreateNew = () => {
    router.push(`/admin/product-management/create-product`);
  }

  const handleRowClick = (id) => {
    router.push(`/admin/product-management/product-details/${id}`);
  }

  const [deleteCfOpen, setDeleteCfOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const handleDeleteCfOpenMenu = (id) => {
    setDeleteId(id);
    setDeleteCfOpen(true);
  };

  const handleCloseDeleteCfMenu = () => {
    setDeleteCfOpen(false);
    setDeleteMultipleItems(false);
  };

  const handleConfirmDelete = () => {
    if (deleteMultipleItems) {
      handleDeleteSelectedItems();
      setDeleteMultipleItems(false);
      handleCloseDeleteCfMenu();
      setSelected([]);
    } else {
      handleDelete(deleteId);
      handleCloseDeleteCfMenu();
    }
  }

  const handleDeleteMultipleItems = () => {
    setDeleteCfOpen(true);
    setDeleteMultipleItems(true);
  }

  const handleDeleteSelectedItems = async () => {
    try {
      const { data } = await deleteProducts(selected).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateNew}>
          New Product
        </Button>
      </Stack>

      <DeleteConfirmPopup
        object={deleteMultipleItems && selected.length > 1 ? "products" : "product"}
        plural={deleteMultipleItems && selected.length > 1}
        popupOpen={deleteCfOpen}
        setPopupOpen={setDeleteCfOpen}
        handleCancel={handleCloseDeleteCfMenu}
        handleConfirm={handleConfirmDelete}
      />

      {isLoading && <Loading type='linear' />}
      <Card>
        <TableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          handleDeleteMultipleItems={handleDeleteMultipleItems}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                order={order}
                orderBy={orderBy}
                rowCount={productData?.data?.content?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'price', label: 'Price' },
                  { id: 'sale', label: 'Sale Price' },
                  { id: 'status', label: 'Status', align: "center" },
                  { id: 'createdAt', label: 'Created Date', align: "center" },
                  { id: '' },
                ]}
              />
              {!isLoading && <TableBody>
                {productData?.data?.content
                  .map((row) => (
                    <CustomTableRow
                      key={row.id}
                      cells={[
                        { value: row.name, type: "composite2", imgUrl: row.avatarUrl },
                        { value: fViCurrency(row.price) },
                        { value: fViCurrency(row.salePrice) },
                        { value: row.status, align: "center" },
                        { value: row.createdAt, type: "datetime", align: "center" },
                      ]}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleEdit={() => handleEdit(row.id)}
                      handleDelete={() => handleDeleteCfOpenMenu(row.id)}
                      handleRowClick={() => handleRowClick(row.id)}
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
