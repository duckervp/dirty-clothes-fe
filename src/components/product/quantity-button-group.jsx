// import { useState } from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function QuantityButtonGroup({ value, setValue, cartItem, sx, lbsx, rbsx, mbsx }) {
  const handleIncrease = () => {
    if (!cartItem) {
      setValue(value + 1);
    } else {
      setValue(cartItem, value + 1);
    }
  };

  const hanleDecrease = () => {
    if (value > 1) {
      if (!cartItem) {
        setValue(value - 1);
      } else {
        setValue(cartItem, value - 1);
      }
    }
  };

  return (
    <ToggleButtonGroup orientation="horizontal" exclusive sx={sx}>
      <ToggleButton value="list" aria-label="list" onClick={hanleDecrease} disabled={value === 1} sx={lbsx}>
        <RemoveIcon />
      </ToggleButton>
      <ToggleButton
        value="module"
        aria-label="module"
        disabled
        sx={{ width: 60, ...mbsx }}
        style={{ color: 'black' }}
      >
        {value}
      </ToggleButton>
      <ToggleButton value="quilt" aria-label="quilt" onClick={handleIncrease} sx={rbsx}>
        <AddIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

QuantityButtonGroup.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func,
  cartItem: PropTypes.object,
  sx: PropTypes.object,
  lbsx: PropTypes.object,
  mbsx: PropTypes.object,
  rbsx: PropTypes.object,
};
