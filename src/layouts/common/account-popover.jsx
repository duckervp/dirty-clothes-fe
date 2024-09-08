import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';
import {
  AUTH,
  ADMIN,
  ORDER,
  getUrl,
  PROFILE,
  ADDRESS,
  HOME_INDEX,
} from 'src/routes/route-config';

import useLogout from 'src/hooks/use-logout';

import { Role } from 'src/config';
import { selectCurrentUser } from 'src/app/api/auth/authSlice';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    option: 'profile',
    icon: 'eva:person-fill',
    link: getUrl(PROFILE),
  },
  {
    option: 'order',
    icon: 'eva:settings-2-fill',
    link: getUrl(ORDER),
  },
  {
    option: 'address',
    icon: 'eva:settings-2-fill',
    link: getUrl(ADDRESS),
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { t } = useTranslation('translation', { keyPrefix: 'header.account' })

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter();

  const user = useSelector(selectCurrentUser);

  const hanleLogout = useLogout();

  const handleOpen = (event) => {
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

  const handleRegisterClick = () => {
    handleClose();
    router.push(getUrl(AUTH.REGISTER));
  };

  const handleNavClick = (link) => {
    handleClose();
    router.push(link);
  };

  const handleLogoutClick = () => {
    handleClose();
    hanleLogout();
    router.push(getUrl(AUTH.LOGIN));
  };

  const handleLoginClick = () => {
    handleClose();
    router.push(getUrl(AUTH.LOGIN));
  };

  const displayHomeOption = (user && user.role === Role.ADMIN && pathname?.includes(ADMIN))
    || pathname?.endsWith(PROFILE) || pathname?.endsWith(ORDER) || pathname?.endsWith(ADDRESS);

  const renderUserOptions = (
    <>
      {
        displayHomeOption &&
        <MenuItem onClick={() => handleNavClick(HOME_INDEX)}>
          {t('home')}
        </MenuItem>
      }

      {MENU_OPTIONS.map((option) => (
        <MenuItem key={option.option} sx={{
          ...(option.link === pathname && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          })
        }} onClick={() => handleNavClick(option.link)}>
          {t(option.option)}
        </MenuItem>
      ))}
    </>
  );

  const displayAdminOption = user && user.role === Role.ADMIN && !pathname?.includes(ADMIN);

  const displayUserOption = user;

  return (
    <>
      <IconButton
        onClick={handleOpen}
        style={{ position: "relative", }}
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

      {open && <Popover
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
        style={{ position: 'fixed', top: 0 }}
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

        {
          displayAdminOption &&
          <MenuItem onClick={() => handleNavClick(getUrl(ADMIN))}>
            {t('admin-dashboard')}
          </MenuItem>
        }

        {displayUserOption && renderUserOptions}

        {(displayAdminOption || displayUserOption) && <Divider sx={{ borderStyle: 'dashed', m: 0 }} />}

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClick}
          sx={
            user ?
              { typography: 'body2', color: 'error.main', py: 1.5 }
              : { typography: 'body2', py: 1.5 }
          }
        >
          {user ? t('logout') : t('login')}
        </MenuItem>

        {!user && <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleRegisterClick}
          sx={{ typography: 'body2', py: 1.5 }}
        >
          {!user && t('register')}
        </MenuItem>}
      </Popover>}
    </>
  );
}
