import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ProductInfoView } from 'src/sections/home/detail/view';

// ----------------------------------------------------------------------

export default function ProductInfoPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('product')} />

      <ProductInfoView />
    </>
  );
}
