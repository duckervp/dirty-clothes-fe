import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <HelmetPro page="Home" />

      <HomeView />
    </>
  );
}
