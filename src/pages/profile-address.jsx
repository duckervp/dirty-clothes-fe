import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ProfileAddressView } from 'src/sections/profile/address/view';

// ----------------------------------------------------------------------

export default function ProfileAddressPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('address')} />

      <ProfileAddressView />
    </>
  );
}
