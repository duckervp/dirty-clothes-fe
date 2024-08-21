import PropTypes from "prop-types"

import ConfirmPopup from "./confirm-popup";

const DeleteConfirmPopup = ({ object, plural, popupOpen, setPopupOpen, handleCancel, handleConfirm }) => (
  <ConfirmPopup
    content={{
      title: "DELETE CONFIRMATION",
      message: `Are you sure you want to permanently remove ${plural ? "these" : "this"} ${object || (plural ? "records" : "record")} from the system?`,
      cancelBtnText: "CANCEL",
      confirmBtnText: "CONFIRM"
    }}
    popupOpen={popupOpen}
    setPopupOpen={setPopupOpen}
    handleCancel={handleCancel}
    handleConfirm={handleConfirm}
  />
);

DeleteConfirmPopup.propTypes = {
  object: PropTypes.string,
  plural: PropTypes.bool,
  popupOpen: PropTypes.bool,
  setPopupOpen: PropTypes.func,
  handleCancel: PropTypes.func,
  handleConfirm: PropTypes.func,
}

export default DeleteConfirmPopup;