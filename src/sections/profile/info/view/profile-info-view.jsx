import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// import UploadIcon from '@mui/icons-material/Upload';
import InputAdornment from '@mui/material/InputAdornment';

import { handleError, showErrorMessage, showSuccessMessage } from 'src/utils/notify';

import { useChangePasswordMutation } from 'src/app/api/auth/authApiSlice';
import { logout, setUser, selectCurrentUser } from 'src/app/api/auth/authSlice';
import { useChangeNameMutation, useUpdateAvatarMutation } from 'src/app/api/user/userApiSlice';

import Iconify from 'src/components/iconify';
import AvatarUpload from 'src/components/uploader/avatar-upload';

// ----------------------------------------------------------------------

export default function ProfileInfoView() {
  const { t } = useTranslation('profile', { keyPrefix: 'profile' });

  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  const defaultState = {
    name: user?.name,
    oldPassword: '',
    newPassword: '',
  };

  const defaultErrState = {
    name: '',
    oldPassword: '',
    newPassword: '',
  };

  const [state, setState] = useState(defaultState);

  const [err, setErr] = useState(defaultErrState);

  const [showPassword, setShowPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [changeName, { isLoading: isChangeNameLoading }] = useChangeNameMutation();

  const [changePassword, { isLoading: isChangePasswordLoading }] = useChangePasswordMutation();

  const [updateAvatar] = useUpdateAvatarMutation();

  const handleStateChange = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);

    if (err[e.target.name] !== '') {
      const newErr = { ...err };
      newErr[e.target.name] = '';
      setErr(newErr);
    }
  };

  const handleChangeNameClick = async (e) => {
    if (!validate(['name'])) return;

    try {
      await changeName({ name: state.name }).unwrap();
      dispatch(setUser({ ...user, name: state.name }));
      showSuccessMessage('Changed name successfully!');
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangePasswordClick = async (e) => {
    if (!validate(['oldPassword', 'newPassword'])) return;

    try {
      await changePassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
      }).unwrap();
      showSuccessMessage('Changed password successfully. Please login again!');
      dispatch(logout());
    } catch (error) {
      handleError(error);
    }
  };

  const validate = (fields) => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (fields.includes(key) && state[key] === '') {
        newErr[key] = 'Field value required!';
        isValid = false;
      }
    });

    setErr(newErr);

    return isValid;
  };

  const setImageUrl = async (avatarUrl) => {
    try {
      const { data } = await updateAvatar({ avatarUrl }).unwrap();
      showSuccessMessage(data);
      dispatch(setUser({ ...user, avatarUrl }));
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const renderAccount = (
    <Box
      sx={{
        width: '100%',
        p: 5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (th) => alpha(th.palette.grey[500], 0.12),
      }}
    >
      <AvatarUpload imageUrl={user?.avatarUrl} setImageUrl={setImageUrl} name={user?.name?.toUpperCase()} />

      <Box sx={{ ml: 6 }}>
        <Typography variant="subtitle2">{user?.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container>
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, width: 1 }} spacing={2}>
        <Box width="100%">
          <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 0.5 }}>
            {t('title')}
          </Typography>
          {renderAccount}
        </Box>

        <Card
          sx={{
            px: 3,
            py: 2.5,
            width: '100%',
          }}
        >
          <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 1 }}>
            {t('change-name.title')}
          </Typography>

          <Box>
            <Typography variant="subtitle2">
              <span style={{ color: 'red' }}>*</span> {t('change-name.name-input-label')}
            </Typography>
            <TextField
              name="name"
              autoComplete="false"
              value={state.name}
              onChange={handleStateChange}
              error={err.name !== ''}
              helperText={err.name !== '' && err.name}
              fullWidth
            />
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                onClick={handleChangeNameClick}
                sx={{ mt: 2 }}
                loading={isChangeNameLoading}
                disabled={state.name === user.name}
              >
                {t('change-name.btn-update')}
              </LoadingButton>
            </Stack>
          </Box>
        </Card>

        <Card
          sx={{
            px: 3,
            py: 2.5,
            width: '100%',
          }}
        >
          <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 1 }}>
            {t('change-password.title')}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2">
                {t('change-password.old-password-input.label')} <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="oldPassword"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon style={{ fontSize: '18px' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="false"
                value={state.oldPassword}
                onChange={handleStateChange}
                error={err.oldPassword !== ''}
                helperText={err.oldPassword !== '' && err.oldPassword}
                placeholder={t('change-password.old-password-input.placeholder')}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                {t('change-password.new-password-input.label')} <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon style={{ fontSize: '18px' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="false"
                value={state.newPassword}
                onChange={handleStateChange}
                error={err.newPassword !== ''}
                helperText={err.newPassword !== '' && err.newPassword}
                placeholder={t('change-password.new-password-input.placeholder')}
              />
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleChangePasswordClick}
              sx={{ mt: 2 }}
              loading={isChangePasswordLoading}
              disabled={
                state.oldPassword === '' ||
                state.newPassword === '' ||
                state.oldPassword === state.newPassword
              }
            >
              {t('change-password.btn-submit')}
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
