import HelmetPro from 'src/layouts/common/helmet';

import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <HelmetPro page="Products" />

      <ProductsView />
    </>
  );
}
