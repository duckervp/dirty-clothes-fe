import * as React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Radio from '@mui/material/Radio';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
      color: theme.palette.primary.main,
    },
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    const { value } = props;
    checked = radioGroup.value === value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

export default function UseRadioGroup() {
  const { t } = useTranslation('product', { keyPrefix: 'payment.payment-method' });
  return (
    <RadioGroup name="use-radio-group" defaultValue="cod">
      <MyFormControlLabel value="cod" label={t('COD')} control={<Radio />} />
      {/* <MyFormControlLabel value="vnpay" label="VNPay" control={<Radio />} /> */}
    </RadioGroup>
  );
}