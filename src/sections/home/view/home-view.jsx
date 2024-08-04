import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { PAGE_SIZE } from 'src/config';
import { useGetAllProductsQuery } from 'src/app/api/product/productApiSlice';

import LazyLoadBanner from 'src/components/product/banner';
import ProductCard from 'src/components/product/product-card';
import ProductSort from 'src/components/product/product-sort';
import ProductFilters from 'src/components/product/product-filters';

// ----------------------------------------------------------------------

export default function HomeView({ type }) {
  const [params] = useSearchParams();

  const { category } = useParams();

  const [openFilter, setOpenFilter] = useState(false);

  const page = params.get('page') || 1;

  const [products, setProducts] = useState([]);

  const [totalPage, setTotalPage] = useState(10);

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

  const { data: productData } = useGetAllProductsQuery(getParam());

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
          type === 'home' || (products.length === 0 && (type === 'shop' || type === 'best-seller'))
            ? 'space-between'
            : 'flex-end'
        }
        sx={{ mt: 3, mb: 2 }}
      >
        {type === 'home' && <Typography variant="subtitle2">ALL PRODUCTS</Typography>}
        {products.length === 0 && (type === 'shop' || type === 'best-seller') && (
          <Typography variant="body1">No product found.</Typography>
        )}

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

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {totalPage > 1 && (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap-reverse"
          justifyContent="flex-end"
          sx={{ mt: 3, mb: 2 }}
        >
          <Pagination
            page={parseInt(page, 10)}
            count={totalPage}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </Container>
  );
}

HomeView.propTypes = {
  type: PropTypes.oneOf(['home', 'shop', 'best-seller']),
};
