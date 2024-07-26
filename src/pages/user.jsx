import HelmetPro from 'src/layouts/common/helmet';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <HelmetPro page="User" />

      <UserView />
    </>
  );
}
