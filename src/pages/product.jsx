import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('product-m')} />

      <ProductView />
    </>
  );
}
