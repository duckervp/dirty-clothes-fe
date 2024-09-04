import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('user')} />

      <UserView />
    </>
  );
}
