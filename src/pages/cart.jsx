import HelmetPro from 'src/layouts/common/helmet';

import CartView from 'src/sections/cart/view/cart-view';

// ----------------------------------------------------------------------

export default function CartPage() {
  return (
    <>
      <HelmetPro page="Cart" />

      <CartView />
    </>
  );
}
