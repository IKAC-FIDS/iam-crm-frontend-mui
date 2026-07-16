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
import AuditLogsPage from '@/features/auditLogs/pages/AuditLogsPage';
import AccountSecurityPage from '@/features/accountSecurity/pages/AccountSecurityPage';
import OpportunitiesPage from '@/features/opportunities/pages/OpportunitiesPage';
import OpportunityDetailsPage from '@/features/opportunities/pages/OpportunityDetailsPage';
import TasksPage from '@/features/tasks/pages/TasksPage';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import AdminOrganizationsPage from '@/features/organizations/pages/AdminOrganizationsPage';
import SsoCallbackPage from '@/features/sso/pages/SsoCallbackPage';
import AdminSsoProvidersPage from '@/features/sso/pages/AdminSsoProvidersPage';
import AdminTeamsPage from '@/features/teams/pages/AdminTeamsPage';
import RouteErrorPage from './RouteErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'companies', element: <CompaniesPage /> },
          { path: 'companies/:companyId', element: <CompanyDetailsPage /> },
          { path: 'people', element: <PeopleDirectoryPage /> },
          { path: 'opportunities', element: <OpportunitiesPage /> },
          { path: 'opportunities/:opportunityId', element: <OpportunityDetailsPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'pipeline', element: <PipelinePage /> },
          { path: 'follow-ups', element: <FollowUpsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'account/security', element: <AccountSecurityPage /> },
          { path: 'admin/users', element: <AdminUsersPage /> },
          { path: 'admin/teams', element: <AdminTeamsPage /> },
          { path: 'admin/organizations', element: <AdminOrganizationsPage /> },
          { path: 'admin/sso-providers', element: <AdminSsoProvidersPage /> },
          { path: 'admin/permissions', element: <AdminPermissionsPage /> },
          { path: 'admin/libraries', element: <AdminLibrariesPage /> },
          { path: 'admin/pipeline', element: <AdminPipelinePage /> },
          { path: 'admin/audit-logs', element: <AuditLogsPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/auth/sso/callback',
    element: <SsoCallbackPage />,
    errorElement: <RouteErrorPage />,
  },
]);
