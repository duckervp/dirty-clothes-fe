import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';
import { handleError, showSuccessMessage } from 'src/utils/notify';

import { SIZE_OPTIONS, TARGET_OPTIONS, PRODUCT_STATUS_OPTIONS } from 'src/config';
import { useUpdateProductMutation, useCreateProductMutation, useDeleteProductMutation, useGetProductDetailMutation } from 'src/app/api/product/productApiSlice';

// import Iconify from 'src/components/iconify';
import Editor from 'src/components/ckeditor/ckeditor';
import TitleBar from 'src/components/title-bar/TitleBar';
import ConfirmPopup from 'src/components/modal/confirm-popup';
import ImageUploader from 'src/components/uploader/image-upload';

import ProductDetailItem from '../product-detail-item';
import ProductDetailImage from '../product-detail-image';
import ProductDetailCategory from '../product-detail-category';

// ----------------------------------------------------------------------

export default function ProductDetailView() {

  const location = useLocation();

  const { id } = useParams();

  const isEditScreen = location.pathname.includes('edit');

  const isDetailScreen = location.pathname.includes('detail');

  const isCreateScreen = location.pathname.includes('create');

  const [getProductDetail] = useGetProductDetailMutation();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [deleteProduct] = useDeleteProductMutation();

  const router = useRouter();

  const defaultState = {
    name: "",
    target: "",
    status: "",
    price: "",
    salePrice: "",
    description: "",
    avatarUrl: "",
  };

  const defaultErrState = {
    name: "",
    target: "",
    status: "",
    price: "",
    salePrice: "",
    description: "",
    avatarUrl: "",
  };

  const [state, setState] = useState(defaultState);

  const [productDetail, setProductDetail] = useState({});

  const [productDetailItems, setProductDetailItems] = useState([]);

  const [productDetailImages, setProductDetailImages] = useState([]);

  const [categoryIds, setCategoryIds] = useState([]);

  const [err, setErr] = useState(defaultErrState);

  const [description, setDescription] = useState();

  const handleStateChange = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
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
      const productDetails = [];
      productDetailItems.forEach(item => {
        SIZE_OPTIONS.forEach(sz => {
          if (item.size === sz.value) {
            productDetails.push(item);
          } else if (item.size === sz.label) {
            const newItem = { ...item, size: sz.value };
            productDetails.push(newItem);
          }
        })
      });
      const payload = {
        ...state,
        description,
        categoryIds,
        productDetails,
        images: productDetailImages
      };
      console.log(payload);

      if (!isEditScreen) {
        const { data } = await createProduct(payload).unwrap();
        showSuccessMessage(data);
        router.push('/admin/product-management');
      } else {
        const { data } = await updateProduct({ id, payload }).unwrap();
        showSuccessMessage(data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErr = { ...err };
    Object.keys(state).forEach((key) => {
      if (state[key] === '') {
        if ((key === 'description' && description !== '') || (key === 'salePrice' && state.status !== "SALE")) {
          // do nothing
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
    const fetchProductDetail = async () => {
      const { data } = await getProductDetail(id);
      setState({
        name: data.data.name,
        target: data.data.target,
        status: data.data.status,
        price: data.data.price,
        salePrice: data.data.salePrice,
        description: data.data.description,
        createdAt: data.data.createdAt,
        createdBy: data.data.createdBy,
        updatedAt: data.data.updatedAt,
        updatedBy: data.data.updatedBy,
        avatarUrl: data.data.avatarUrl,
      });

      setProductDetail(data.data);
      setProductDetailItems(data.data.productDetails);
      setProductDetailImages(data.data.images);
    }

    if (id) {
      fetchProductDetail();
    }
  }, [id, getProductDetail]);

  const handleEdit = () => {
    router.push(`/admin/product-management/edit-product/${id}`);
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteProduct(id).unwrap();
      showSuccessMessage(data);
      router.push('/admin/product-management/');
    } catch (error) {
      handleError(error);
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push("/admin/product-management");
    setPopupOpen(false);
  }

  const handleCancelCancel = () => {
    setPopupOpen(false);
  }

  const setAvatarUrl = (url) => {
    setState({ ...state, avatarUrl: url });
    if (err.avatarUrl !== '') {
      const newErr = { ...err };
      newErr.avatarUrl = '';
      setErr(newErr);
    }
  }

  const renderForm = (
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
          <span style={{ color: 'red' }}>*</span> Image
        </Typography>
        <ImageUploader imageUrl={state.avatarUrl} setImageUrl={setAvatarUrl} disabled={isDetailScreen} />
        {err.avatarUrl && <Typography variant="caption" color="red">
          {err.avatarUrl}
        </Typography>}
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> Target
        </Typography>
        <Select id="select-target" value={state.target} onChange={handleStateChange} name='target' fullWidth disabled={isDetailScreen}>
          {TARGET_OPTIONS.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
        </Select>
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> Status
        </Typography>
        <Select id="select-target" value={state.status} onChange={handleStateChange} name='status' fullWidth disabled={isDetailScreen}>
          {PRODUCT_STATUS_OPTIONS.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
        </Select>
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> Price (₫)
        </Typography>
        <TextField
          name="price"
          fullWidth
          autoComplete="false"
          value={state.price}
          onChange={handleStateChange}
          error={err.price !== ''}
          helperText={err.price !== '' && err.price}
          disabled={isDetailScreen}
          type='number'
        />
      </Box>
      {
        state.status === 'SALE' &&
        <Box>
          <Typography variant="subtitle2">
            <span style={{ color: 'red' }}>*</span> Sale Price (₫)
          </Typography>
          <TextField
            name="salePrice"
            fullWidth
            autoComplete="false"
            value={state.salePrice}
            onChange={handleStateChange}
            error={err.salePrice !== ''}
            helperText={err.salePrice !== '' && err.salePrice}
            disabled={isDetailScreen}
            type='number'
          />
        </Box>
      }

    </Stack>
  );

  const object = "product";
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
            pt: 2.5, pb: 5,
            width: "100%",
          }}
        >
          <Box sx={{ px: 5, }}>
            {isDetailScreen && <TitleBar title="Product Details" screen="detail" handleEdit={handleEdit} handleDelete={handleDelete} />}
            {isEditScreen && <TitleBar title="Edit Product" screen="edit" />}
            {isCreateScreen && <TitleBar title="Create  Product" screen="create" />}

            {renderForm}
          </Box>

          <Stack spacing={3} sx={{ mt: 3, px: 5, }}>
            <ProductDetailCategory categories={productDetail.categories} disabled={isDetailScreen} setSelectedCategories={setCategoryIds} />
          </Stack>
          <Stack spacing={3} sx={{ mt: 3, px: 5, pt: 2, pb: 5, background: "#E7FBE6" }}>
            <ProductDetailItem productDetailItems={productDetailItems} setProductDetailItems={setProductDetailItems} disabled={isDetailScreen} />
          </Stack>
          <Stack spacing={3} sx={{ mt: 3, px: 5, pt: 2, pb: 5, background: "#E7FBE6" }}>
            <ProductDetailImage productDetailImages={productDetailImages} setProductDetailImages={setProductDetailImages} disabled={isDetailScreen} />
          </Stack>
          <Stack spacing={3} sx={{ mt: 3, px: 5, }}>
            <Editor label='Description' data={state.description} setData={setDescription} disabled={isDetailScreen} />

            <Stack>
              {!isCreateScreen && <Typography variant="body2"> Created by: <b>{state.createdBy}</b> in <b>{fDateTime(state.createdAt)}</b></Typography>}
              {isDetailScreen && <Typography variant="body2"> Last modified by: <b>{state.updatedBy}</b> in <b>{fDateTime(state.updatedAt)}</b></Typography>}
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
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
