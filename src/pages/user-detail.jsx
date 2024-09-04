import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { UserDetailView } from 'src/sections/user/detail/view';

// ----------------------------------------------------------------------

export default function UserDetailPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('user')} />

      <UserDetailView />
    </>
  );
}
