import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiColorInput } from 'mui-color-input';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { getUrl, COLOR_MANAGEMENT } from 'src/routes/route-config';

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
  const { t } = useTranslation('color', { keyPrefix: "color-detail" })

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
      router.push(getUrl(COLOR_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        newErr[key] = t('form.error.field-required');
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
    router.push(getUrl(COLOR_MANAGEMENT.EDIT, { id }));
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteColor(id).unwrap();
      showSuccessMessage(data);
      router.push(getUrl(COLOR_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push(getUrl(COLOR_MANAGEMENT.INDEX));
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
            <span style={{ color: 'red' }}>*</span> {t('form.name')}
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
            <span style={{ color: 'red' }}>*</span> {t('form.value')}
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
            {t('form.created-by')}: <b>{auditData.createdBy}</b> {t('form.in')} <b>{fDateTime(auditData.createdAt)}</b>
          </Typography>
        }
        {isDetailScreen && auditData.updatedAt && auditData.updatedBy &&
          <Typography variant="body2">
            {t('form.updated-by')}: <b>{auditData.updatedBy}</b> {t('form.in')} <b>{fDateTime(auditData.updatedAt)}</b>
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
            {t('form.btn-cancel')}
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
            {t('form.btn-save')}
          </LoadingButton>
        </Box>
      }
    </>
  );

  return (
    <Box>
      <ConfirmPopup
        content={{
          title: isCreateScreen
            ? t('confirm-pu.action-create-title') : t('confirm-pu.action-edit-title'),
          message: t('confirm-pu.message'),
          cancelBtnText: t('confirm-pu.cancel-btn-text'),
          confirmBtnText: t('confirm-pu.confirm-btn-text')
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
              title={t('title.detail')}
              screen="detail"
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              goBackUrl={getUrl(COLOR_MANAGEMENT.INDEX)}
              object={t('object')}
            />
          }
          {isEditScreen && <TitleBar title={t('title.edit')} screen="edit" goBackUrl={getUrl(COLOR_MANAGEMENT.INDEX)} />}
          {isCreateScreen && <TitleBar title={t('title.create')} screen="create" goBackUrl={getUrl(COLOR_MANAGEMENT.INDEX)} />}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
