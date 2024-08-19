import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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
import { LOGO_NAME, EMAIL_REGEX } from 'src/config';
import { useRegisterMutation } from 'src/app/api/auth/authApiSlice';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserDetailView() {
  const theme = useTheme();

  const router = useRouter();

  const defaultState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [state, setState] = useState(defaultState);

  const [err, setErr] = useState(defaultState);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

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

  const handleLoginClick = () => {
    router.push('/login');
  };

  const isIncorrectConfirmPassword = () =>
    state.password !== '' &&
    state.confirmPassword !== '' &&
    state.confirmPassword !== state.password;

  const isValidEmail = () => state.email === '' || state.email.match(EMAIL_REGEX);

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        newErr[key] = 'Field value required!';
        isValid = false;
      }
    });

    if (isValid && !state.email.match(EMAIL_REGEX)) {
      newErr.email = 'Invalid email address!';
      isValid = false;
    }

    setErr(newErr);

    return isValid;
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Your name"
          autoComplete="false"
          value={state.name}
          onChange={handleStateChange}
          error={err.name !== ''}
          helperText={err.name !== '' && err.name}
        />

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

        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="false"
          value={state.confirmPassword}
          onChange={handleStateChange}
          error={isIncorrectConfirmPassword() || err.confirmPassword !== ''}
          helperText={
            (isIncorrectConfirmPassword() && 'Confirm password does not match!') ||
            (err.confirmPassword !== '' && err.confirmPassword)
          }
          onKeyPress={handleKeyPress}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ mt: 3 }}
        loading={isLoading}
      >
        Register
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
            <Typography variant="h4">Register to </Typography>
            <Typography variant="h4" sx={{ ml: 1, fontFamily: 'Dancing Script', display: 'inline'}}>
              {LOGO_NAME}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleLoginClick}>
              Login
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
