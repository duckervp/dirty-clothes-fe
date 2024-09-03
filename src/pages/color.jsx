import HelmetPro from 'src/layouts/common/helmet';

import { ColorView } from 'src/sections/color/view';

// ----------------------------------------------------------------------

export default function ColorPage() {
  return (
    <>
      <HelmetPro page="Color" />

      <ColorView />
    </>
  );
}
