import parse from 'html-react-parser';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageGallery from 'react-image-gallery';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { BUYNOW, getUrl } from 'src/routes/route-config';

import useNotify from 'src/hooks/use-notify';

import { toListObj } from 'src/utils/array';
// import { showSuccessMessage } from 'src/utils/notify';

import { useGetProductDetailQuery } from 'src/app/api/product/productApiSlice';
import { addProductToCart, setBuyNowProduct } from 'src/app/api/cart/cartSlice';

import Loading from 'src/components/auth/Loading';
import ProductPrice from 'src/components/product/product-price';
import { ButtonList } from 'src/components/button-list/button-list';
import QuantityButtonGroup from 'src/components/product/quantity-button-group';

const mapSliderImages = (productDetailImages) => {
  if (!productDetailImages) return [];
  return productDetailImages.map((item) => ({
    original: item.imageUrl,
    thumbnail: item.imageUrl,
  }));
};

export default function ProductInfoView() {
  const { t } = useTranslation('product', { keyPrefix: 'product-info' });

  const { showSuccessMsg } = useNotify();

  const { slug } = useParams();

  const dispatch = useDispatch();

  const router = useRouter();

  const { data: detailedProductData, error: detailedProductError, isLoading } = useGetProductDetailQuery(slug);

  const [detailedProduct, setDetailedProduct] = useState({});

  const [imageDisplayIndex, setImageDisplayIndex] = useState(0);

  const [selectedColorId, setSelectedColorId] = useState(0);

  const [selectedSize, setSelectedSize] = useState();

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [otherProducts] = useState([]);

  useEffect(() => {
    if (detailedProductError && detailedProductError.data.code === 2000) {
      router.push('404');
    }
  }, [detailedProductError, router]);

  useEffect(() => {
    if (detailedProductData) {
      const { data } = detailedProductData;
      setDetailedProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedColorId(data.images[0]?.colorId);
      }

      if (data.productDetails && data.productDetails.length > 0) {
        setSelectedSize(data.productDetails[0].size);
      }
    }
  }, [detailedProductData]);

  useEffect(() => {
    if (detailedProduct) {
      const productImages = detailedProduct.images;
      if (productImages) {
        const image = productImages.filter((item) => item.colorId === selectedColorId)[0];
        setImageDisplayIndex(productImages.indexOf(image));
      }
    }
  }, [detailedProduct, selectedColorId]);

  const hanleImageSlideChange = (index) => {
    setImageDisplayIndex(index);
    if (detailedProduct) {
      const productImages = detailedProduct.images;
      if (productImages) {
        const image = productImages[index];
        setSelectedColorId(image.colorId);
      }
    }
  };

  const getSelectedProductDetail = () => {
    if (detailedProduct.productDetails) {
      const result = detailedProduct.productDetails.filter(
        (item) => item.colorId === selectedColorId && item.size === selectedSize
      );
      if (result.length > 0) {
        return result[0];
      }
    }

    return { inventory: 0, sold: 0 };
  };

  const getSelectedProductImage = () => {
    if (detailedProduct.images) {
      const result = detailedProduct.images.filter((item) => item.colorId === selectedColorId);
      if (result.length > 0) {
        return result[0];
      }
    }

    return { inventory: 0, sold: 0 };
  };

  const getSelectedProductInfo = () => {
    const productDetail = getSelectedProductDetail();
    const productImage = getSelectedProductImage();
    return {
      productId: detailedProduct.id,
      name: detailedProduct.name,
      productDetailId: productDetail.id,
      size: productDetail.size,
      color: productImage.colorName,
      image: productImage.imageUrl,
      quantity: selectedQuantity,
      price: detailedProduct.status === 'SALE' ? detailedProduct.salePrice : detailedProduct.price,
      slug: detailedProduct.slug,
    };
  };

  const hanleAddToCartClick = () => {
    const selectedProduct = getSelectedProductInfo();
    dispatch(addProductToCart({ selectedProduct }));

    // showSuccessMessage('Added product to cart successfully!');
    showSuccessMsg('custom.cart.add-success');
  };

  const hanleBuyNowClick = () => {
    const selectedProduct = getSelectedProductInfo();
    dispatch(setBuyNowProduct({ selectedProduct }));
    router.push(getUrl(BUYNOW));
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <Container>
      <Grid container spacing={5} >
        <Grid xs={12} sm={12} md={8}>
          <ImageGallery
            items={mapSliderImages(detailedProduct?.images)}
            showFullscreenButton={false}
            showPlayButton={false}
            showNav={false}
            startIndex={imageDisplayIndex}
            onSlide={hanleImageSlideChange}
          />
        </Grid>
        <Grid xs={12} sm={12} md={4}>
            <Typography variant="h5" textAlign="center" fontWeight={500} marginBottom={0.5}>
              {detailedProduct?.name}
            </Typography>

            <ProductPrice
              product={detailedProduct}
              sx={{ textAlign: 'center', fontWeight: 300, mb: 2 }}
            />

            <Box marginBottom={2}>
              <ButtonList
                items={toListObj(detailedProduct?.images, 'colorId', 'colorName')}
                itemId={selectedColorId}
                setItemId={setSelectedColorId}
              />
            </Box>
            <Box marginBottom={1}>
              <ButtonList
                items={toListObj(detailedProduct?.productDetails, 'size', 'size')}
                itemId={selectedSize}
                setItemId={setSelectedSize}
              />
            </Box>

            <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
              <QuantityButtonGroup value={selectedQuantity} setValue={setSelectedQuantity} sx={{ height: 40 }} />
            </Stack>

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {t('inventory')}: {getSelectedProductDetail()?.inventory}
              </Typography>
              <Typography variant="body2">{t('sold')}: {getSelectedProductDetail()?.sold}</Typography>
            </Stack>

            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 0, mb: 1.5 }}
              color="inherit"
              onClick={hanleAddToCartClick}
            >
              {t('btn-add-to-cart')}
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 0,
                background: 'black',
                '&:hover': { backgroundColor: '#31363F' },
              }}
              onClick={hanleBuyNowClick}
            >
              {t('btn-buy-now')}
            </Button>
            <Box sx={{ mt: 2 }}>
              {/* <Typography sx={{ fontWeight: 'bold' }}>Description</Typography> */}
              {parse(detailedProduct?.description || '')}
            </Box>

        </Grid>
      </Grid>
      {otherProducts.length > 0 && (
        <Box>
          <Typography variant="h5">Other products</Typography>
        </Box>
      )}
    </Container>
  );
}
