import HelmetPro from 'src/layouts/common/helmet';

import { ProductInfoView } from 'src/sections/product-info/view';

// ----------------------------------------------------------------------

export default function ProductInfoPage() {
  return (
    <>
      <HelmetPro page="PreOrder" />

      <ProductInfoView />
    </>
  );
}
