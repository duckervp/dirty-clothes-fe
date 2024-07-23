import { Helmet } from 'react-helmet-async';

import { ProductDetailView } from 'src/sections/product-detail/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dirty Clothes </title>
      </Helmet>

      <ProductDetailView />
    </>
  );
}
