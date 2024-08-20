import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

export default function ModalPopup({ open, setOpen, children, sx }) {
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Card
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              maxHeight: '95%',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              ...sx
            }}
          >
            {children}
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}

ModalPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  children: PropTypes.node,
  sx: PropTypes.object
};
