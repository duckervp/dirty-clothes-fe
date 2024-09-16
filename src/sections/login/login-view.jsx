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
import { AUTH, getUrl, HOME_INDEX } from 'src/routes/route-config';

import useLogin from 'src/hooks/use-login';
import useNotify from 'src/hooks/use-notify';

import { bgGradient } from 'src/theme/css';
import { useLoginMutation } from 'src/app/api/auth/authApiSlice';

import Iconify from 'src/components/iconify';

import { LOGO_FONT, LOGO_NAME, EMAIL_REGEX } from '../../config';


// ----------------------------------------------------------------------

export default function LoginView() {
  const { t } = useTranslation('auth');

  const {showErrorMsg} = useNotify();

  const theme = useTheme();

  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const [debounceTimeouts, setDebounceTimeouts] = useState({});

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
      router.push(HOME_INDEX);
    } catch (error) {
      showErrorMsg(error);
    }
  };

  const handleRegisterClick = () => {
    router.push(getUrl(AUTH.REGISTER));
  };

  const handleStateChange = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);

    if (debounceTimeouts[e.target.name]) {
      clearTimeout(debounceTimeouts[e.target.name]);
    }

    if (err[e.target.name] !== '') {
      const newErr = { ...err };
      newErr[e.target.name] = '';
      setErr(newErr);
    }

    const newTimeout = setTimeout(() => {
      validateInput(e.target.name, e.target.value);
    }, 500);

    setDebounceTimeouts((prevTimeouts) => ({
      ...prevTimeouts,
      [e.target.name]: newTimeout,
    }));

  };

  const validateInput = (name, value) => {
    const newErr = { ...err };
    
    newErr[name] = '';
    
    if (name === 'email' && !isValidEmail(value)) {
      newErr[name] = t('form.error.invalid-email');
    }
  
    setErr(newErr);
  };

  const isValidEmail = () => state.email.match(EMAIL_REGEX);

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
          name="email"
          label={t('form.email')}
          autoComplete="off"
          value={state.email}
          onChange={handleStateChange}
          error={ err.email !== ''}
          helperText={
            (err.email !== '' && err.email)
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
          autoComplete="off"
          value={state.password}
          onChange={handleStateChange}
          error={err.password !== ''}
          helperText={err.password !== '' && err.password}
          onKeyPress={handleKeyPress}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          {t('form.forgot-password')}
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
        {t('login.btn-login')}
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
            <Typography variant="h4">{t('login.title')}</Typography>
            <Typography variant="h4" sx={{ ml: 1, fontFamily: LOGO_FONT, display: 'inline' }}>
              {LOGO_NAME}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            <Trans i18nKey="login.caption" ns="auth">
              Don&apos;t have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleRegisterClick}>
                Get started
              </Link>
            </Trans>
          </Typography>

          {/* SocialLogin If Need */}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
