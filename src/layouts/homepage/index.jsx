import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Header from './header';
import Footer from './footer';
import Nav from '../common/nav';
import Main from '../common/main';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

const HomepageLayout = ({ children }) => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' }
        }}
      >
        <Nav
          openNav={openNav}
          onCloseNav={() => setOpenNav(false)}
          namespace='translation'
          keyPrefix='home-nav'
          navConfig={navConfig}
          dspNone
        />
        <Main>{children}</Main>
      </Box >

      <Footer />
    </>
  );
}

HomepageLayout.propTypes = {
  children: PropTypes.node,
};

export default HomepageLayout;