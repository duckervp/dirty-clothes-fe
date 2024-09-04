import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TableContainer from '@mui/material/TableContainer';

import { showErrorMessage } from 'src/utils/notify';

import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} from 'src/app/api/address/addressApiSlice';

import ModalPopup from 'src/components/modal/modal';

import AddressForm from 'src/sections/payment/AddressForm';

function AddressTable({ addresses, setAddresses }) {
  const { t } = useTranslation('profile', { keyPrefix: 'address.table-column' });

  const [deleteAddress] = useDeleteAddressMutation();

  const handleDeleteAddress = async (address) => {
    try {
      await deleteAddress(address?.id).unwrap();
      const indexOfDeletedElement = addresses.indexOf(address);
      const newAddresses = [...addresses];
      newAddresses.splice(indexOfDeletedElement, 1);
      setAddresses(newAddresses);
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'black' }}>{t('name')}</TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('detail-address')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('phone')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('note')}
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              {t('delete')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses?.map((item) => (
            <TableRow key={item?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {item?.name}
              </TableCell>
              <TableCell align="center">{item?.detailAddress}</TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>
                {item?.phone}
              </TableCell>
              <TableCell align="center" sx={{ lg: { width: '250px' } }}>
                {item?.note}
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" onClick={() => handleDeleteAddress(item)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

AddressTable.propTypes = {
  addresses: PropTypes.array,
  setAddresses: PropTypes.func,
};

const ProfileAddressView = () => {
  const { t } = useTranslation('profile', { keyPrefix: 'address' })

  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({});

  const [ward, setWard] = useState({});

  const { data: addressData } = useGetAllAddressesQuery({ userOnly: true });

  const [createAddress] = useCreateAddressMutation();

  const [createFormOpen, setCreateFromOpen] = useState(false);

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData.data.content);
    }
  }, [addressData]);

  const handleCreateAddressBtnClick = () => {
    setCreateFromOpen(true);
  };

  const handleAddAddressClick = () => {
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

    createNewAddress(payload);
    setCreateFromOpen(false);
  };

  const createNewAddress = async (payload) => {
    const { data } = await createAddress(payload).unwrap();
    const newAddresses = [...addresses];
    newAddresses.push(data);
    setAddresses(newAddresses);
  };

  return (
    <Container>
      <ModalPopup open={createFormOpen} setOpen={setCreateFromOpen}>
        <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 1 }}>
          {t('form.title')}
        </Typography>
        <AddressForm
          ward={ward}
          setWard={setWard}
          address={newAddress}
          setAddress={setNewAddress}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleAddAddressClick}
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
      <AddressTable addresses={addresses} setAddresses={setAddresses} />
    </Container>
  );
};

export default ProfileAddressView;
