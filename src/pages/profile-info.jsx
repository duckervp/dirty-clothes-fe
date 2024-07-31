import HelmetPro from 'src/layouts/common/helmet';

import { ProfileInfoView } from 'src/sections/profile-info/view';

// ----------------------------------------------------------------------

export default function ProfileInfoPage() {
  return (
    <>
      <HelmetPro page="Profile Info" />

      <ProfileInfoView />
    </>
  );
}
