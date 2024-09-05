import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';

import CustomTableRowCell from './table-row-cell';

// ----------------------------------------------------------------------

export default function CustomTableRow({
  selected,
  cells,
  handleClick,
  handleEdit,
  handleDelete,
  handleRowClick,
  disabled
}) {
  const { t } = useTranslation('table', { keyPrefix: 'table-row' });

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditClick = () => {
    handleEdit();
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    handleDelete();
    handleCloseMenu();
  };

  return (
    <>
      <CustomTableRowCell
        cells={cells}
        selected={selected}
        handleClick={handleClick}
        handleOpenMenu={handleOpenMenu}
        handleRowClick={handleRowClick}
        disabled={disabled}
      />

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
    </>
  );
}

CustomTableRow.propTypes = {
  cells: PropTypes.array,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleRowClick: PropTypes.func,
  disabled: PropTypes.bool,
};
