import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    key: 'basic-info',
    path: '/profile',
    icon: icon('ic_user'),
  },
  {
    key: 'order',
    path: '/order',
    icon: icon('ic_cart'),
  },
  {
    key: 'address',
    path: '/address',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
