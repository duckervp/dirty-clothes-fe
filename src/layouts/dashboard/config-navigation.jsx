import {
  // ADMIN,
  getUrl,
  USER_MANAGEMENT,
  COLOR_MANAGEMENT,
  ORDER_MANAGEMENT,
  PRODUCT_MANAGEMENT,
  CATEGORY_MANAGEMENT,
} from 'src/routes/route-config';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const iconify = (name) => (
  <Iconify icon={name} sx={{ width: 1, height: 1 }}/>
);

const navConfig = [
  // {
  //   key: 'dashboard',
  //   path: getUrl(ADMIN),
  //   icon: icon('ic_analytics'),
  // },
  {
    key: 'user',
    path: getUrl(USER_MANAGEMENT.INDEX),
    icon: icon('ic_user'),
  },
  {
    key: 'product',
    path: getUrl(PRODUCT_MANAGEMENT.INDEX),
    icon: iconify("eva:cube-fill"),
  },
  {
    key: 'order',
    path: getUrl(ORDER_MANAGEMENT.INDEX),
    icon: iconify("eva:shopping-cart-fill"),
  },
  {
    key: 'color',
    path: getUrl(COLOR_MANAGEMENT.INDEX),
    icon: iconify("eva:color-palette-fill"),
  },
  {
    key: 'category',
    path: getUrl(CATEGORY_MANAGEMENT.INDEX),
    icon: iconify("eva:grid-fill"),
  },
];

export default navConfig;
