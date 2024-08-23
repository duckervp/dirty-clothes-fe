import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
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
import ImageUploader from 'src/components/uploader/image-upload';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { applyFilter, getComparator } from 'src/components/table/utils';
import DeleteConfirmPopup from 'src/components/modal/delete-confirm-popup';

// ----------------------------------------------------------------------

function DetailForm({ data, colors, setData, isEdit, closePopup }) {
  const defaultState = {
    colorId: '',
    imageUrl: ''
  };

  const defaultErrState = {
    colorId: '',
    imageUrl: ''
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
        newErr[key] = 'Field value required!';
        isValid = false;
      }
    });
    setErr(newErr);
    return isValid;
  };

  const setImageUrl = (url) => {
    setState({ ...state, imageUrl: url });
  }

  return (
    <Stack spacing={3}>
      <Typography variant='subtitle1' textAlign="center">{isEdit ? "EDIT " : "CREATE "} PRODUCT DETAIL ITEM</Typography>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> Color
        </Typography>
        <Select id="select-color" value={state?.colorId} onChange={handleStateChange} name='colorId' fullWidth >
          {colors?.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> Image
        </Typography>
        <ImageUploader imageUrl={state.imageUrl} setImageUrl={setImageUrl} />
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
          CANCEL
        </LoadingButton>
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ mt: 3, width: "200px" }}
        >
          SAVE
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

export default function ProductDetailImage({ productDetailImages, setProductDetailImages, disabled }) {
  const [deleteMultipleItems, setDeleteMultipleItems] = useState(false);

  const [items, setItems] = useState([]);

  const { data: colorData } = useGetAllColorsQuery({ all: true });

  const [colors, setColors] = useState([]);

  useEffect(() => {
    setColors(colorData?.data?.content);
  }, [colorData]);

  const getColor = (id) => {
    const filteredColors = colors.filter(color => color.id === id);
    if (filteredColors.length > 0) {
      return filteredColors.at(0);
    }
    return { name: "", value: "" };
  }

  useEffect(() => {
    if (productDetailImages) {
      const sortedItems = [...productDetailImages];
      sortedItems.sort((a, b) => b.id - a.id);
      setItems(sortedItems);
    }
  }, [productDetailImages]);

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
    setProductDetailImages(newList);
  }

  const handleCreateNew = () => {
    setEditDetail(false);
    setDetailPopupOpen(true);
  }

  const handleRowClick = (id) => {

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
    setProductDetailImages(newList);
  }

  const handleItemSave = (item) => {
    console.log(item);
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

    const newItems = [...productDetailImages];
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

    setProductDetailImages(newItems);

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
        <Typography variant="subtitle2">Product Detail Images</Typography>

        {
          !disabled &&
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateNew}>
            New Image
          </Button>
        }
      </Stack>

      <DeleteConfirmPopup
        object={deleteMultipleItems && selected.length > 1 ? "images" : "image"}
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
                      { id: 'color', label: 'Color' },
                      { id: 'imageUrl', label: 'Image Url', align: "center" },
                      { id: 'createdAt', label: 'Created Date', align: "center" },
                    ] :
                    [
                      { id: 'color', label: 'Color' },
                      { id: 'imageUrl', label: 'Image Url', align: "center" },
                      { id: 'createdAt', label: 'Created Date', align: "center" },
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
                        { value: row.imageUrl, type: "image", align: "center" },
                        { value: row.createdAt, type: "datetime", align: "center" },
                      ]}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleEdit={() => handleEdit(row)}
                      handleDelete={() => handleDeleteCfOpenMenu(row.id)}
                      handleRowClick={() => handleRowClick(row.id)}
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
        />
      </Card>
    </Box>
  );
}

ProductDetailImage.propTypes = {
  productDetailImages: PropTypes.array,
  setProductDetailImages: PropTypes.func,
  disabled: PropTypes.bool,
}
