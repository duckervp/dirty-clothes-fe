import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function ShopPage() {
  return (
    <>
      <HelmetPro page="Shop" />

      <HomeView type="shop" />
    </>
  );
}
