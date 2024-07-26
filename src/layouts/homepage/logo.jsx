import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';

import { LOGO_NAME } from '../../../config';


export default function Logo({sx}) {
    return (
        <Box 
        component={Link} 
        sx={{ color: 'black', fontFamily: 'Audiowide', fontWeight: 'bold', m: 3, textDecoration: "none", ...sx}} 
        to="/">
        {LOGO_NAME.toUpperCase()}
      </Box>
    );
};

Logo.propTypes = {
  sx: PropTypes.object
}