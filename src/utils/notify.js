import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SHOW_SUCCESS_MESSAGE } from "src/config";

export const handleError = (err, defaultMessage) => {
  console.log(err)
  const { status, data } = err
  let message;
  if (!status) {
    message = "No Server Response";
  } else if (status === 401) {
    message = "Unauthorized";
  } else if (status === 400) {
    message = data.message || defaultMessage;
  } else {
    message = defaultMessage;
  }
  showErrorMessage(message || "Unexpected Error");
}

export const showSuccessMessage = (message) => {
  if (SHOW_SUCCESS_MESSAGE) {
    toast.success(message, {
      position: "top-right",
      autoClose: 500
    });
  }
}

export const showErrorMessage = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1500
  });
}