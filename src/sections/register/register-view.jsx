import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

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
import { AUTH, HOME_INDEX, absolutePath } from 'src/routes/route-config';

import useLogin from 'src/hooks/use-login';

import { handleError } from 'src/utils/notify';

import { bgGradient } from 'src/theme/css';
import { useRegisterMutation } from 'src/app/api/auth/authApiSlice';

import Iconify from 'src/components/iconify';

import { LOGO_FONT, LOGO_NAME, EMAIL_REGEX } from '../../config';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { t } = useTranslation('auth');

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
      router.push(HOME_INDEX);
    } catch (error) {
      handleError(error);
    }
  };

  const handleLoginClick = () => {
    router.push(absolutePath(AUTH.LOGIN));
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
        newErr[key] = t('form.error.field-required');
        isValid = false;
      }
    });

    if (isValid && !state.email.match(EMAIL_REGEX)) {
      newErr.email = t('form.error.invalid-email');
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
          label={t('form.name')}
          autoComplete="false"
          value={state.name}
          onChange={handleStateChange}
          error={err.name !== ''}
          helperText={err.name !== '' && err.name}
        />

        <TextField
          name="email"
          label={t('form.email')}
          autoComplete="false"
          value={state.email}
          onChange={handleStateChange}
          error={!isValidEmail() || err.email !== ''}
          helperText={
            (!isValidEmail() && t('form.error.invalid-email')) || (err.email !== '' && err.email)
          }
        />

        <TextField
          name="password"
          label={t('form.password')}
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
          label={t('form.confirm-password')}
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
            (isIncorrectConfirmPassword() && t('form.error.confirm-password')) ||
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
        {t('register.btn-register')}
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
            <Typography variant="h4">{t('register.title')}</Typography>
            <Typography variant="h4" sx={{ ml: 1, fontFamily: LOGO_FONT, display: 'inline' }}>
              {LOGO_NAME}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            <Trans i18nKey="register.caption" ns='auth'>
              Already have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleLoginClick}>
                Login
              </Link>
            </Trans>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
