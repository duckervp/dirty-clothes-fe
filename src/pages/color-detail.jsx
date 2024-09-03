import HelmetPro from 'src/layouts/common/helmet';

import { ColorDetailView } from 'src/sections/color/detail/view';

// ----------------------------------------------------------------------

export default function CololDetailPage() {
  return (
    <>
      <HelmetPro page="Color" />

      <ColorDetailView />
    </>
  );
}
