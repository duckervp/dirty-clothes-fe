import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { getUrl, PRODUCT_MANAGEMENT } from 'src/routes/route-config';

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
  const { t } = useTranslation('product-m', { keyPrefix: 'product-detail' });

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

      if (!isEditScreen) {
        const { data } = await createProduct(payload).unwrap();
        showSuccessMessage(data);
      } else {
        const { data } = await updateProduct({ id, payload }).unwrap();
        showSuccessMessage(data);
      }
      router.push(getUrl(PRODUCT_MANAGEMENT.INDEX));
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
          newErr[key] = t('form.error.field-required');
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
    router.push(getUrl(PRODUCT_MANAGEMENT.EDIT, { id }));
  }

  const handleDelete = async () => {
    try {
      const { data } = await deleteProduct(id).unwrap();
      showSuccessMessage(data);
      router.push(getUrl(PRODUCT_MANAGEMENT.INDEX));
    } catch (error) {
      handleError(error);
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);

  const handleCancel = () => {
    setPopupOpen(true);
  }

  const handleConfirmCancel = () => {
    router.push(getUrl(PRODUCT_MANAGEMENT.INDEX));
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
          <span style={{ color: 'red' }}>*</span> {t('form.name')}
        </Typography>
        <TextField
          name="name"
          fullWidth
          autoComplete="off"
          value={state.name}
          onChange={handleStateChange}
          error={err.name !== ''}
          helperText={err.name !== '' && err.name}
          disabled={isDetailScreen}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('form.image')}
        </Typography>
        <ImageUploader imageUrl={state.avatarUrl} setImageUrl={setAvatarUrl} disabled={isDetailScreen} />
        {err.avatarUrl && <Typography variant="caption" color="red">
          {err.avatarUrl}
        </Typography>}
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('form.target')}
        </Typography>
        <Select id="select-target" value={state.target} onChange={handleStateChange} name='target' fullWidth disabled={isDetailScreen}>
          {TARGET_OPTIONS.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
        </Select>
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('form.status')}
        </Typography>
        <Select id="select-target" value={state.status} onChange={handleStateChange} name='status' fullWidth disabled={isDetailScreen}>
          {PRODUCT_STATUS_OPTIONS.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
        </Select>
      </Box>
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {t('form.price')} (₫)
        </Typography>
        <TextField
          name="price"
          fullWidth
          autoComplete="off"
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
            <span style={{ color: 'red' }}>*</span> {t('form.sale')} (₫)
          </Typography>
          <TextField
            name="salePrice"
            fullWidth
            autoComplete="off"
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

  return (
    <Box>
      <ConfirmPopup
        content={{
          title: isCreateScreen
            ? t("confirm-pu.action-create-title")
            : t("confirm-pu.action-edit-title"),
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
            pt: 2.5, pb: 5,
            width: "100%",
          }}
        >
          <Box sx={{ px: 5, }}>
            {isDetailScreen &&
              <TitleBar
                title={t('title.detail')}
                screen="detail"
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                goBackUrl={getUrl(PRODUCT_MANAGEMENT.INDEX)} />
            }
            {isEditScreen && <TitleBar title={t('title.edit')} screen="edit" goBackUrl={getUrl(PRODUCT_MANAGEMENT.INDEX)} />}
            {isCreateScreen && <TitleBar title={t('title.create')} screen="create" goBackUrl={getUrl(PRODUCT_MANAGEMENT.INDEX)} />}

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
            <Editor label={t('form.description')} data={state.description} setData={setDescription} disabled={isDetailScreen} />

            <Stack>
              {!isCreateScreen && productDetail.createdBy && productDetail.createdAt &&
                <Typography variant="body2">
                  {t('form.created-by')}: <b>{productDetail.createdBy}</b> {t('form.in')} <b>{fDateTime(productDetail.createdAt)}</b>
                </Typography>
              }
              {isDetailScreen && productDetail.updatedAt && productDetail.updatedBy &&
                <Typography variant="body2">
                  {t('form.updated-by')}: <b>{productDetail.updatedBy}</b> {t('form.in')} <b>{fDateTime(productDetail.updatedAt)}</b>
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
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
