import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { ORDER_STATUS } from 'src/config';

import Iconify from 'src/components/iconify';

import OrderFilter from '../order/order-filter';

// ----------------------------------------------------------------------

export default function OrderTableToolbar({
  selected,
  filterType,
  setFilterType,
  statusFilter,
  setStatusFilter,
  filterName,
  onFilterName,
  placeholder,
  handleBulkActionAccept,
  handleBulkActionRefuse,
  handleBulkActionDelivery,
  handleBulkActionDone }) {
  const { t } = useTranslation('order', { keyPrefix: 'table-toolbar' });

  const numSelected = selected.length;

  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (selected.length > 0) {
      const firstStatus = selected.at(0).status;
      let sameStatus = true;
      selected.forEach(e => {
        if (firstStatus !== e.status) {
          sameStatus = false;
        }
      });

      if (sameStatus) {
        setOrderStatus(firstStatus);
      } else {
        setOrderStatus(null);
      }
    }
  }, [selected]);

  const handleChange = (e) => {
    setFilterType(e.target.value);
  }

  const renderFilter = (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box width={200}>
          <Select
            fullWidth
            id="order-status-filter"
            value={filterType || ''}
            onChange={handleChange}
          >
            <MenuItem value="username">{t('filter.username')}</MenuItem>
            <MenuItem value="orderCode">{t('filter.orderCode')}</MenuItem>
          </Select>
        </Box>
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder={placeholder || t(`filter.placeholder.${filterType}`)}
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      </Stack>
      <OrderFilter manage state={statusFilter} setState={setStatusFilter} />
    </>
  )

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} {t('selected')}
        </Typography>
      ) : renderFilter}

      {numSelected > 0 ? (
        <Stack direction="row">
          {orderStatus === ORDER_STATUS.ORDER &&
            <Tooltip title={t('tooltip-accept')}>
              <IconButton onClick={handleBulkActionAccept} color='primary'>
                <Iconify icon="eva:checkmark-circle-2-fill" />
              </IconButton>
            </Tooltip>
          }

          {orderStatus === ORDER_STATUS.ACCEPTED &&
            <Tooltip title={t('tooltip-delivery')}>
              <IconButton onClick={handleBulkActionDelivery} color='info'>
                <Iconify icon="eva:car-fill" />
              </IconButton>
            </Tooltip>
          }

          {orderStatus === ORDER_STATUS.DELIVERY &&
            <Tooltip title={t('tooltip-done')}>
              <IconButton onClick={handleBulkActionDone} color='success'>
                <Iconify icon="eva:archive-fill" />
              </IconButton>
            </Tooltip>
          }

          {orderStatus === ORDER_STATUS.ORDER &&
            <Tooltip title={t('tooltip-refuse')}>
              <IconButton onClick={handleBulkActionRefuse} color='error'>
                <Iconify icon="eva:close-circle-outline" />
              </IconButton>
            </Tooltip>
          }
        </Stack>

      ) : (
        <Tooltip title={t('tooltip-filter-list')} sx={{ display: "none" }}>
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

OrderTableToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholder: PropTypes.string,
  handleBulkActionAccept: PropTypes.func,
  handleBulkActionRefuse: PropTypes.func,
  handleBulkActionDelivery: PropTypes.func,
  handleBulkActionDone: PropTypes.func,
  setFilterType: PropTypes.func,
  filterType: PropTypes.oneOf(['username', 'orderCode']),
  setStatusFilter: PropTypes.func,
  statusFilter: PropTypes.object,
};
