import HelmetPro from 'src/layouts/common/helmet';

import { PaymentView } from 'src/sections/payment/view';


// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <HelmetPro page="Payment" />

      <PaymentView />
    </>
  );
}
