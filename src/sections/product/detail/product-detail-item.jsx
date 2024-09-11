import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { SIZE_OPTIONS } from 'src/config';
import { useGetAllColorsQuery } from 'src/app/api/color/colorApiSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ModalPopup from 'src/components/modal/modal';
import CustomTableRow from 'src/components/table/table-row';
import TableNoData from 'src/components/table/table-no-data';
import CustomTableHead from 'src/components/table/table-head';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { applyFilter, getComparator } from 'src/components/table/utils';
import DeleteConfirmPopup from 'src/components/modal/delete-confirm-popup';

// ----------------------------------------------------------------------

function DetailForm({ data, colors, setData, isEdit, closePopup }) {
  const { t } = useTranslation('product-m', { keyPrefix: 'product-detail.product-item.form' });

  const defaultState = {
    colorId: '',
    size: '',
    inventory: 0,
    sold: 0
  };

  const defaultErrState = {
    colorId: "",
    size: "",
    inventory: "",
    sold: ""
  };

  const [state, setState] = useState(defaultState);
  const [err, setErr] = useState(defaultErrState);

  useEffect(() => {
    if (isEdit) {
      setState(data);
    }
  }, [data, isEdit]);

  const handleStateChange = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setState(newState);

    if (err[e.target.name] !== '') {
      const newErr = { ...err };
      newErr[e.target.name] = '';
      setErr(newErr);
    }
  };

  const handleClick = async (e) => {
    if (!validate()) return;

    setData({ ...state });
  };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        newErr[key] = t('error.field-required');
        isValid = false;
      }
    });
    setErr(newErr);
    return isValid;
  };

  return (
    <Stack spacing={3}>
      <Typography variant='subtitle1' textAlign="center">
        {isEdit ? t('edit-item-title') : t('create-item-title')}
      </Typography>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('color')}
        </Typography>
        <Select id="select-color" value={state?.colorId} onChange={handleStateChange} name='colorId' fullWidth >
          {colors?.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
        {err.colorId && <Typography variant="caption" color="red">
          {err.colorId}
        </Typography>}
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('size')}
        </Typography>
        <Select id="select-size" value={state?.size} onChange={handleStateChange} name='size' fullWidth >
          {SIZE_OPTIONS.map(item => <MenuItem key={item.label} value={item.label}>{item.label}</MenuItem>)}
        </Select>
        {err.size && <Typography variant="caption" color="red">
          {err.size}
        </Typography>}
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('inventory')}
        </Typography>
        <TextField
          name="inventory"
          fullWidth
          autoComplete="off"
          value={state?.inventory}
          onChange={handleStateChange}
          error={err.inventory !== ''}
          helperText={err.inventory !== '' && err.inventory}
          type='number'
        />
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('sold')}
        </Typography>
        <TextField
          name="sold"
          fullWidth
          autoComplete="off"
          value={state?.sold}
          onChange={handleStateChange}
          error={err.sold !== ''}
          helperText={err.sold !== '' && err.sold}
          type='number'
        />
      </Box>

      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={closePopup}
          sx={{ mt: 3, width: "200px" }}
        >
          {t('btn-cancel')}
        </LoadingButton>
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ mt: 3, width: "200px" }}
        >
          {t('btn-save')}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

DetailForm.propTypes = {
  data: PropTypes.object,
  colors: PropTypes.array,
  setData: PropTypes.func,
  isEdit: PropTypes.bool,
  closePopup: PropTypes.func,
}

export default function ProductDetailItem({ productDetailItems, setProductDetailItems, disabled }) {
  const { t } = useTranslation('product-m', { keyPrefix: 'product-detail.product-item' });

  const [deleteMultipleItems, setDeleteMultipleItems] = useState(false);

  const [items, setItems] = useState([]);

  const { data: colorData } = useGetAllColorsQuery({ all: true });

  const [colors, setColors] = useState([]);

  const getColor = (id) => {
    const filteredColors = colors?.filter(color => color.id === id) || [];
    if (filteredColors.length > 0) {
      return filteredColors.at(0);
    }
    return { name: "", value: "" };
  }

  useEffect(() => {
    setColors(colorData?.data?.content);
  }, [colorData]);


  useEffect(() => {
    if (productDetailItems) {
      const sortedItems = [...productDetailItems];
      sortedItems.sort((a, b) => b.id - a.id);
      setItems(sortedItems);
    }
  }, [productDetailItems]);

  const [detailPopupOpen, setDetailPopupOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [editDetail, setEditDetail] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('colorId');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items?.map((n) => n.id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: items,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  //----------------------
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditDetail(true);
    setDetailPopupOpen(true);
  }

  const handleDelete = async (id) => {
    const newList = items.filter(item => item.id !== id);
    setProductDetailItems(newList);
  }

  const handleCreateNew = () => {
    setEditDetail(false);
    setDetailPopupOpen(true);
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
    const newList = items.filter(item => !selected.includes(item.id));
    setProductDetailItems(newList);
  }

  const handleItemSave = (item) => {
    const { size } = item;
    const sizeValues = SIZE_OPTIONS.filter(s => s.label === size);
    let sizeValue = '';
    if (sizeValues.length > 0) {
      sizeValue = sizeValues.at(0).value;
    }
    const finalItem = {
      ...item,
      size: sizeValue,
      id: item.id ? item.id : Number.MAX_SAFE_INTEGER
    }

    const newItems = [...productDetailItems];
    if (editDetail) {
      let index = -1;
      for (let i = 0; i < newItems.length; i += 1) {
        if (newItems.at(i).id === finalItem.id) {
          index = i;
        }
      }

      newItems.splice(index, 1, finalItem);
    } else {
      newItems.push(finalItem);
    }

    setProductDetailItems(newItems);

    setDetailPopupOpen(false);
  }

  return (
    <Box>
      <ModalPopup open={detailPopupOpen} setOpen={setDetailPopupOpen}>
        <DetailForm
          data={selectedItem}
          colors={colors}
          isEdit={editDetail}
          setData={handleItemSave}
          closePopup={() => setDetailPopupOpen(false)}
        />
      </ModalPopup>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle2">{t('title')}</Typography>

        {
          !disabled &&
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateNew}>
            {t('btn-new')}
          </Button>
        }
      </Stack>

      <DeleteConfirmPopup
        object={deleteMultipleItems && selected.length > 1 ? t('delete-pu.plural-noun') : t('delete-pu.single-noun')}
        plural={deleteMultipleItems && selected.length > 1}
        popupOpen={deleteCfOpen}
        setPopupOpen={setDeleteCfOpen}
        handleCancel={handleCloseDeleteCfMenu}
        handleConfirm={handleConfirmDelete}
      />

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
                rowCount={items?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={
                  disabled ?
                    [
                      { id: 'color', label: t('table-column.color') },
                      { id: 'size', label: t('table-column.size') },
                      { id: 'inventory', label: t('table-column.inventory') },
                      { id: 'sold', label: t('table-column.sold') },
                      { id: 'createdAt', label: t('table-column.created-at'), align: "center" },
                    ] :
                    [
                      { id: 'color', label: t('table-column.color') },
                      { id: 'size', label: t('table-column.size') },
                      { id: 'inventory', label: t('table-column.inventory') },
                      { id: 'sold', label: t('table-column.sold') },
                      { id: 'createdAt', label: t('table-column.created-at'), align: "center" },
                      { id: '' },
                    ]
                }
                disabled={disabled}
              />

              <TableBody>
                {items?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CustomTableRow
                      key={row.id}
                      cells={[
                        { value: getColor(row.colorId).value, type: "color", label: getColor(row.colorId).name },
                        { value: row.size },
                        { value: row.inventory },
                        { value: row.sold },
                        { value: row.createdAt, type: "datetime", align: "center" },
                      ]}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleEdit={() => handleEdit(row)}
                      handleDelete={() => handleDeleteCfOpenMenu(row.id)}
                      disabled={disabled}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('table-pagination.label-row-per-page')}
          labelDisplayedRows={
            ({ from, to, count }) =>
              `${from}–${to} ${t('table-pagination.label-displayed-row')} ${count}`
          }
        />
      </Card>
    </Box>
  );
}

ProductDetailItem.propTypes = {
  productDetailItems: PropTypes.array,
  setProductDetailItems: PropTypes.func,
  disabled: PropTypes.bool,
}
