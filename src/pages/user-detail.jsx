import HelmetPro from 'src/layouts/common/helmet';

import { UserDetailView } from 'src/sections/user-detail/view';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <HelmetPro page="User" />

      <UserDetailView />
    </>
  );
}
