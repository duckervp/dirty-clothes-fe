import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { Role } from 'src/config';
import ProfileLayout from 'src/layouts/profile';
import HomepageLayout from 'src/layouts/homepage';
import DashboardLayout from 'src/layouts/dashboard';

import Loading from 'src/components/auth/Loading';
import RequireAuth from 'src/components/auth/RequireAuth';

import ScrollToAnchor from './scroll-to-anchor';
import {
  AUTH,
  CART,
  SHOP,
  ADMIN,
  ORDER,
  CONTACT,
  ADDRESS,
  PAYMENT,
  PROFILE,
  BEST_SELLER,
  absolutePath,
  SHOP_CATEGORY,
  PRODUCT_DETAIL,
  USER_MANAGEMENT,
  ORDER_MANAGEMENT,
  COLOR_MANAGEMENT,
  PRODUCT_MANAGEMENT,
  CATEGORY_MANAGEMENT,
} from './route-config';

export const HomePage = lazy(() => import('src/pages/home'));
export const ShopPage = lazy(() => import('src/pages/shop'));
export const BestSellerPage = lazy(() => import('src/pages/best-seller'));
export const CartPage = lazy(() => import('src/pages/cart'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const PaymentPage = lazy(() => import('src/pages/payment'));
export const ProductInfoPage = lazy(() => import('src/pages/product-info'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UserDetailPage = lazy(() => import('src/pages/user-detail'));
export const CategoryPage = lazy(() => import('src/pages/category'));
export const CategoryDetailPage = lazy(() => import('src/pages/category-detail'));
export const ColorPage = lazy(() => import('src/pages/color'));
export const ColorDetailPage = lazy(() => import('src/pages/color-detail'));
export const OrderManagementPage = lazy(() => import('src/pages/order-management'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductPage = lazy(() => import('src/pages/product'));
export const ProductDetailPage = lazy(() => import('src/pages/product-detail'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UnauthorizedPage = lazy(() => import('src/pages/unauthorized'));
export const ProfileInfoPage = lazy(() => import('src/pages/profile-info'));
export const ProfileAddressPage = lazy(() => import('src/pages/profile-address'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <Suspense fallback={<Loading fullScreen/>}>
          <ScrollToAnchor />
          <Outlet />
        </Suspense>
      ),
      children: [
        { element: <HomepageLayout><HomePage /></HomepageLayout>, index: true },
        {
          path: SHOP,
          element: <HomepageLayout><ShopPage /></HomepageLayout>,
          children: [
            { path: SHOP_CATEGORY, element: <HomepageLayout><ShopPage /></HomepageLayout> },
          ]
        },
        { path: BEST_SELLER, element: <HomepageLayout><BestSellerPage /></HomepageLayout> },
        { path: CONTACT, element: <HomepageLayout>Empty Page</HomepageLayout> },
        { path: CART, element: <HomepageLayout><CartPage /></HomepageLayout> },
        { path: PRODUCT_DETAIL, element: <HomepageLayout><ProductInfoPage /></HomepageLayout> },
      ],
    },
    {
      element: (
        <Suspense fallback={<Loading fullScreen/>}>
          <RequireAuth />
        </Suspense>
      ),
      children: [
        { path: ORDER, element: <ProfileLayout><OrderPage /></ProfileLayout> },
        { path: PAYMENT, element: <PaymentPage /> },
        { path: PROFILE, element: <ProfileLayout><ProfileInfoPage /></ProfileLayout> },
        { path: ADDRESS, element: <ProfileLayout><ProfileAddressPage /></ProfileLayout> },
      ],
    },
    {
      element: (
        <Suspense fallback={<Loading fullScreen/>}>
          <RequireAuth allowedRole={Role.ADMIN} />
        </Suspense>
      ),
      children: [
        // { path: ADMIN, element: <DashboardLayout><IndexPage /></DashboardLayout> },
        { path: ADMIN, element: <Navigate to={absolutePath(USER_MANAGEMENT.INDEX)} /> },
        // USER
        { path: USER_MANAGEMENT.INDEX, element: <DashboardLayout><UserPage /></DashboardLayout> },
        { path: USER_MANAGEMENT.DETAILS, element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        { path: USER_MANAGEMENT.CREATE, element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        { path: USER_MANAGEMENT.EDIT, element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        // PRODUCT
        { path: PRODUCT_MANAGEMENT.INDEX, element: <DashboardLayout><ProductPage /></DashboardLayout> },
        { path: PRODUCT_MANAGEMENT.DETAILS, element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        { path: PRODUCT_MANAGEMENT.CREATE, element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        { path: PRODUCT_MANAGEMENT.EDIT, element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        // CATEGORY
        { path: CATEGORY_MANAGEMENT.INDEX, element: <DashboardLayout><CategoryPage /></DashboardLayout> },
        { path: CATEGORY_MANAGEMENT.DETAILS, element: <DashboardLayout><CategoryDetailPage /></DashboardLayout> },
        { path: CATEGORY_MANAGEMENT.CREATE, element: <DashboardLayout><CategoryDetailPage /></DashboardLayout> },
        { path: CATEGORY_MANAGEMENT.EDIT, element: <DashboardLayout><CategoryDetailPage /></DashboardLayout> },
        // COLOR
        { path: COLOR_MANAGEMENT.INDEX, element: <DashboardLayout><ColorPage /></DashboardLayout> },
        { path: COLOR_MANAGEMENT.DETAILS, element: <DashboardLayout><ColorDetailPage /></DashboardLayout> },
        { path: COLOR_MANAGEMENT.CREATE, element: <DashboardLayout><ColorDetailPage /></DashboardLayout> },
        { path: COLOR_MANAGEMENT.EDIT, element: <DashboardLayout><ColorDetailPage /></DashboardLayout> },
        // ORDER
        { path: ORDER_MANAGEMENT.INDEX, element: <DashboardLayout><OrderManagementPage /></DashboardLayout> },
      ],
    },
    {
      path: AUTH.LOGIN,
      element: <LoginPage />,
    },
    {
      path: AUTH.REGISTER,
      element: <RegisterPage />,
    },
    {
      path: AUTH.UNAUTHORIZED,
      element: <UnauthorizedPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
