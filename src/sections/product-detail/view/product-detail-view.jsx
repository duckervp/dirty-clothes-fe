import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { toListObj } from 'src/utils/array';

import { useGetProductDetailQuery } from 'src/app/api/product/productApiSlice';

import ProductPrice from 'src/components/product/product-price';

function ToggleButtons({ data, itemId, setItemId }) {
  const [id, setId] = useState(itemId);

  useEffect(() => {
    setId(itemId);
  }, [itemId]);

  const handleChange = (event, nextId) => {
    if (nextId !== null) {
      setId(nextId);
      setItemId(nextId);
    }
  };

  return (
    <ToggleButtonGroup orientation="horizontal" value={id} exclusive onChange={handleChange}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.map((item) => (
          <ToggleButton
            key={item.id}
            value={item.id}
            aria-label={item.name}
            style={{
              border: '1px solid rgba(145, 158, 171, 0.2)',
              borderRadius: 0,
              width: 80,
              padding: '5px 8px',
            }}
            sx={{ m: 0.5, fontWeight: 100 }}
          >
            {item.name}
          </ToggleButton>
        ))}
      </Box>
    </ToggleButtonGroup>
  );
}

ToggleButtons.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  itemId: PropTypes.any,
  setItemId: PropTypes.func,
};

const mapSliderImages = (productDetailImages) => {
  if (!productDetailImages) return [];
  return productDetailImages.map((item) => ({
    original: item.imageUrl,
    thumbnail: item.imageUrl,
  }));
};

export default function ProductDetail() {
  const { slug } = useParams();

  const { data: detailedProductData } = useGetProductDetailQuery(slug);

  const [detailedProduct, setDetailedProduct] = useState({});

  const [imageDisplayIndex, setImageDisplayIndex] = useState(0);

  const [selectedColorId, setSelectedColorId] = useState(0);

  const [selectedSize, setSelectedSize] = useState();

  const [otherProducts] = useState([]);

  useEffect(() => {
    if (detailedProductData) {
      const { data } = detailedProductData;
      console.log(data);
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
    console.log('index', index);
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

  const hanleAddToCartClick = () => {

  }

  
  const hanleBuyNowClick = () => {

  }

  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={5}>
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
          <Typography variant="h4" textAlign="center" fontWeight={500} marginBottom={0.5}>
            {detailedProduct?.name}
          </Typography>

          <ProductPrice product={detailedProduct} sx={{ textAlign: 'center', fontWeight: 300, mb: 1 }} />

          <Box marginBottom={1}>
            <ToggleButtons
              data={toListObj(detailedProduct?.images, 'colorId', 'colorName')}
              itemId={selectedColorId}
              setItemId={setSelectedColorId}
            />
          </Box>
          <Box marginBottom={1}>
            <ToggleButtons
              data={toListObj(detailedProduct?.productDetails, 'size', 'size')}
              itemId={selectedSize}
              setItemId={setSelectedSize}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2">
              Inventory: {getSelectedProductDetail()?.inventory}
            </Typography>
            <Typography variant="body2">Sold: {getSelectedProductDetail()?.sold}</Typography>
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: '5px', mb: 1.5 }}
            color="inherit"
            onClick={hanleAddToCartClick}
          >
            ADD TO CART
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '5px',
              background: 'black',
              '&:hover': { backgroundColor: '#31363F' },
            }}
            onClick={hanleBuyNowClick}
          >
            BUY NOW
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
