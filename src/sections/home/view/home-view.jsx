import { useState } from 'react';
import { Link } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { products } from 'src/_mock/products';

import LazyLoadBanner from '../banner';
import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';

// ----------------------------------------------------------------------

export default function HomeView() {
  const [openFilter, setOpenFilter] = useState(false);

  const [page] = useState(1);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      {/* <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography> */}

      <LazyLoadBanner />

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mt: 3, mb: 2 }}
      >
        <Typography variant="subtitle2">ALL PRODUCTS</Typography>

        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mt: 3, mb: 2 }}
      >
        <Pagination
          page={page}
          count={10}
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
    </Container>
  );
}
