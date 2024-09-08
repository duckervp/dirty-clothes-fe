import { useState } from 'react';
import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import TableRowOption from 'src/components/table/table-row-option';

export default function AddressItem({ address, handleDelete, handleEdit }) {
  // const { t } = useTranslation('profile', { keyPrefix: 'abcc' })

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditClick = () => {
    handleEdit();
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    handleDelete();
    handleCloseMenu();
  };

  return (
    <>
      <Box sx={{ px: 2, pt: 2, pb: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 500, fontSize: "1rem" }}>
                {address?.name}
              </Typography>
              <Typography variant="subtitle2">|</Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 300, fontSize: "1rem" }}>
                {address?.phone}
              </Typography>
            </Stack>

            <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
              {address?.detailAddress}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
              {address?.note}
            </Typography>
          </Stack>
          <Stack justifyContent="center">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </Stack>
        <TableRowOption
          open={open}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleCloseMenu={handleCloseMenu}
        />
      </Box>
      <Divider />
    </>
  )
}

AddressItem.propTypes = {
  address: PropTypes.object,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
}