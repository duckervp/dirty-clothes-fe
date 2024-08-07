import { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import useLogout from 'src/hooks/use-logout';

import { selectCurrentUser } from 'src/app/api/auth/authSlice';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    link: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    link: '/profile',
  },
  {
    label: 'Orders',
    icon: 'eva:settings-2-fill',
    link: '/order',
  },
  {
    label: 'Address',
    icon: 'eva:settings-2-fill',
    link: '/address',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter();

  const user = useSelector(selectCurrentUser);

  const hanleLogout = useLogout();

  const handleOpen = (event) => {
    console.log(event.currentTarget);
    
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleClick = () => {
    if (user) {
      handleLogoutClick();
    } else {
      handleLoginClick();
    }
  };

  const handleNavClick = (link) => {
    handleClose();
    router.push(link);
  };

  const handleLogoutClick = () => {
    handleClose();
    hanleLogout();
    router.push('/login');
  };

  const handleLoginClick = () => {
    handleClose();
    router.push('/login');
  };

  const renderUserOptions = (
    <>
      {MENU_OPTIONS.map((option) => (
        <MenuItem key={option.label} onClick={() => handleNavClick(option.link)}>
          {option.label}
        </MenuItem>
      ))}

      <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
    </>
  );

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name || 'Anonymous'}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </Avatar>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
              width: 200,
            },
          },
        }}
        sx={{ position: 'fixed', top: 0 }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name || 'Anonymous'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {user && renderUserOptions}

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClick}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          {user ? 'Logout' : 'Login'}
        </MenuItem>
      </Popover>
    </>
  );
}
