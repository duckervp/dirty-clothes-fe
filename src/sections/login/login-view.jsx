import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import useLogin from 'src/hooks/use-login';

import { handleError } from 'src/utils/notify';

import { bgGradient } from 'src/theme/css';
import { useLoginMutation } from 'src/app/api/auth/authApiSlice';

import Iconify from 'src/components/iconify';

import { LOGO_NAME, EMAIL_REGEX } from '../../config';


// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [login, {isLoading}] = useLoginMutation();

  const defaultState = {
    email: '',
    password: '',
  };

  const [state, setState] = useState(defaultState);

  const [err, setErr] = useState(defaultState);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useLogin();

  const handleClick = async () => {
    if (!validate()) return;

    try {
      const response = await login(state).unwrap();
      handleLogin(response);
      router.push('/');
    } catch (error) {
      handleError(error);
    }
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

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

  const isValidEmail = () =>
    state.email === '' || state.email.match(EMAIL_REGEX);

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        newErr[key] = 'Field value required!';
        isValid = false;
      }
    });

    if (isValid && !state.email.match('^[a-zA-Z0-9+_.\\-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]+$')) {
      newErr.email = 'Invalid email address!';
      isValid = false;
    }

    setErr(newErr);

    return isValid;
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          autoComplete="false"
          value={state.email}
          onChange={handleStateChange}
          error={!isValidEmail() || err.email !== ''}
          helperText={
            (!isValidEmail() && 'Invalid email address!') || (err.email !== '' && err.email)
          }
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="false"
          value={state.password}
          onChange={handleStateChange}
          error={err.password !== ''}
          helperText={err.password !== '' && err.password}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={isLoading}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Stack direction="row" alignItems="center">
            <Typography variant="h4">Sign in to </Typography>
            <Typography variant="h4" sx={{ ml: 1, fontFamily: 'Audiowide', display: 'inline' }}>
              {LOGO_NAME}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don&apos;t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleRegisterClick}>
              Get started
            </Link>
          </Typography>

          {/* <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
