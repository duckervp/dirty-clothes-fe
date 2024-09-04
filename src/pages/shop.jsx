import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function ShopPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('shop')} />

      <HomeView type="shop" />
    </>
  );
}
