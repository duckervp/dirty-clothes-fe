import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link as RLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { fViCurrency } from 'src/utils/format-number';

import { ColorPreview } from 'src/components/color-utils';
import QuantityButtonGroup from 'src/components/product/quantity-button-group';

export default function CheckoutItem({ item, divider, cart, handleQuantityChange, handleDeleteCartItem, viewMoreQuantity }) {
  const { t } = useTranslation('product', { keyPrefix: 'checkout-item' });
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <Box
            component="img"
            alt={item?.name || item?.productName}
            src={item?.image || item?.imageUrl}
            sx={{
              width: '100px',
              objectFit: 'cover',
              borderRadius: '5px',
            }}
          />
          <Stack spacing={2} sx={{ p: 1 }}>
            <Link
              component={RLink}
              color="inherit"
              underline="hover"
              variant="subtitle2"
              to={`/${item?.slug}`}
            >
              {item?.name || item?.productName}
            </Link>
            <Stack direction="row" sx={{ mb: 1 }}>
              <ColorPreview colors={[item?.color]} sx={{ mx: 0.75 }} />
              <Typography variant="caption">{item?.size}</Typography>
              <Typography variant="caption" sx={{ ml: 0.75, fontWeight: 700 }}>
                x{item?.quantity}
              </Typography>
            </Stack>
            {cart && <QuantityButtonGroup
              value={item?.quantity}
              setValue={handleQuantityChange}
              cartItem={item}
              lbsx={{ width: "10px", height: "10px" }}
              mbsx={{ width: "10px", height: "10px" }}
              rbsx={{ width: "10px", height: "10px" }}
            />}
            <Typography variant="caption">{fViCurrency(item?.price)}</Typography>
            {
              viewMoreQuantity &&
              <Typography
                variant="caption"
                sx={
                  viewMoreQuantity > 0
                    ? { ml: 0.75, fontWeight: 700 }
                    : { display: 'none' }
                }
              >
                {t('view-more')} {viewMoreQuantity}{' '}
                {viewMoreQuantity > 1 ? t('items') : t('item')}
              </Typography>
            }
          </Stack>
        </Stack>
        {cart && <IconButton aria-label="delete" onClick={() => handleDeleteCartItem(item)}>
          <DeleteIcon />
        </IconButton>}
      </Stack>
      {divider && <Divider />}
    </Box>
  );
}

CheckoutItem.propTypes = {
  item: PropTypes.object,
  divider: PropTypes.bool,
  cart: PropTypes.bool,
  handleQuantityChange: PropTypes.func,
  handleDeleteCartItem: PropTypes.func,
  viewMoreQuantity: PropTypes.number,
};