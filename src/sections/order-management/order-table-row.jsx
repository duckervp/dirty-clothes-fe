import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import { ORDER_STATUS } from 'src/config';

import Iconify from 'src/components/iconify';
import CustomTableRowCell from 'src/components/table/table-row-cell';

// ----------------------------------------------------------------------

export default function OrderTableRow({
  selected,
  cells,
  handleClick,
  handleAccept,
  handleRefuse,
  handleDelivery,
  handleDone,
  handleRowClick,
  disabled,
  orderStatus
}) {
  const { t } = useTranslation('order', { keyPrefix: 'table-row-option' })

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleAcceptClick = () => {
    handleAccept();
    handleCloseMenu();
  };

  const handleDeliveryClick = () => {
    handleDelivery();
    handleCloseMenu();
  };

  const handleDoneClick = () => {
    handleDone();
    handleCloseMenu();
  };

  const handleRefuseClick = () => {
    handleRefuse();
    handleCloseMenu();
  };

  const isFinalStatus = [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUSED, ORDER_STATUS.DONE].includes(orderStatus);

  return (
    <>
      <CustomTableRowCell
        cells={cells}
        selected={selected}
        handleClick={handleClick}
        handleOpenMenu={handleOpenMenu}
        handleRowClick={handleRowClick}
        disabled={disabled}
        noMoreOptions={isFinalStatus}
      />

      {!isFinalStatus && <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 140 },
          }
        }}
      >
        {orderStatus === ORDER_STATUS.ORDER &&
          <MenuItem onClick={handleAcceptClick}>
            <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} />
            {t('btn-accept')}
          </MenuItem>
        }

        {orderStatus === ORDER_STATUS.ACCEPTED &&
          <MenuItem onClick={handleDeliveryClick}>
            <Iconify icon="eva:car-fill" sx={{ mr: 2 }} />
            {t('btn-delivery')}
          </MenuItem>
        }

        {orderStatus === ORDER_STATUS.DELIVERY &&
          <MenuItem onClick={handleDoneClick}>
            <Iconify icon="eva:archive-fill" sx={{ mr: 2 }} />
            {t('btn-done')}
          </MenuItem>
        }

        {orderStatus === ORDER_STATUS.ORDER &&
          <MenuItem onClick={handleRefuseClick} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:close-square-outline" sx={{ mr: 2 }} />
            {t('btn-refuse')}
          </MenuItem>
        }
      </Popover>}
    </>
  );
}

OrderTableRow.propTypes = {
  cells: PropTypes.array,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  handleAccept: PropTypes.func,
  handleDelivery: PropTypes.func,
  handleDone: PropTypes.func,
  handleRefuse: PropTypes.func,
  handleRowClick: PropTypes.func,
  disabled: PropTypes.bool,
  orderStatus: PropTypes.string,
};
