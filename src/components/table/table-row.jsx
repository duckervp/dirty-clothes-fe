import { useState } from 'react';
import PropTypes from 'prop-types';

import TableRowOption from './table-row-option';
import CustomTableRowCell from './table-row-cell';

// ----------------------------------------------------------------------

export default function CustomTableRow({
  selected,
  cells,
  handleClick,
  handleEdit,
  handleDelete,
  handleRowClick,
  disabled,
  noSelect
}) {
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
        noSelect={noSelect}
      />

      <TableRowOption 
        open={open}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleCloseMenu={handleCloseMenu}
      />
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
  noSelect: PropTypes.bool,
};
