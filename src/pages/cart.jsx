import { Helmet } from 'react-helmet-async';

import CartView from 'src/sections/cart/view/cart-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dirty Clothes </title>
      </Helmet>

      <CartView />
    </>
  );
}
