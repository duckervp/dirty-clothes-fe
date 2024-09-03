import HelmetPro from 'src/layouts/common/helmet';

import { ProfileAddressView } from 'src/sections/profile/address/view';

// ----------------------------------------------------------------------

export default function ProfileAddressPage() {
  return (
    <>
      <HelmetPro page="Profile" />

      <ProfileAddressView />
    </>
  );
}
