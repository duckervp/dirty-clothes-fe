import { useState } from 'react';
import PropTypes from "prop-types"

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

import ConfirmPopup from '../modal/confirm-popup';
import DeleteConfirmPopup from '../modal/delete-confirm-popup';

//----------------------------------------------------------------------

const TitleBar = ({ title, screen, object, handleEdit, handleDelete, goBackUrl, deleteMessage }) => {
  const router = useRouter();

  const [popupOpen, setPopupOpen] = useState(false);

  const handleGoBack = () => {
    if (screen === "detail") {
      handleConfirmGoBack();
    } else {
      setPopupOpen(true);
    }
  }

  const handleConfirmGoBack = () => {
    if (goBackUrl) {
      router.push(goBackUrl);
    } else {
      router.back();
    }
    setPopupOpen(false);
  }

  const handleCancelGoBack = () => {
    setPopupOpen(false);
  }

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
    handleDeleteCfOpenMenu();
    handleCloseMenu();
  };

  const [deleteCfOpen, setDeleteCfOpen] = useState(false);

  const handleDeleteCfOpenMenu = (event) => {
    setDeleteCfOpen(true);
  };

  const handleCloseDeleteCfMenu = () => {
    setDeleteCfOpen(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    handleCloseDeleteCfMenu();
  }

  return (
    <>
      <ConfirmPopup
        content={{
          title: "LEAVE THIS SCREEN",
          message: "You have unsaved changes that will be lost if you leave this screen. Are you sure you want to leave this screen?",
          cancelBtnText: "NO",
          confirmBtnText: "YES"
        }}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        handleCancel={handleCancelGoBack}
        handleConfirm={handleConfirmGoBack}
      />

      <DeleteConfirmPopup
        object={object}
        popupOpen={deleteCfOpen}
        setPopupOpen={setDeleteCfOpen}
        handleCancel={handleCloseDeleteCfMenu}
        handleConfirm={handleConfirmDelete}
        specialMessage={deleteMessage}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handleGoBack}><ArrowBackIcon /></IconButton>
          <Typography variant="h5" sx={{ ml: 1 }}>{title}</Typography>

        </Stack>
        {
          screen === "detail" &&
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
      </Stack>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 140 },
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

TitleBar.propTypes = {
  title: PropTypes.string,
  screen: PropTypes.oneOf(['detail', 'create', 'edit']),
  object: PropTypes.string,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  goBackUrl: PropTypes.string,
  deleteMessage: PropTypes.string,
}

export default TitleBar;