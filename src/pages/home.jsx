import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('home')} />

      <HomeView type="home" />
    </>
  );
}
