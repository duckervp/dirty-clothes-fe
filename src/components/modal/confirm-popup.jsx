import PropTypes from "prop-types"

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ModalPopup from "./modal";

const ConfirmPopup = ({ content, popupOpen, setPopupOpen, handleCancel, handleConfirm }) => (
  <ModalPopup open={popupOpen} setOpen={setPopupOpen} sx={{ width: 500, top: '45%' }}>
    <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
      {content.title}
    </Typography>
    <Typography variant="body1">
      {content.message}
    </Typography>
    <Button
      size="large"
      variant="contained"
      color="inherit"
      onClick={handleCancel}
      sx={{ mt: 3, width: "200px", mr: 3 }}
    >
      {content.cancelBtnText}
    </Button>
    <Button
      size="large"
      variant="contained"
      color="primary"
      onClick={handleConfirm}
      sx={{ mt: 3, width: "200px" }}
    >
      {content.confirmBtnText}
    </Button>
  </ModalPopup >
);

ConfirmPopup.propTypes = {
  content: PropTypes.object,
  popupOpen: PropTypes.bool,
  setPopupOpen: PropTypes.func,
  handleCancel: PropTypes.func,
  handleConfirm: PropTypes.func,
}

export default ConfirmPopup;