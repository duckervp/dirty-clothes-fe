import {
  SHOP,
  CART,
  getUrl,
  // CONTACT,
  HOME_INDEX,
  BEST_SELLER,
} from 'src/routes/route-config';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const iconify = (name) => (
  <Iconify icon={name} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    key: 'home',
    path: HOME_INDEX,
    icon: iconify('eva:home-fill'),
  },
  {
    key: 'shop',
    path: getUrl(SHOP),
    icon: iconify('eva:grid-fill'),
  },
  {
    key: 'best-seller',
    path: getUrl(BEST_SELLER),
    icon: iconify('eva:flash-fill'),
  },
  {
    key: 'cart',
    path: getUrl(CART),
    icon: iconify('eva:shopping-cart-fill'),
  },
  // {
  //   key: 'contact',
  //   path: CONTACT,
  //   icon: iconify('eva:info-fill'),
  // },
];

export default navConfig;
