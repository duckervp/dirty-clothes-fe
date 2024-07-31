import HelmetPro from 'src/layouts/common/helmet';

import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderPage() {
  return (
    <>
      <HelmetPro page="Order" />

      <OrderView />
    </>
  );
}
