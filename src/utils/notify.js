import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  toast.success(message, {
    position: "top-right",
    autoClose: 1000
  });
}

export const showErrorMessage = (message) => {
  toast.error(message, {
    position: "top-right"
  });
}