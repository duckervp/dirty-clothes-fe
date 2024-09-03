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

import { fDateTime } from 'src/utils/format-time';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import { Role, EMAIL_REGEX } from 'src/config';
import { useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation, useGetUserDetailMutation } from 'src/app/api/user/userApiSlice';

import Iconify from 'src/components/iconify';
import TitleBar from 'src/components/title-bar/TitleBar';
import ConfirmPopup from 'src/components/modal/confirm-popup';

// ----------------------------------------------------------------------

export default function UserDetailView() {

  const location = useLocation();

  const { id } = useParams();

  const isEditScreen = location.pathname.includes('edit');

  const isDetailScreen = location.pathname.includes('detail');

  const isCreateScreen = location.pathname.includes('create');

  const [getUserDetail] = useGetUserDetailMutation();

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [deleteUser] = useDeleteUserMutation();

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

  const [auditData, setAuditData] = useState(defaultState);

  const [err, setErr] = useState(defaultErrState);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, setUpdatePassword] = useState(false);

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
      const payload = {
        name: state.name,
        email: state.email,
        status: state.status,
        role: state.role,
        password: state.password,
      };

      if (!isEditScreen) {
        const { data } = await createUser(payload).unwrap();
        showSuccessMessage(data);
      } else {
        const { data } = await updateUser({ id, payload }).unwrap();
        showSuccessMessage(data);
      }
      router.push('/admin/user-management');
    } catch (error) {
      handleError(error);
    }
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
        if (isEditScreen && !updatePassword && ['password', 'confirmPassword'].includes(key)) {
          // do nothing
        } else {
          newErr[key] = 'Field value required!';
          isValid = false;
        }
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

      setAuditData({
        createdAt: data.data.createdAt,
        createdBy: data.data.createdBy,
        updatedAt: data.data.updatedAt,
        updatedBy: data.data.updatedBy,
      })
    }

    if (id) {
      fetchUserDetail();
    }
  }, [id, getUserDetail]);

  const handleStatusSwitchChange = (e) => {
    setState({ ...state, status: e.target.checked })
  }

  const handleRoleSwitchChange = (e) => {
    const role = e.target.checked ? Role.ADMIN : Role.USER;
    setState({ ...state, role })
  }

  const handleEdit = () => {
    router.push(`/admin/user-management/edit-user/${id}`);
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteUser(id).unwrap();
      showSuccessMessage(data);
      router.push('/admin/user-management/');
    } catch (error) {
      handleError(error);
    }
  }

  const handlePasswordUpdate = (e) => {
    setUpdatePassword(e.target.checked);
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push("/admin/user-management");
    setPopupOpen(false);
  }

  const handleCancelCancel = () => {
    setPopupOpen(false);
  }

  const renderPasswordField = (
    <Box>
      <Typography variant="subtitle2">
        <span style={{ color: 'red' }}>*</span> {isEditScreen ? 'New Password' : 'Password'}
      </Typography>
      <TextField
        inputRef={input => input && updatePassword && input.focus()}
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
  );

  const renderConfirmPasswordField = (
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
  )

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
            disabled={isDetailScreen}
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
            disabled={isDetailScreen || isEditScreen}
          />
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 200 }}>
          <Typography variant="subtitle2">
            Status
          </Typography>
          <Switch
            sx={{ inputProps: { ariaLabel: 'Status switch' } }}
            checked={state.status}
            onChange={handleStatusSwitchChange}
            disabled={isDetailScreen}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 200 }}>
          <Typography variant="subtitle2">
            Is Admin
          </Typography>
          <Switch
            sx={{ inputProps: { ariaLabel: 'Role switch' } }}
            checked={state.role === Role.ADMIN}
            onChange={handleRoleSwitchChange}
            disabled={isDetailScreen}
          />
        </Stack>

        {
          isEditScreen &&
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 200 }}>
            <Typography variant="subtitle2"> Change Password </Typography>
            <Switch
              sx={{ inputProps: { ariaLabel: 'Role switch' } }}
              checked={updatePassword}
              onChange={handlePasswordUpdate}
            />
          </Stack>
        }

        {(isCreateScreen || (isEditScreen && updatePassword)) && renderPasswordField}

        {(isCreateScreen || (isEditScreen && updatePassword)) && renderConfirmPasswordField}
      </Stack>

      <Stack sx={{ mt: 3 }}>
        {!isCreateScreen && auditData.createdBy && auditData.createdAt &&
          <Typography variant="body2">
            Created by: <b>{auditData.createdBy}</b> in <b>{fDateTime(auditData.createdAt)}</b>
          </Typography>
        }
        {isDetailScreen && auditData.updatedAt && auditData.updatedBy &&
          <Typography variant="body2">
            Last modified by: <b>{auditData.updatedBy}</b> in <b>{fDateTime(auditData.updatedAt)}</b>
          </Typography>
        }
      </Stack>

      {
        !isDetailScreen &&
        <Box>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleCancel}
            sx={{ mt: 3, width: "200px", mr: 3 }}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ mt: 3, width: "200px" }}
            loading={isEditScreen ? isUpdating : isCreating}
          >
            Save
          </LoadingButton>
        </Box>
      }
    </>
  );

  const object = "user";
  const action = isCreateScreen ? "creation" : "editing";

  return (
    <Box>
      <ConfirmPopup
        content={{
          title: `CANCEL ${object.toUpperCase()} ${action.toUpperCase()}`,
          message: `If you cancel, all unsaved data will be lost. Are you sure you want to cancel ${object} ${action}?`,
          cancelBtnText: "NO",
          confirmBtnText: "YES"
        }}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        handleCancel={handleCancelCancel}
        handleConfirm={handleConfirmCancel}
      />
      <Stack alignItems="center" justifyContent="center" >
        <Card
          sx={{
            px: 5, pt: 2.5, pb: 5,
            width: "100%",
          }}
        >
          {isDetailScreen && <TitleBar title="User Details" screen="detail" handleEdit={handleEdit} handleDelete={handleDelete} goBackUrl='/admin/user-management'/>}
          {isEditScreen && <TitleBar title="Edit User" screen="edit" goBackUrl='/admin/user-management'/>}
          {isCreateScreen && <TitleBar title="Create  User" screen="create" goBackUrl='/admin/user-management'/>}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
