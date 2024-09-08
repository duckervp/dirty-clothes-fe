import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TableContainer from '@mui/material/TableContainer';

import { useResponsive } from 'src/hooks/use-responsive';

import { showErrorMessage } from 'src/utils/notify';

import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from 'src/app/api/address/addressApiSlice';

import ModalPopup from 'src/components/modal/modal';
import CustomTableRow from 'src/components/table/table-row';
import DeleteConfirmPopup from 'src/components/modal/delete-confirm-popup';

import AddressForm from 'src/sections/payment/address-form';

import AddressItem from '../address-item';

function AddressTable({ addresses, setAddresses, handleEdit }) {
  const { t } = useTranslation('profile', { keyPrefix: 'address.table-column' });

  const [deleteAddress] = useDeleteAddressMutation();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deleteCfOpen, setDeleteCfOpen] = useState(false);

  const handleDeleteCfOpenMenu = (address) => {
    setSelectedAddress(address);
    setDeleteCfOpen(true);
  };

  const handleCloseDeleteCfMenu = () => {
    setDeleteCfOpen(false);
  };

  const handleConfirmDeleteAddress = async () => {
    try {
      await deleteAddress(selectedAddress?.id).unwrap();
      const indexOfDeletedElement = addresses.indexOf(selectedAddress);
      const newAddresses = [...addresses];
      newAddresses.splice(indexOfDeletedElement, 1);
      setAddresses(newAddresses);
    } catch (error) {
      showErrorMessage(error);
    }
    handleCloseDeleteCfMenu();
  }

  return (
    <TableContainer component={Paper}>
      <DeleteConfirmPopup
        popupOpen={deleteCfOpen}
        setPopupOpen={setDeleteCfOpen}
        handleCancel={handleCloseDeleteCfMenu}
        handleConfirm={handleConfirmDeleteAddress}
      />
      <Table sx={{ minWidth: 650 }} aria-label="address table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'black' }}>{t('name')}</TableCell>
            <TableCell sx={{ color: 'black' }}>
              {t('detail-address')}
            </TableCell>
            <TableCell sx={{ color: 'black' }}>
              {t('phone')}
            </TableCell>
            <TableCell sx={{ color: 'black' }}>
              {t('note')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              { }
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses?.map((row) => (
            <CustomTableRow
              noSelect
              key={row.id}
              cells={[
                { value: row.name },
                { value: row.detailAddress },
                { value: row.phone },
                { value: row.note },
              ]}
              handleEdit={() => handleEdit(row)}
              handleDelete={() => handleDeleteCfOpenMenu(row)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

AddressTable.propTypes = {
  addresses: PropTypes.array,
  setAddresses: PropTypes.func,
  handleEdit: PropTypes.func,
};

function AddressStack({ addresses, setAddresses, handleEdit }) {
  // const { t } = useTranslation('profile', { keyPrefix: 'address.table-column' });

  const [deleteAddress] = useDeleteAddressMutation();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deleteCfOpen, setDeleteCfOpen] = useState(false);

  const handleDeleteCfOpenMenu = (address) => {
    setSelectedAddress(address);
    setDeleteCfOpen(true);
  };

  const handleCloseDeleteCfMenu = () => {
    setDeleteCfOpen(false);
  };

  const handleConfirmDeleteAddress = async () => {
    try {
      await deleteAddress(selectedAddress?.id).unwrap();
      const indexOfDeletedElement = addresses.indexOf(selectedAddress);
      const newAddresses = [...addresses];
      newAddresses.splice(indexOfDeletedElement, 1);
      setAddresses(newAddresses);
    } catch (error) {
      showErrorMessage(error);
    }
    handleCloseDeleteCfMenu();
  }

  return (
    <Box>
      <DeleteConfirmPopup
        popupOpen={deleteCfOpen}
        setPopupOpen={setDeleteCfOpen}
        handleCancel={handleCloseDeleteCfMenu}
        handleConfirm={handleConfirmDeleteAddress}
      />
      <Stack>
        {addresses?.map((item) => (
          <Card key={item?.id} sx={{ mb: 1 }}>
            <AddressItem
              address={item}
              handleDelete={() => handleDeleteCfOpenMenu(item)}
              handleEdit={() => handleEdit(item)}
            />
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

AddressStack.propTypes = {
  addresses: PropTypes.array,
  setAddresses: PropTypes.func,
  handleEdit: PropTypes.func,
};

const ProfileAddressView = () => {
  const { t } = useTranslation('profile', { keyPrefix: 'address' });

  const mdUp = useResponsive('up', 'md');

  const defaultState = useMemo(() => ({
    name: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    phone: '',
    zip: '',
    note: ''
  }), []);

  const [err, setErr] = useState(defaultState);

  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState(defaultState);

  const [ward, setWard] = useState(null);

  const { data: addressData } = useGetAllAddressesQuery({ userOnly: true });

  const [createAddress] = useCreateAddressMutation();

  const [updateAddress] = useUpdateAddressMutation();

  const [createFormOpen, setCreateFromOpen] = useState(false);

  const [editAddressId, setEditAddressId] = useState(false);

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData.data.content);
    }
  }, [addressData]);

  useEffect(() => {
    if (!createFormOpen) {
      setNewAddress(defaultState);
      setErr(defaultState);
    }
  }, [createFormOpen, setNewAddress, setErr, defaultState]);

  const handleCreateAddressBtnClick = () => {
    setNewAddress(defaultState);
    setWard(null);
    setEditAddressId(null);
    setCreateFromOpen(true);
  };

  const handleEditAddressBtnClick = (orgAddress) => {
    const addressParts = orgAddress.detailAddress.split(',');

    const detail = addressParts[0].trim();
    const war = addressParts[1].trim();
    const dis = addressParts[2].trim();
    const pro = addressParts[3].trim();

    const editAddress = {
      name: orgAddress.name,
      province: pro,
      district: dis,
      ward: war,
      address: detail,
      phone: orgAddress.phone,
      zip: orgAddress.postalCode,
      note: orgAddress.note
    }

    setNewAddress(editAddress);
    setEditAddressId(orgAddress.id);
    setCreateFromOpen(true);
  };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(newAddress).forEach((key) => {
      if (newAddress[key] === '') {
        if (['zip', 'note'].includes(key)) {
          // do nothing
        } else {
          newErr[key] = t('form.error.field-required');
          isValid = false;
        }
      }
    });

    setErr(newErr);

    return isValid;
  };

  const handleSaveAddressClick = async () => {
    if (!validate()) return;

    const payload = {
      name: newAddress.name,
      phone: newAddress.phone,
      note: newAddress.note,
      postalCode: newAddress.zip,
      detailAddress: ''
        .concat(newAddress.address)
        .concat(', ')
        .concat(newAddress.ward)
        .concat(', ')
        .concat(newAddress.district)
        .concat(', ')
        .concat(newAddress.province),
      shippingInfo: JSON.stringify({
        to_district_id: ward?.DistrictID,
        to_ward_code: ward?.WardCode,
      }),
    };

    if (editAddressId) {
      await updateAddress({ id: editAddressId, payload }).unwrap();
    } else {
      await createAddress(payload).unwrap();
    }

    setCreateFromOpen(false);
    setNewAddress(defaultState);
    setWard(null);
  };

  return (
    <Container>
      <ModalPopup open={createFormOpen} setOpen={setCreateFromOpen}>
        <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 2 }}>
          {editAddressId ? t('form.edit-title') : t('form.title')}
        </Typography>
        <AddressForm
          ward={ward}
          setWard={setWard}
          address={newAddress}
          setAddress={setNewAddress}
          err={err}
          setErr={setErr}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleSaveAddressClick}
          sx={{ mt: 2 }}
        >
          {t('form.btn-submit')}
        </LoadingButton>
      </ModalPopup>
      <Stack justifyContent='space-between' direction="row" alignItems="center">
        <Typography variant='h5'>{t('title')}</Typography>
        <Button
          variant='contained'
          onClick={handleCreateAddressBtnClick}
          startIcon={<AddBoxIcon />}
          sx={{ mb: 1, }}
        >
          {t('btn-create-new-address')}
        </Button>
      </Stack>
      {mdUp ?
        <AddressTable addresses={addresses} setAddresses={setAddresses} handleEdit={handleEditAddressBtnClick} /> :
        <AddressStack addresses={addresses} setAddresses={setAddresses} handleEdit={handleEditAddressBtnClick} />}
    </Container>
  );
};

export default ProfileAddressView;
