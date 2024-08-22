import HelmetPro from 'src/layouts/common/helmet';

import { ProductDetailView } from 'src/sections/product-detail/view';

// ----------------------------------------------------------------------

export default function ProductDetailPage() {
  return (
    <>
      <HelmetPro page="Product" />

      <ProductDetailView />
    </>
  );
}
