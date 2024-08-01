import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { Role } from 'src/config';
import ProfileLayout from 'src/layouts/profile';
import HomepageLayout from 'src/layouts/homepage';
import DashboardLayout from 'src/layouts/dashboard';

import RequireAuth from 'src/components/auth/RequireAuth';
import PersistedLogin from 'src/components/auth/PersistedLogin';

export const HomePage = lazy(() => import('src/pages/home'));
export const CartPage = lazy(() => import('src/pages/cart'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const PaymentPage = lazy(() => import('src/pages/payment'));
export const ProductDetailPage = lazy(() => import('src/pages/product-detail'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
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
            <Outlet />
          </Suspense>
      ),
      children: [
        { element: <HomepageLayout><HomePage /></HomepageLayout>, index: true },
        { path: ':slug', element: <HomepageLayout><ProductDetailPage /></HomepageLayout>},
        { path: 'cart', element: <HomepageLayout><CartPage /></HomepageLayout>},
      ],
    },
    {
      element: (
        <Suspense>
          <PersistedLogin>
            <RequireAuth />
          </PersistedLogin>
        </Suspense>
      ),
      children: [
        { path: 'order-history', element: <ProfileLayout><OrderPage /></ProfileLayout> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'profile', element: <ProfileLayout><ProfileInfoPage /></ProfileLayout> },
        { path: 'profile/address', element: <ProfileLayout><ProfileAddressPage/></ProfileLayout> },
      ],
    },
    {
      element: (
        <Suspense>
          <PersistedLogin>
            <RequireAuth allowedRole={Role.ADMIN} />
          </PersistedLogin>
        </Suspense>
      ),
      children: [
        { path: 'admin', element: <DashboardLayout><IndexPage /></DashboardLayout> },
        { path: 'admin/user', element: <DashboardLayout><UserPage /></DashboardLayout> },
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
