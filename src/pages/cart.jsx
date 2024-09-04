import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import CartView from 'src/sections/cart/view/cart-view';

// ----------------------------------------------------------------------

export default function CartPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('cart')} />

      <CartView />
    </>
  );
}
