// import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import HomepageLayout from 'src/layouts/homepage';

// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Nav from './nav';

const ProfileLayout = ({ children }) => (
  <HomepageLayout>
    <Box>
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={false} onCloseNav={() => false} />

        <Box width="100%">{children}</Box>
      </Box>
    </Box>
  </HomepageLayout>
);

ProfileLayout.propTypes = {
  children: PropTypes.node,
  // sx: PropTypes.object,
};

export default ProfileLayout;
