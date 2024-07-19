// import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Header from './header';
import Footer from './footer';
import Main from '../dashboard/main';

// ----------------------------------------------------------------------

export default function HomepageLayout({ children }) {
//   const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >

        <Main>{children}</Main>
      </Box>

      <Footer />
    </>
  );
}

HomepageLayout.propTypes = {
  children: PropTypes.node,
};
