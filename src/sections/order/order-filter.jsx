import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { ORDER_STATUS } from "src/config";

export default function OrderFilter({ state, setState, manage }) {
  const ns = manage ? 'order' : 'profile';
  const keyPrefix = manage ? '' : 'order';

  const { t } = useTranslation(ns, { keyPrefix });

  const handleChange = (e) => {
    setState({ ...state, orderStatus: e.target.value });
  }

  return (
    <Box width={200} sx={{ my: 1 }}>
      <Select
        fullWidth
        id="order-status-filter"
        value={state?.orderStatus || ''}
        onChange={handleChange}
        sx={{ height: manage ? "56px" : "50px" }}
      >
        {Object.keys(ORDER_STATUS).map(item => <MenuItem key={item} value={item}>{t(`status-option.${item}`)}</MenuItem>)}
      </Select>
    </Box>
  );
}

OrderFilter.propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  manage: PropTypes.bool,
}

