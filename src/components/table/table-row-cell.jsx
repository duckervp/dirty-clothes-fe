import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ColorPreview } from '../color-utils';

// ----------------------------------------------------------------------

export default function CustomTableRowCell({
  selected,
  cells,
  handleClick,
  handleOpenMenu,
  handleRowClick,
  disabled,
  noSelect,
  noMoreOptions,
}) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      {!disabled && !noSelect &&
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
      }
      {
        cells.map((cell, index) => {
          if (cell.type === "code") {
            return (
              <TableCell key={index} align={cell.align} onClick={handleRowClick}>
                <Tooltip title={cell.value}>
                  <Typography variant="caption">
                    {cell.value?.length > 10
                      ? cell.value?.slice(0, 10).concat('...')
                      : cell.value}
                  </Typography>
                </Tooltip>
              </TableCell>
            );
          }

          if (cell.type === "color") {
            return (
              <TableCell key={index} align={cell.align} onClick={handleRowClick}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ColorPreview colors={[cell.value]} />
                  <Typography variant='body2'>{cell.label}</Typography>
                </Stack>
              </TableCell>
            );
          }

          if (cell.type === "datetime") {
            return (
              <TableCell key={index} align={cell.align} onClick={handleRowClick}>
                <Typography variant='body2'>{fDateTime(cell.value) || "-"}</Typography>
              </TableCell>
            );
          }

          if (cell.type === "status") {
            return (
              <TableCell key={index} align={cell.align} onClick={handleRowClick}>
                <Label color={(cell.value === false && 'error') || 'success'}>{cell.value ? "ACTIVE" : "INACTIVE"}</Label>
              </TableCell>
            );
          }

          if (cell.type === "composite") {
            return (
              <TableCell key={index} component="th" scope="row" padding="none" align={cell.align} onClick={handleRowClick}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar alt={cell.value} src={cell.imgUrl} />
                  <Typography variant="subtitle2" noWrap>
                    {cell.value || "-"}
                  </Typography>
                </Stack>
              </TableCell>
            );
          }

          if (cell.type === "composite2") {
            return (
              <TableCell key={index} component="th" scope="row" padding="none" align={cell.align} onClick={handleRowClick}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    component="img"
                    alt={cell.value}
                    src={cell.imgUrl}
                    sx={{
                      height: '65px',
                      width: '65px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <Typography variant="subtitle2" noWrap>
                    {cell.value || "-"}
                  </Typography>
                </Stack>
              </TableCell>
            );
          }

          if (cell.type === "image") {
            return (
              <TableCell key={index} component="th" scope="row" padding="none" align={cell.align} onClick={handleRowClick}>
                <Stack direction="row" alignItems="center" justifyContent={cell.align} spacing={2}>
                  <Box
                    component="img"
                    alt="product image"
                    src={cell.value}
                    sx={{
                      height: '65px',
                      width: '65px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                </Stack>
              </TableCell>
            );
          }

          if (cell.type === "yn") {
            return (<TableCell key={index} align={cell.align} onClick={handleRowClick}>
              <Typography variant='body2'>{cell.value ? 'Yes' : 'No'}</Typography>
            </TableCell>);
          }

          return (
            <TableCell key={index} align={cell.align} onClick={handleRowClick}>
              <Typography variant='body2'>{cell.value || "-"}</Typography>
            </TableCell>
          );
        })
      }

      {(!disabled && !noMoreOptions) && <TableCell align="right">
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>}
    </TableRow>
  );
}

CustomTableRowCell.propTypes = {
  cells: PropTypes.array,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  handleOpenMenu: PropTypes.func,
  handleRowClick: PropTypes.func,
  disabled: PropTypes.bool,
  noSelect: PropTypes.bool,
  noMoreOptions: PropTypes.bool,
};
