import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { RegisterView } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('register')} />

      <RegisterView />
    </>
  );
}
