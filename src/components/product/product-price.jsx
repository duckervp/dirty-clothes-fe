import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { fViCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function ProductPrice({ product, sx }) {
  const salePriceSx = {
    color: 'text.disabled',
    textDecoration: 'line-through',
    mr: product.status === 'SALE' && product.salePrice ? 0.5 : 0,
  };

  const renderPrice = (
    <Typography variant="subtitle1" sx={{ ...sx }}>
      <Typography component="span" variant="body1" sx={salePriceSx}>
        {product.status === 'SALE' && product.salePrice && fViCurrency(product.price)}
      </Typography>
      {product.status === 'SALE' && product.salePrice
        ? fViCurrency(product.salePrice)
        : fViCurrency(product.price)}
    </Typography>
  );

  return renderPrice;
}

ProductPrice.propTypes = {
  product: PropTypes.object,
  sx: PropTypes.object,
};
