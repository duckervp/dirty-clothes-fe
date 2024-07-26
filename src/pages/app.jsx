import HelmetPro from 'src/layouts/common/helmet';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <HelmetPro page="Dashboard" />

      <AppView />
    </>
  );
}
