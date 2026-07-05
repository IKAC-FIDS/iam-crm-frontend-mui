import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';  // لایه‌بندی جدید داشبورد
import AuthLayout from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';  // صفحه‌ی واقعی داشبورد
import CompaniesPage from '@/features/companies/pages/CompaniesPage';
import CompanyDetailsPage from '@/features/companies/pages/CompanyDetailsPage';
import PipelinePage from '@/features/pipeline/pages/PipelinePage';
import FollowUpsPage from '@/features/followUps/pages/FollowUpsPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'companies', element: <CompaniesPage /> },
          { path: 'companies/:companyId', element: <CompanyDetailsPage /> },
          { path: 'pipeline', element: <PipelinePage /> },
          { path: 'follow-ups', element: <FollowUpsPage /> },
          { path: 'reports', element: <ReportsPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
]);
