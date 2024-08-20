import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import useLogin from 'src/hooks/use-login';

import { handleError } from 'src/utils/notify';

import { Role, EMAIL_REGEX } from 'src/config';
import { useRegisterMutation } from 'src/app/api/auth/authApiSlice';
import { useGetUserDetailMutation } from 'src/app/api/user/userApiSlice';

import Iconify from 'src/components/iconify';
import TitleBar from 'src/components/title-bar/TitleBar';

// ----------------------------------------------------------------------

export default function UserDetailView() {

  const location = useLocation();

  const { id } = useParams();

  const isEditScreen = location.pathname.includes('edit');

  const isDetailScreen = location.pathname.includes('detail');

  const [getUserDetail] = useGetUserDetailMutation();

  const router = useRouter();

  const defaultState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: Role.USER,
    status: false
  };

  const defaultErrState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const [state, setState] = useState(defaultState);

  const [err, setErr] = useState(defaultErrState);

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

  // const handleLoginClick = () => {
  //   router.push('/login');
  // };

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

  useEffect(() => {
    const fetchUserDetail = async () => {
      const { data } = await getUserDetail(id);
      setState({
        name: data.data.name,
        email: data.data.email,
        status: data.data.status,
        role: data.data.role,
        password: '',
        confirmPassword: ''
      });
    }

    if (id) {
      fetchUserDetail();
    }
  }, [id, getUserDetail]);

  const handleStatusSwitchChange = (e) => {
    setState({...state, status: e.target.checked})
  }

  const handleRoleSwitchChange = (e) => {
    const role  =  e.target.checked ? Role.ADMIN : Role.USER;
    setState({...state, role})
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Name
          </Typography>
          <TextField
            name="name"
            fullWidth
            autoComplete="false"
            value={state.name}
            onChange={handleStateChange}
            error={err.name !== ''}
            helperText={err.name !== '' && err.name}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Email
          </Typography>
          <TextField
            fullWidth
            name="email"
            autoComplete="false"
            value={state.email}
            onChange={handleStateChange}
            error={!isValidEmail() || err.email !== ''}
            helperText={
              (!isValidEmail() && 'Invalid email address!') || (err.email !== '' && err.email)
            }
          />
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 160 }}>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Status
          </Typography>
          <Switch sx={{ inputProps: { ariaLabel: 'Status switch' } }} checked={state.status} onChange={handleStatusSwitchChange} />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 160 }}>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Is Admin
          </Typography>
          <Switch sx={{ inputProps: { ariaLabel: 'Role switch' } }} checked={state.role === Role.ADMIN} onChange={handleRoleSwitchChange}/>
        </Stack>

        {
          !isDetailScreen &&
          <Box>
            <Typography variant="subtitle2">
              <span style={{ color: 'red' }}>*</span> {isEditScreen ? 'New Password' : 'Password'}
            </Typography>
            <TextField
              fullWidth
              name="password"
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
          </Box>
        }

        {
          !isDetailScreen &&
          <Box>
            <Typography variant="subtitle2">
              <span style={{ color: 'red' }}>*</span> Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
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
            />
          </Box>
        }

      </Stack>

      <LoadingButton
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ mt: 3, width: "200px", mr: 3 }}
        loading={isLoading}
        disabled
      >
        Cancel
      </LoadingButton>
      <LoadingButton
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        sx={{ mt: 3, width: "200px" }}
        loading={isLoading}
      >
        Save
      </LoadingButton>
    </>
  );

  return (
    <Box>
      <Stack alignItems="center" justifyContent="center" >
        <Card
          sx={{
            p: 5,
            width: "100%",
          }}
        >
          {isDetailScreen && <TitleBar title="User Details" />}
          {isEditScreen && <TitleBar title="Edit User" />}
          {!isDetailScreen && !isEditScreen && <TitleBar title="Create User" />}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
