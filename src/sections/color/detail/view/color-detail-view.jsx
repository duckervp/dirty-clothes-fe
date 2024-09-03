import { useState, useEffect } from 'react';
import { MuiColorInput } from 'mui-color-input';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { absolutePath, COLOR_MANAGEMENT } from 'src/routes/route-config';

import { fDateTime } from 'src/utils/format-time';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import {
  useUpdateColorMutation,
  useCreateColorMutation,
  useDeleteColorMutation,
  useGetColorDetailMutation,
} from 'src/app/api/color/colorApiSlice';

import TitleBar from 'src/components/title-bar/TitleBar';
import ConfirmPopup from 'src/components/modal/confirm-popup';

// ----------------------------------------------------------------------

export default function ColorDetailView() {

  const location = useLocation();

  const { id } = useParams();

  const isEditScreen = location.pathname.includes('edit');

  const isDetailScreen = location.pathname.includes('detail');

  const isCreateScreen = location.pathname.includes('create');

  const [getColorDetail] = useGetColorDetailMutation();

  const [createColor, { isLoading: isCreating }] = useCreateColorMutation();

  const [updateColor, { isLoading: isUpdating }] = useUpdateColorMutation();

  const [deleteColor] = useDeleteColorMutation();

  const router = useRouter();

  const defaultState = {
    name: '',
    value: '',
  };

  const defaultErrState = {
    name: '',
    value: ''
  };

  const [state, setState] = useState(defaultState);

  const [auditData, setAuditData] = useState(defaultState);

  const [err, setErr] = useState(defaultErrState);

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
        ...state
      };

      if (!isEditScreen) {
        const { data } = await createColor(payload).unwrap();
        showSuccessMessage(data);
      } else {
        const { data } = await updateColor({ id, payload }).unwrap();
        showSuccessMessage(data);
      }
      router.push(absolutePath(COLOR_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  };

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

  useEffect(() => {
    const fetchColorDetail = async () => {
      const { data } = await getColorDetail(id);
      setState({
        name: data.data.name,
        value: data.data.value,
      });

      setAuditData({
        createdAt: data.data.createdAt,
        createdBy: data.data.createdBy,
        updatedAt: data.data.updatedAt,
        updatedBy: data.data.updatedBy,
      })
    }

    if (id) {
      fetchColorDetail();
    }
  }, [id, getColorDetail]);

  const handleEdit = () => {
    const url = absolutePath(COLOR_MANAGEMENT.EDIT).replace(":id", id);
    router.push(url);
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteColor(id).unwrap();
      showSuccessMessage(data);
      router.push(absolutePath(COLOR_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push(absolutePath(COLOR_MANAGEMENT.INDEX));
    setPopupOpen(false);
  }

  const handleCancelCancel = () => {
    setPopupOpen(false);
  }

  const handleColorChange = (value) => {
    setState({ ...state, value });
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
            disabled={isDetailScreen}
          />
        </Box>

        <Stack>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Value
          </Typography>
          <MuiColorInput
            format='hex'
            fullWidth
            value={state.value}
            onChange={handleColorChange}
            error={err.value !== ''}
            helperText={err.value !== '' && err.value}
            disabled={isDetailScreen}
          />
        </Stack>
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

  const object = "color";
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
          {isDetailScreen &&
            <TitleBar
              title="Color Details"
              screen="detail"
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              goBackUrl={absolutePath(COLOR_MANAGEMENT.INDEX)}
              object={object}
            />
          }
          {isEditScreen && <TitleBar title="Edit Color" screen="edit" goBackUrl={absolutePath(COLOR_MANAGEMENT.INDEX)} />}
          {isCreateScreen && <TitleBar title="Create  Color" screen="create" goBackUrl={absolutePath(COLOR_MANAGEMENT.INDEX)} />}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
