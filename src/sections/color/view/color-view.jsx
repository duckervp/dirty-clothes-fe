import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';
import { getUrl, COLOR_MANAGEMENT } from 'src/routes/route-config';

import { handleError, showSuccessMessage } from 'src/utils/notify';

import { PAGE_SIZE } from 'src/config';
import { useGetColorsQuery, useDeleteColorMutation, useDeleteColorsMutation } from 'src/app/api/color/colorApiSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Loading from 'src/components/auth/Loading';
import CustomTableRow from 'src/components/table/table-row';
import TableNoData from 'src/components/table/table-no-data';
import CustomTableHead from 'src/components/table/table-head';
import TableToolbar from 'src/components/table/table-toolbar';
import PageDisplay from 'src/components/pagination/PageDisplay';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import DeleteConfirmPopup from 'src/components/modal/delete-confirm-popup';

// ----------------------------------------------------------------------

export default function ColorView() {
  const { t } = useTranslation('color');

  const router = useRouter();

  const [params] = useSearchParams();

  const [totalPage, setTotalPage] = useState(0);

  const page = params.get('page') || 1;

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [nameFilter, setNameFilter] = useState('');

  const [deleteMultipleItems, setDeleteMultipleItems] = useState(false);

  const { data: colorData, isLoading } = useGetColorsQuery({
    pageNo: page - 1,
    pageSize: PAGE_SIZE,
    sort: order,
    sortBy: orderBy,
    name: nameFilter.trim() !== '' ? nameFilter : undefined
  });

  useEffect(() => {
    if (colorData) {
      const { totalPages } = colorData.data;
      setTotalPage(totalPages);
    }
  }, [colorData]);

  const [deleteColor] = useDeleteColorMutation();

  const [deleteColors] = useDeleteColorsMutation();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = colorData?.data?.content?.map((n) => n.id);
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
    router.push(getUrl(COLOR_MANAGEMENT.EDIT, { id }));
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteColor(id).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  const handleCreateNew = () => {
    router.push(getUrl(COLOR_MANAGEMENT.CREATE));
  }

  const handleRowClick = (id) => {
    router.push(getUrl(COLOR_MANAGEMENT.DETAILS, { id }));
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
      const { data } = await deleteColors(selected).unwrap();
      showSuccessMessage(data);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">{t('title')}</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateNew}>
          {t('btn-new')}
        </Button>
      </Stack>

      <DeleteConfirmPopup
        object={
          deleteMultipleItems
            && selected.length > 1 ? t('delete-pu.plural-noun') : t('delete-pu.single-noun')
        }
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
                rowCount={colorData?.data?.content?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: t('table-column.name') },
                  { id: 'createdAt', label: t('table-column.created-at'), align: "center" },
                  { id: 'createdBy', label: t('table-column.created-by') },
                  { id: '' },
                ]}
              />
              {!isLoading && <TableBody>
                {colorData?.data?.content
                  .map((row) => (
                    <CustomTableRow
                      key={row.id}
                      cells={[
                        { value: row.value, label: row.name, type: "color" },
                        { value: row.createdAt, type: "datetime", align: "center" },
                        { value: row.createdBy },
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

        <PageDisplay totalPage={totalPage} page={page} />
      </Card>
    </Container>
  );
}