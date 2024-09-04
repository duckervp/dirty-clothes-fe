import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ProfileInfoView } from 'src/sections/profile/info/view';

// ----------------------------------------------------------------------

export default function ProfileInfoPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('profile')} />

      <ProfileInfoView />
    </>
  );
}
