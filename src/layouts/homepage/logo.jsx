import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';

import { LOGO_NAME } from '../../config';

export default function Logo({ sx }) {
  return (
    <Box
      component={Link}
      sx={{
        color: 'black',
        px: 2,
        py: 1,
        fontFamily: 'Pacifico',
        fontWeight: '700',
        mx: 3,
        textDecoration: 'none',
        fontSize: '20px',
        borderRadius: 0.5,
        ...sx,
      }}
      to="/"
    >
      {LOGO_NAME.toUpperCase()}
    </Box>
  );
}

Logo.propTypes = {
  sx: PropTypes.object,
};
