import {
  ORDER,
  getUrl,
  ADDRESS,
  PROFILE,
  HOME_INDEX,
} from 'src/routes/route-config';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

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
    key: 'basic-info',
    path: getUrl(PROFILE),
    icon: icon('ic_user'),
  },
  {
    key: 'order',
    path: getUrl(ORDER),
    icon: iconify('eva:shopping-bag-fill'),
  },
  {
    key: 'address',
    path: getUrl(ADDRESS),
    icon: iconify('eva:map-fill'),
  },
];

export default navConfig;
