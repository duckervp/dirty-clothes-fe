import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { Role } from 'src/config';
import ProfileLayout from 'src/layouts/profile';
import HomepageLayout from 'src/layouts/homepage';
import DashboardLayout from 'src/layouts/dashboard';

import RequireAuth from 'src/components/auth/RequireAuth';

import ScrollToAnchor from './scroll-to-anchor';

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
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
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
        <Suspense>
          <ScrollToAnchor />
          <Outlet />
        </Suspense>
      ),
      children: [
        { element: <HomepageLayout><HomePage /></HomepageLayout>, index: true },
        {
          path: 'shop',
          element: <HomepageLayout><ShopPage /></HomepageLayout>,
          children: [
            { path: ":category", element: <HomepageLayout><ShopPage /></HomepageLayout> },
          ]
        },
        { path: 'best-seller', element: <HomepageLayout><BestSellerPage /></HomepageLayout> },
        { path: 'contact', element: <HomepageLayout>Empty Page</HomepageLayout> },
        { path: 'cart', element: <HomepageLayout><CartPage /></HomepageLayout> },
        { path: ':slug', element: <HomepageLayout><ProductInfoPage /></HomepageLayout> },
      ],
    },
    {
      element: (
        <Suspense>
          <RequireAuth />
        </Suspense>
      ),
      children: [
        { path: 'order', element: <ProfileLayout><OrderPage /></ProfileLayout> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'profile', element: <ProfileLayout><ProfileInfoPage /></ProfileLayout> },
        { path: 'address', element: <ProfileLayout><ProfileAddressPage /></ProfileLayout> },
      ],
    },
    {
      element: (
        <Suspense>
          <RequireAuth allowedRole={Role.ADMIN} />
        </Suspense>
      ),
      children: [
        { path: 'admin', element: <DashboardLayout><IndexPage /></DashboardLayout> },
        { path: 'admin/user-management', element: <DashboardLayout><UserPage /></DashboardLayout> },
        { path: 'admin/user-management/user-details/:id', element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        { path: 'admin/user-management/create-user', element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        { path: 'admin/user-management/edit-user/:id', element: <DashboardLayout><UserDetailPage /></DashboardLayout> },
        { path: 'admin/product-management', element: <DashboardLayout><ProductsPage /></DashboardLayout> },
        { path: 'admin/product-management/product-details/:id', element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        { path: 'admin/product-management/create-product', element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        { path: 'admin/product-management/edit-product/:id', element: <DashboardLayout><ProductDetailPage /></DashboardLayout> },
        { path: 'admin/products', element: <DashboardLayout><ProductsPage /></DashboardLayout> },
        { path: 'admin/blog', element: <DashboardLayout><BlogPage /></DashboardLayout> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'unauthorized',
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
