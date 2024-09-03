import HelmetPro from 'src/layouts/common/helmet';

import { OrderView } from 'src/sections/order-management/view';

// ----------------------------------------------------------------------

export default function OrderManagementPage() {
  return (
    <>
      <HelmetPro page="Order" />

      <OrderView />
    </>
  );
}
