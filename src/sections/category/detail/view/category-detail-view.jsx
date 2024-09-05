import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { getUrl, CATEGORY_MANAGEMENT } from 'src/routes/route-config';

import { fDateTime } from 'src/utils/format-time';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import {
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryFilterQuery,
  useGetCategoryDetailMutation,
} from 'src/app/api/category/categoryApiSlice';

import TitleBar from 'src/components/title-bar/TitleBar';
import ConfirmPopup from 'src/components/modal/confirm-popup';

// ----------------------------------------------------------------------

export default function CategoryDetailView() {

  const location = useLocation();

  const { id } = useParams();

  const isEditScreen = location.pathname.includes('edit');

  const isDetailScreen = location.pathname.includes('detail');

  const isCreateScreen = location.pathname.includes('create');

  const { data: categoryFilterData } = useGetCategoryFilterQuery({ parent: true });

  const [getCategoryDetail] = useGetCategoryDetailMutation();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const router = useRouter();

  const defaultState = {
    name: '',
    parentId: '',
    parent: false
  };

  const defaultErrState = {
    name: '',
    parentId: ''
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
        name: state.name,
        parentId: state.parentId
      };

      if (state.parent) {
        payload.parentId = null;
      }

      if (!isEditScreen) {
        const { data } = await createCategory(payload).unwrap();
        showSuccessMessage(data);
      } else {
        const { data } = await updateCategory({ id, payload }).unwrap();
        showSuccessMessage(data);
      }
      router.push(getUrl(CATEGORY_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        if (key === 'parentId' && state.parent) {
          // pass
        } else {
          newErr[key] = 'Field value required!';
          isValid = false;
        }
      }
    });

    setErr(newErr);

    return isValid;
  };

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      const { data } = await getCategoryDetail(id);
      setState({
        name: data.data.name,
        parentId: data.data.parentId ? data.data.parentId : "",
        parent: !data.data.parentId
      });

      setAuditData({
        createdAt: data.data.createdAt,
        createdBy: data.data.createdBy,
        updatedAt: data.data.updatedAt,
        updatedBy: data.data.updatedBy,
      })
    }

    if (id) {
      fetchCategoryDetail();
    }
  }, [id, getCategoryDetail]);

  const handleEdit = () => {
    const url = getUrl(CATEGORY_MANAGEMENT.EDIT).replace(":id", id);
    router.push(url);
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteCategory(id).unwrap();
      showSuccessMessage(data);
      router.push(getUrl(CATEGORY_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push(getUrl(CATEGORY_MANAGEMENT.INDEX));
    setPopupOpen(false);
  }

  const handleCancelCancel = () => {
    setPopupOpen(false);
  }

  const handleParentSwitchChange = (e) => {
    const parent = e.target.checked;
    setState({ ...state, parent })
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 200 }}>
          <Typography variant="subtitle2">
            Is Parent
          </Typography>
          <Switch
            sx={{ inputProps: { ariaLabel: 'Parent switch' } }}
            checked={state.parent}
            onChange={handleParentSwitchChange}
            disabled={isDetailScreen || (isEditScreen && !state.parentId)}
          />
        </Stack>
        {!state.parent && <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Parent
          </Typography>
          <Select id="select-category" value={state?.parentId} onChange={handleStateChange} name='parentId' fullWidth >
            {categoryFilterData?.data?.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
          </Select>
          {err.parentId && <Typography variant="caption" color="red">
            {err.parentId}
          </Typography>}
        </Box>}

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

  const object = "category";
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
              title="Category Details"
              screen="detail"
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              goBackUrl={getUrl(CATEGORY_MANAGEMENT.INDEX)}
              deleteMessage={state.parent ? "Are you sure you want to permanently remove this category from the system? Since this category is a parent category, all the children will also be deleted. Do you want to continue?" : null}
              object={object}
            />
          }
          {isEditScreen && <TitleBar title="Edit Category" screen="edit" goBackUrl={getUrl(CATEGORY_MANAGEMENT.INDEX)} />}
          {isCreateScreen && <TitleBar title="Create  Category" screen="create" goBackUrl={getUrl(CATEGORY_MANAGEMENT.INDEX)} />}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
