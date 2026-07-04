import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../layouts/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

// Lazily imported pages or standard imports (we'll use standard imports for dashboard clarity)
import LoginPage from '../pages/auth/LoginPage';
import OverviewPage from '../pages/overview/OverviewPage';
import ProductsPage from '../pages/products/ProductsPage';
import ProductDetailsPage from '../pages/products/ProductDetailsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import CustomersPage from '../pages/customers/CustomersPage';
import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';

export const router = createBrowserRouter([
  {path: '/', element: <Navigate to="/admin/overview" replace />,},
  {path: '/login',element: <LoginPage />,},
  {path: '/admin',element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="overview" replace />,
          },
          {
            path: 'overview',
            element: <OverviewPage />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
          {
            path: 'products/:id',
            element: <ProductDetailsPage />,
          },
          {
            path: 'products/new',
            element: <ProductDetailsPage />,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'customers',
            element: <CustomersPage />,
          },
          {
            path: 'customers/:id',
            element: <CustomerDetailsPage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {path: '*', element: <Navigate to="/admin/overview" replace />,},
]);

export default router;
