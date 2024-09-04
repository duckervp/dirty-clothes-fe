import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Typography from "@mui/material/Typography";

import { ORDER_STATUS } from "src/config";

import Label from "src/components/label";

export default function OrderStatus({ status, sx }) {
  const { t } = useTranslation('profile', { keyPrefix: 'order.status-option' });

  const getColor = () => {
    if (status === ORDER_STATUS.ACCEPTED) {
      return 'primary';
    }

    if (status === ORDER_STATUS.CANCELLED || status === ORDER_STATUS.REFUSED) {
      return 'error';
    }

    if (status === ORDER_STATUS.DELIVERY) {
      return 'info'
    }

    if (status === ORDER_STATUS.DONE) {
      return 'success'
    }

    return 'secondary';
  }

  return (
    <Typography variant="subtitle1" sx={{ ...sx }}>
      <Label color={getColor()}>
        {t(status)}
      </Label>
    </Typography>
  );
}

OrderStatus.propTypes = {
  status: PropTypes.oneOf(Object.keys(ORDER_STATUS)),
  sx: PropTypes.object
}