import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { PAGE_SIZE } from 'src/config';
import { useGetAllProductsQuery } from 'src/app/api/product/productApiSlice';

import Loading from 'src/components/auth/Loading';
import LazyLoadBanner from 'src/components/product/banner';
import ProductCard from 'src/components/product/product-card';
import ProductSort from 'src/components/product/product-sort';
import PageDisplay from 'src/components/pagination/PageDisplay';
import ProductFilters from 'src/components/product/product-filters';
import ProductNoData from 'src/components/product/product-not-found';

// ----------------------------------------------------------------------

export default function HomeView({ type }) {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });

  const [params] = useSearchParams();

  const { category } = useParams();

  const [openFilter, setOpenFilter] = useState(false);

  const page = params.get('page') || 1;

  const [products, setProducts] = useState([]);

  const [totalPage, setTotalPage] = useState(0);

  const [sort, setSort] = useState({
    value: 'newest',
    label: 'Newest',
    sort: 'desc',
    sortBy: 'createdAt',
  });

  const [filter, setFilter] = useState({
    name: '',
    priceFrom: null,
    priceTo: null,
    targets: [],
    categoryIds: [],
    colorIds: [],
    sizes: [],
  });

  const getParam = () => {
    const param = {
      pageNo: page - 1,
      pageSize: PAGE_SIZE,
      sort: sort.sort,
      sortBy: sort.sortBy,
      bestSeller: type === 'best-seller' ? true : null,
      name: params.get('q') ? params.get('q') : null,
      categoryValue: category,
      priceFrom: filter.priceFrom,
      priceTo: filter.priceTo,
      targets: filter.targets.length > 0 ? filter.targets : null,
      sizes: filter.sizes.length > 0 ? filter.sizes : null,
      colorIds: filter.colorIds.length > 0 ? filter.colorIds : null,
    };

    Object.keys(param).forEach((key) => {
      if (!param[key]) {
        delete param[key];
      }
    });

    return param;
  };

  const { data: productData, isLoading } = useGetAllProductsQuery(getParam());

  useEffect(() => {
    if (productData) {
      const { content, totalPages } = productData.data;
      setProducts(content);
      setTotalPage(totalPages);
    }
  }, [productData]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      {type === 'home' && <LazyLoadBanner />}

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent={
          type === 'home'
            ? 'space-between'
            : 'flex-end'
        }
        sx={{ mt: 3, mb: 2 }}
      >
        {type === 'home' && <Typography variant="subtitle1" fontWeight="bold">{t('products')}</Typography>}

        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          sx={type === 'shop' || type === 'best-seller' ? { my: 1 } : { display: 'none' }}
        >
          <ProductSort selectedOption={sort} setSelectedOption={setSort} />

          <ProductFilters
            filter={filter}
            setFilter={setFilter}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
        </Stack>
      </Stack>

      {!isLoading && productData.data.totalPages === 0 && (type === 'shop' || type === 'best-seller') && (
        <Stack alignItems="center" justifyContent="center">
          <ProductNoData query={category ? type.concat(" ").concat(category) : type} />
        </Stack>
      )}

      {
        isLoading ?
          <Loading />
          :
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
      }

      <PageDisplay totalPage={totalPage} page={page} />
    </Container>
  );
}

HomeView.propTypes = {
  type: PropTypes.oneOf(['home', 'shop', 'best-seller']),
};
