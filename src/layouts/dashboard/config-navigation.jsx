import {
  // ADMIN,
  absolutePath,
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
  //   title: 'dashboard',
  //   path: absolutePath(ADMIN),
  //   icon: icon('ic_analytics'),
  // },
  {
    title: 'user',
    path: absolutePath(USER_MANAGEMENT.INDEX),
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: absolutePath(PRODUCT_MANAGEMENT.INDEX),
    icon: iconify("eva:cube-fill"),
  },
  {
    title: 'order',
    path: absolutePath(ORDER_MANAGEMENT.INDEX),
    icon: iconify("eva:shopping-cart-fill"),
  },
  {
    title: 'color',
    path: absolutePath(COLOR_MANAGEMENT.INDEX),
    icon: iconify("eva:color-palette-fill"),
  },
  {
    title: 'category',
    path: absolutePath(CATEGORY_MANAGEMENT.INDEX),
    icon: iconify("eva:grid-fill"),
  },
];

export default navConfig;
