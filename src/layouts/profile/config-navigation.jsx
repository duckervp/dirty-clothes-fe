import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Basic Info',
    path: '/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'Order',
    path: '/order-history',
    icon: icon('ic_cart'),
  },
  {
    title: 'Address',
    path: '/profile/address',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
