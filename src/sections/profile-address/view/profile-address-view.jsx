import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TableContainer from '@mui/material/TableContainer';

import ModalPopup from 'src/components/modal/modal';

import AddressForm from 'src/sections/payment/AddressForm';

function AddressTable({ addresses }) {
  // const dispatch = useDispatch();

  const handleDeleteAddress = (address) => {};

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'black' }}>Name</TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Detail Address
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Phone
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Note
            </TableCell>
            <TableCell sx={{ color: 'black' }} align="center">
              Delete
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
};

const ProfileAddressView = () => {
  // const navigate = useNavigate();

  const addresses = [
    {
      createdAt: '2024-07-31T18:35:57.218Z',
      createdBy: 'string',
      updatedBy: 'string',
      updatedAt: '2024-07-31T18:35:57.218Z',
      deleted: true,
      id: 0,
      userId: 0,
      detailAddress: 'Dich Vong Hau, Cau Giay, Ha Noi',
      phone: '0123456789',
      postalCode: 0,
      note: 'So nha 5, chi nhan giao hang buoi sang',
      name: 'Duc Tran',
      shippingInfo: 'string',
    },
  ];

  const [createFormOpen, setCreateFromOpen] = useState(false);

  const handleCreateAddressBtnClick = () => {
    setCreateFromOpen(true);
  };

  return (
    <Box>
      <ModalPopup open={createFormOpen} setOpen={setCreateFromOpen}>
          <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 1 }}>
            NEW ADDRESS
          </Typography>
        <AddressForm />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          // onClick={handleClick}
          sx={{ mt: 2 }}
          // loading={isLoading}
        >
          Submit
        </LoadingButton>
      </ModalPopup>
      <Button onClick={handleCreateAddressBtnClick} startIcon={<AddBoxIcon />}>
        Create new Address
      </Button>
      <AddressTable addresses={addresses} />
    </Box>
  );
};

export default ProfileAddressView;
