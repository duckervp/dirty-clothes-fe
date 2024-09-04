import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ProductDetailView } from 'src/sections/product/detail/view';

// ----------------------------------------------------------------------

export default function ProductDetailPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('product-m')} />

      <ProductDetailView />
    </>
  );
}
