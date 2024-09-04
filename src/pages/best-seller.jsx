import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function BetSellerPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('best-seller')} />

      <HomeView type="best-seller" />
    </>
  );
}
