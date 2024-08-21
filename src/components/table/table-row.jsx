import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CustomTableRow({
  selected,
  cells,
  handleClick,
  handleEdit,
  handleDelete,
  handleRowClick
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
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        {
          cells.map(cell => {
            if (cell.type === "datetime") {
              return (
                <TableCell key={cell.value} align={cell.align} onClick={handleRowClick}>
                  {fDateTime(cell.value)}
                </TableCell>
              );
            }

            if (cell.type === "status") {
              return (
                <TableCell key={cell.value} align={cell.align} onClick={handleRowClick}>
                  <Label color={(cell.value === false && 'error') || 'success'}>{cell.value ? "ACTIVE" : "INACTIVE"}</Label>
                </TableCell>
              );
            }

            if (cell.type === "composite") {
              return (
                <TableCell key={cell.value} component="th" scope="row" padding="none" align={cell.align} onClick={handleRowClick}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={cell.value} src={cell.imgUrl} />
                    <Typography variant="subtitle2" noWrap>
                      {cell.value}
                    </Typography>
                  </Stack>
                </TableCell>
              );
            }

            if (cell.type === "yn") {
              return <TableCell key={cell.value} align={cell.align} onClick={handleRowClick}>{cell.value ? 'Yes' : 'No'}</TableCell>;
            }

            return (
              <TableCell key={cell.value} align={cell.align} onClick={handleRowClick}>{cell.value}</TableCell>
            );
          })
        }

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
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
  handleRowClick: PropTypes.func
};
