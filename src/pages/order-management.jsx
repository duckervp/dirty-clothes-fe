import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { OrderView } from 'src/sections/order-management/view';

// ----------------------------------------------------------------------

export default function OrderManagementPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('order-m')} />

      <OrderView />
    </>
  );
}
