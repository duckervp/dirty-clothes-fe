import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Header from './header';
import Nav from '../common/nav';
import Main from '../common/main';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav 
        openNav={openNav} 
        onCloseNav={() => setOpenNav(false)} 
        namespace='translation' 
        keyPrefix='admin-nav'
        navConfig={navConfig}/>

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
