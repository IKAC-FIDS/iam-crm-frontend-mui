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
import AdminUsersPage from '@/features/admin/users/components/AdminUsersPage';
import AdminPermissionsPage from '@/features/admin/permissions/components/AdminPermissionsPage';
import AdminLibrariesPage from '@/features/catalogs/pages/AdminLibrariesPage';
import AdminPipelinePage from '@/features/pipelineConfig/pages/AdminPipelinePage';
import PeopleDirectoryPage from '@/features/people/pages/PeopleDirectoryPage';

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
          { path: 'people', element: <PeopleDirectoryPage /> },
          { path: 'pipeline', element: <PipelinePage /> },
          { path: 'follow-ups', element: <FollowUpsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'admin/users', element: <AdminUsersPage /> },
          { path: 'admin/permissions', element: <AdminPermissionsPage /> },
          { path: 'admin/libraries', element: <AdminLibrariesPage /> },
          { path: 'admin/pipeline', element: <AdminPipelinePage /> },
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
