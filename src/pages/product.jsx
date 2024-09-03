import HelmetPro from 'src/layouts/common/helmet';

import { ProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductPage() {
  return (
    <>
      <HelmetPro page="Products" />

      <ProductView />
    </>
  );
}
