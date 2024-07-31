import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import HomepageLayout from 'src/layouts/homepage';
import DashboardLayout from 'src/layouts/dashboard';

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
        { path: '/cart', element: <HomepageLayout><CartPage /></HomepageLayout>},
        { path: '/order-history', element: <HomepageLayout><OrderPage /></HomepageLayout>},
        { path: '/payment', element: <PaymentPage />},
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
