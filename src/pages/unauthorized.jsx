import HelmetPro from 'src/layouts/common/helmet';

import { UnauthorizedView } from 'src/sections/unauthorize';

// ----------------------------------------------------------------------

export default function UnauthorizedPage() {
  return (
    <>
      <HelmetPro page="Unauthorized" />

      <UnauthorizedView />
    </>
  );
}
