import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('login')} />

      <LoginView />
    </>
  );
}
