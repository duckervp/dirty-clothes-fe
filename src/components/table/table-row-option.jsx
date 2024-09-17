import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableRowOption({
  open,
  handleEditClick,
  handleDeleteClick,
  handleCloseMenu
}) {
  const { t } = useTranslation('table', { keyPrefix: 'table-row' });

  return !!open && (
    <Popover
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
      <MenuItem onClick={handleEditClick}>
        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
        {t('btn-edit')}
      </MenuItem>

      <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
        {t('btn-delete')}
      </MenuItem>
    </Popover>
  );
}

TableRowOption.propTypes = {
  open: PropTypes.any,
  handleEditClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  handleCloseMenu: PropTypes.func,
};
