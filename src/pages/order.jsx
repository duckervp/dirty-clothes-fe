import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('order')} />

      <OrderView />
    </>
  );
}
