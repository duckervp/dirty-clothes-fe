import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Nav from '../common/nav';
import Main from '../common/main';
import Header from '../homepage/header';
import Footer from '../homepage/footer';
import navConfig from './config-navigation';

const ProfileLayout = ({ children }) => {
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
        keyPrefix='profile-nav'
        navConfig={navConfig}/>

        <Main>{children}</Main>
      </Box>

      <Footer />
    </>
  );
}

ProfileLayout.propTypes = {
  children: PropTypes.node
};

export default ProfileLayout;
