import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import useLogin from 'src/hooks/use-login';

import { handleError } from 'src/utils/notify';

import { selectCurrentUser } from 'src/app/api/auth/authSlice';
import { useRegisterMutation } from 'src/app/api/auth/authApiSlice';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProfileInfoView() {
  const user = useSelector(selectCurrentUser);

  const router = useRouter();

  const defaultState = {
    name: '',
    oldPassword: '',
    newPassword: '',
  };

  const [state, setState] = useState(defaultState);

  const [err, setErr] = useState(defaultState);

  const [showPassword, setShowPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (user) {
      const newState = { ...state };
      newState.name = user?.name;
      setState(newState);
    }
  }, [user, state]);

  const handleLogin = useLogin();

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

  const handleClick = async (e) => {
    if (!validate()) return;

    try {
      const response = await register(state).unwrap();
      handleLogin(response);
      router.push('/');
    } catch (error) {
      handleError(error);
    }
  };

  // const handleLoginClick = () => {
  //   router.push('/login');
  // };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        newErr[key] = 'Field value required!';
        isValid = false;
      }
    });

    setErr(newErr);

    return isValid;
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
      <Avatar src={user?.avatarUrl} alt="photoURL" sx={{ width: 70, height: 70 }} />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{user?.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        height: 1,
        mx: 5,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, width: 1 }} spacing={2}>
        <Box width="100%">
          <Typography variant="h5" textAlign="left" width="100%" sx={{ mb: 0.5 }}>
            MY PROFILE
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
            CHANGE NAME
          </Typography>

          <Box>
            <Typography variant="subtitle2">
              <span style={{ color: 'red' }}>*</span> Name
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
                // fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                // onClick={handleClick}
                sx={{ mt: 2 }}
                // loading={isLoading}
              >
                Update
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
            CHANGE PASSWORD
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2">
                Old Password <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="oldPassword"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon style={{fontSize: "18px"}}/>
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
                placeholder='Enter your old password'
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">
                New Password <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon style={{fontSize: "18px"}}/>
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
                placeholder='Enter your new password'
              />
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleClick}
              sx={{ mt: 2 }}
              loading={isLoading}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
