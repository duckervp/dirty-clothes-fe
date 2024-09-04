import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { PaymentView } from 'src/sections/payment/view';


// ----------------------------------------------------------------------

export default function PaymentPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('payment')} />

      <PaymentView />
    </>
  );
}
