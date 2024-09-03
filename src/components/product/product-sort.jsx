import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', sort: 'desc', sortBy: 'createdAt' },
  { value: 'priceDesc', label: 'Price: High-Low', sort: 'desc', sortBy: 'price' },
  { value: 'priceAsc', label: 'Price: Low-High', sort: 'asc', sortBy: 'price' },
];

export default function ShopProductSort({ selectedOption, setSelectedOption }) {
  const { t } = useTranslation('product', { keyPrefix: 'sort' })

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSort = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        {t('text')}:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {selectedOption.label}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedOption.value}
            onClick={() => handleSort(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

ShopProductSort.propTypes = {
  selectedOption: PropTypes.object,
  setSelectedOption: PropTypes.func,
};
