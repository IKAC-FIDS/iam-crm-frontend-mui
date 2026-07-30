import { lazy } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import KeyIcon from '@mui/icons-material/Key';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkIcon from '@mui/icons-material/Work';
import type { AppRouteDefinition, ResolvedAppRoute } from './routeRegistry.types';
import { isRoutePolicyValid } from './routeAccess';

const publicAccess = { type: 'public' } as const;
const authenticatedAccess = { type: 'authenticated' } as const;
const any = (permissions: readonly string[], fallbackRoles: readonly string[] = []) =>
  ({ type: 'permissions', mode: 'any', permissions, fallbackRoles }) as const;

const salesGroup = 'عملیات فروش';
const adminGroup = 'مدیریت';
const accountGroup = 'حساب';

export const routeRegistry: readonly AppRouteDefinition[] = [
  { id: 'app', path: '/', access: authenticatedAccess, load: () => import('@/layouts/DashboardLayout'), breadcrumb: { label: 'خانه', include: false } },
  { id: 'dashboard-index', parentId: 'app', index: true, access: authenticatedAccess, load: () => import('@/features/dashboard/pages/DashboardPage') },
  { id: 'dashboard', parentId: 'app', path: 'dashboard', access: authenticatedAccess, load: () => import('@/features/dashboard/pages/DashboardPage'), menu: { label: 'داشبورد', group: salesGroup, order: 10, icon: DashboardIcon }, breadcrumb: { label: 'داشبورد' }, title: 'داشبورد' },

  { id: 'companies', parentId: 'app', path: 'companies', access: authenticatedAccess, menu: { label: 'شرکت‌ها', group: salesGroup, order: 20, icon: BusinessIcon }, breadcrumb: { label: 'شرکت‌ها' } },
  { id: 'companies-index', parentId: 'companies', index: true, access: authenticatedAccess, load: () => import('@/features/companies/pages/CompaniesPage') },
  { id: 'company-details', parentId: 'companies', path: ':companyId', access: authenticatedAccess, load: () => import('@/features/companies/pages/CompanyDetailsPage'), breadcrumb: { label: 'جزئیات شرکت' }, title: 'جزئیات شرکت' },

  { id: 'people', parentId: 'app', path: 'people', access: any(['people:directory:view']), load: () => import('@/features/people/pages/PeopleDirectoryPage'), menu: { label: 'افراد', group: salesGroup, order: 90, icon: PeopleIcon }, breadcrumb: { label: 'افراد' } },
  { id: 'activities', parentId: 'app', path: 'activities', access: any(['activity:view'], ['ADMIN', 'MANAGER', 'REP']), load: () => import('@/features/activities/pages/ActivitiesPage'), menu: { label: 'فعالیت‌ها', group: salesGroup, order: 100, icon: HistoryIcon }, breadcrumb: { label: 'فعالیت‌ها' } },

  { id: 'opportunities', parentId: 'app', path: 'opportunities', access: any(['opportunity:view'], ['ADMIN', 'MANAGER', 'REP', 'BOARDS']), menu: { label: 'فرصت‌ها', group: salesGroup, order: 30, icon: WorkIcon }, breadcrumb: { label: 'فرصت‌ها' } },
  { id: 'opportunities-index', parentId: 'opportunities', index: true, access: any(['opportunity:view'], ['ADMIN', 'MANAGER', 'REP', 'BOARDS']), load: () => import('@/features/opportunities/pages/OpportunitiesPage') },
  { id: 'opportunity-details', parentId: 'opportunities', path: ':opportunityId', access: any(['opportunity:view'], ['ADMIN', 'MANAGER', 'REP', 'BOARDS']), load: () => import('@/features/opportunities/pages/OpportunityDetailsPage'), breadcrumb: { label: 'جزئیات فرصت' } },

  { id: 'pipeline', parentId: 'app', path: 'pipeline', access: authenticatedAccess, load: () => import('@/features/pipeline/pages/PipelinePage'), menu: { label: 'پایپ‌لاین', group: salesGroup, order: 40, icon: ViewKanbanIcon }, breadcrumb: { label: 'پایپ‌لاین' } },
  { id: 'tasks', parentId: 'app', path: 'tasks', access: any(['task:view'], ['ADMIN', 'MANAGER', 'REP', 'BOARDS']), load: () => import('@/features/tasks/pages/TasksPage'), menu: { label: 'کارها', group: salesGroup, order: 50, icon: AssignmentIcon }, breadcrumb: { label: 'کارها' } },

  { id: 'meetings', parentId: 'app', path: 'meetings', access: any(['meeting:view']), menu: { label: 'جلسات', group: salesGroup, order: 60, icon: EventIcon }, breadcrumb: { label: 'جلسات' } },
  { id: 'meetings-index', parentId: 'meetings', index: true, access: any(['meeting:view']), load: () => import('@/features/meetings/pages/MeetingsPage') },
  { id: 'meeting-details', parentId: 'meetings', path: ':meetingId', access: any(['meeting:view']), load: () => import('@/features/meetings/pages/MeetingDetailsPage'), breadcrumb: { label: 'جزئیات جلسه' } },

  { id: 'follow-ups', parentId: 'app', path: 'follow-ups', access: authenticatedAccess, load: () => import('@/features/followUps/pages/FollowUpsPage'), menu: { label: 'پیگیری‌ها', group: salesGroup, order: 70, icon: NotificationsActiveIcon }, breadcrumb: { label: 'پیگیری‌ها' } },
  { id: 'notifications', parentId: 'app', path: 'notifications', access: any(['notification:view'], ['ADMIN']), load: () => import('@/features/notifications/pages/NotificationsPage'), menu: { label: 'اعلان‌ها', group: salesGroup, order: 80, icon: NotificationsIcon }, breadcrumb: { label: 'اعلان‌ها' } },
  { id: 'reports', parentId: 'app', path: 'reports', access: any(['report:view'], ['ADMIN', 'MANAGER', 'BOARDS']), load: () => import('@/features/reports/pages/ReportsPage'), menu: { label: 'گزارش‌ها', group: salesGroup, order: 110, icon: AssessmentIcon }, breadcrumb: { label: 'گزارش‌ها' } },

  { id: 'admin', parentId: 'app', path: 'admin', access: authenticatedAccess, breadcrumb: { label: 'مدیریت' } },
  { id: 'admin-users', parentId: 'admin', path: 'users', access: any(['user:manage'], ['ADMIN']), load: () => import('@/features/admin/users/components/AdminUsersPage'), menu: { label: 'کاربران', group: adminGroup, order: 210, icon: PeopleIcon }, breadcrumb: { label: 'کاربران' } },
  { id: 'admin-teams', parentId: 'admin', path: 'teams', access: any(['team:view', 'team:manage'], ['ADMIN']), load: () => import('@/features/teams/pages/AdminTeamsPage'), menu: { label: 'تیم‌ها', group: adminGroup, order: 220, icon: GroupsIcon }, breadcrumb: { label: 'تیم‌ها' } },
  { id: 'admin-exchange-rates', parentId: 'admin', path: 'exchange-rates', access: any(['exchange-rate:view', 'exchange-rate:manage'], ['ADMIN']), load: () => import('@/features/exchangeRates/pages/ExchangeRatesPage'), menu: { label: 'نرخ دلار', group: adminGroup, order: 230, icon: CurrencyExchangeIcon }, breadcrumb: { label: 'نرخ دلار' } },
  { id: 'admin-organizations', parentId: 'admin', path: 'organizations', access: any(['organization:manage'], ['ADMIN']), load: () => import('@/features/organizations/pages/AdminOrganizationsPage'), menu: { label: 'سازمان‌ها', group: adminGroup, order: 240, icon: CorporateFareIcon }, breadcrumb: { label: 'سازمان‌ها' } },
  { id: 'admin-sso-providers', parentId: 'admin', path: 'sso-providers', access: any(['sso-provider:view', 'sso-provider:manage'], ['ADMIN']), load: () => import('@/features/sso/pages/AdminSsoProvidersPage'), menu: { label: 'ورود سازمانی', group: adminGroup, order: 250, icon: LoginIcon }, breadcrumb: { label: 'ورود سازمانی' } },
  { id: 'admin-permissions', parentId: 'admin', path: 'permissions', access: any(['permission:view', 'permission:manage', 'role:view', 'role:manage'], ['ADMIN']), load: () => import('@/features/admin/permissions/components/AdminPermissionsPage'), menu: { label: 'نقش‌ها و مجوزها', group: adminGroup, order: 260, icon: SecurityIcon }, breadcrumb: { label: 'نقش‌ها و مجوزها' } },
  { id: 'admin-libraries', parentId: 'admin', path: 'libraries', access: any(['library:industry:manage', 'library:pain-point:manage', 'library:use-case:manage', 'library:persona:manage', 'library:lead-source:manage', 'lookup:manage', 'library:university:manage', 'product:view', 'product:manage'], ['ADMIN']), load: () => import('@/features/catalogs/pages/AdminLibrariesPage'), menu: { label: 'کتابخانه‌ها', group: adminGroup, order: 270, icon: LibraryBooksIcon }, breadcrumb: { label: 'کتابخانه‌ها' } },
  { id: 'admin-pipeline', parentId: 'admin', path: 'pipeline', access: any(['pipeline:config:manage', 'pipeline:transition:manage'], ['ADMIN']), load: () => import('@/features/pipelineConfig/pages/AdminPipelinePage'), menu: { label: 'تنظیمات پایپ‌لاین', group: adminGroup, order: 280, icon: ViewKanbanIcon }, breadcrumb: { label: 'تنظیمات پایپ‌لاین' } },
  { id: 'admin-audit-logs', parentId: 'admin', path: 'audit-logs', access: any(['audit-log:view']), load: () => import('@/features/auditLogs/pages/AuditLogsPage'), menu: { label: 'رویدادهای ممیزی', group: adminGroup, order: 290, icon: HistoryIcon }, breadcrumb: { label: 'رویدادهای ممیزی' } },

  { id: 'account', parentId: 'app', path: 'account', access: authenticatedAccess, breadcrumb: { label: 'حساب' } },
  { id: 'account-security', parentId: 'account', path: 'security', access: authenticatedAccess, load: () => import('@/features/accountSecurity/pages/AccountSecurityPage'), menu: { label: 'امنیت حساب', group: accountGroup, order: 310, icon: KeyIcon }, breadcrumb: { label: 'امنیت حساب' } },

  { id: 'login-layout', path: '/login', access: publicAccess, load: () => import('@/layouts/AuthLayout') },
  { id: 'login', parentId: 'login-layout', index: true, access: publicAccess, load: () => import('@/features/auth/pages/LoginPage'), title: 'ورود' },
  { id: 'sso-callback', path: '/auth/sso/callback', access: publicAccess, load: () => import('@/features/sso/pages/SsoCallbackPage') },
  { id: 'forbidden', path: '/forbidden', access: authenticatedAccess, load: () => import('./ForbiddenPage'), title: 'دسترسی غیرمجاز' },
  { id: 'not-found', path: '*', access: publicAccess, load: () => import('./NotFoundPage'), title: 'صفحه پیدا نشد' },
] as const;

function joinPath(parentPath: string, path?: string, index?: boolean): string {
  if (index || !path) return parentPath || '/';
  if (path === '*') return '*';
  if (path.startsWith('/')) return path;
  return `${parentPath === '/' ? '' : parentPath}/${path}`.replace(/\/+/g, '/');
}

export function resolveRouteRegistry(definitions: readonly AppRouteDefinition[] = routeRegistry): readonly ResolvedAppRoute[] {
  const byId = new Map(definitions.map((route) => [route.id, route]));
  const resolving = new Set<string>();
  const resolved = new Map<string, ResolvedAppRoute>();

  const resolve = (route: AppRouteDefinition): ResolvedAppRoute => {
    const cached = resolved.get(route.id);
    if (cached) return cached;
    if (resolving.has(route.id)) throw new Error(`Circular route parent reference: ${route.id}`);
    resolving.add(route.id);
    const parent = route.parentId ? byId.get(route.parentId) : undefined;
    if (route.parentId && !parent) throw new Error(`Unknown parent route: ${route.parentId}`);
    const parentPath = parent ? resolve(parent).fullPath : '';
    const value = {
      ...route,
      fullPath: joinPath(parentPath, route.path, route.index),
      lazyComponent: route.load ? lazy(route.load) : undefined,
    };
    resolving.delete(route.id);
    resolved.set(route.id, value);
    return value;
  };

  return definitions.map(resolve);
}

export const resolvedRouteRegistry = resolveRouteRegistry();

export function validateRouteRegistry(definitions: readonly AppRouteDefinition[] = routeRegistry): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const route of definitions) {
    if (!route.id.trim()) errors.push('Route id must not be empty');
    if (ids.has(route.id)) errors.push(`Duplicate route id: ${route.id}`);
    ids.add(route.id);
  }
  for (const route of definitions) {
    if (route.parentId === route.id) errors.push(`Route cannot be its own parent: ${route.id}`);
    if (route.parentId && !ids.has(route.parentId)) errors.push(`Unknown parent: ${route.id} -> ${route.parentId}`);
    if (!isRoutePolicyValid(route.access)) errors.push(`Invalid access policy: ${route.id}`);
    if (route.index && route.path) errors.push(`Index route has a path: ${route.id}`);
    if (route.menu && (!route.path || route.index)) errors.push(`Menu route is not addressable: ${route.id}`);
    if (route.redirectTo && !definitions.some((candidate) => candidate.id === route.redirectTo)) errors.push(`Unknown redirect target: ${route.id}`);
  }
  try {
    const resolved = resolveRouteRegistry(definitions);
    const paths = new Map<string, string>();
    for (const route of resolved.filter((candidate) => !candidate.index && candidate.fullPath !== '*')) {
      const existing = paths.get(route.fullPath);
      if (existing && route.load && definitions.find((item) => item.id === existing)?.load) errors.push(`Conflicting route path: ${route.fullPath}`);
      if (route.load) paths.set(route.fullPath, route.id);
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unable to resolve route registry');
  }
  return errors;
}

export const routePaths = {
  dashboard: '/dashboard',
  login: '/login',
  forbidden: '/forbidden',
  activities: '/activities',
  company: (companyId: string) => `/companies/${encodeURIComponent(companyId)}`,
  opportunity: (opportunityId: string) => `/opportunities/${encodeURIComponent(opportunityId)}`,
  meeting: (meetingId: string) => `/meetings/${encodeURIComponent(meetingId)}`,
} as const;
