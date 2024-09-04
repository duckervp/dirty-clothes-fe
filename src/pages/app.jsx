import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('dasboard')} />

      <AppView />
    </>
  );
}
