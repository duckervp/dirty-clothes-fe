// import { useState } from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function QuantityButtonGroup({ value, setValue, cartItem }) {
  const handleIncrease = () => {
    if (!cartItem) {
      setValue(value + 1);
    } else{
      setValue(cartItem, value + 1);
    }
  };

  const hanleDecrease = () => {
    if (value > 1) {
      if (!cartItem) {
        setValue(value - 1);
      } else{
        setValue(cartItem, value - 1);
      }
    }
  };

  return (
    <ToggleButtonGroup orientation="horizontal" exclusive>
      <ToggleButton value="list" aria-label="list" onClick={hanleDecrease} disabled={value === 1}>
        <RemoveIcon />
      </ToggleButton>
      <ToggleButton
        value="module"
        aria-label="module"
        disabled
        sx={{ width: 60 }}
        style={{ color: 'black' }}
      >
        {value}
      </ToggleButton>
      <ToggleButton value="quilt" aria-label="quilt" onClick={handleIncrease}>
        <AddIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

QuantityButtonGroup.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func,
  cartItem: PropTypes.object
};
