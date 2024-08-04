import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function BetSellerPage() {
  return (
    <>
      <HelmetPro page="Best Seller" />

      <HomeView type="best-seller" />
    </>
  );
}
