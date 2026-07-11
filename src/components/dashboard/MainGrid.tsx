import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { can, canAny } from '@/features/auth/utils/permissions';
import { useCompanies } from '@/features/companies/hooks/useCompanies';
import { useCurrentOrganization } from '@/features/organizations/hooks/useCurrentOrganization';
import { getOrganizationStatusColor, getOrganizationStatusLabel } from '@/features/organizations/utils/organizationDisplay';
import { useUnreadNotificationCount } from '@/features/notifications/hooks/useNotifications';
import { useOpportunities } from '@/features/opportunities/hooks/useOpportunities';
import ReportMetricCard from '@/features/reports/components/ReportMetricCard';
import {
  useActivityReport,
  useConversionRatesReport,
  usePipelineSummaryReport,
} from '@/features/reports/hooks/useReports';
import {
  defaultActivityDateRange,
  formatCount,
  formatPercent,
  isForbiddenError,
} from '@/features/reports/utils/reportDisplay';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { isTaskOverdue } from '@/features/tasks/utils/taskDisplay';
import { useAuthStore } from '@/store/authStore';

interface DashboardMetric {
  label: string;
  value: string;
  loading?: boolean;
  unavailable?: boolean;
}

interface QuickLink {
  label: string;
  to: string;
  visible: boolean;
}

function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ReportMetricCard
            label={metric.label}
            value={metric.loading ? 'در حال دریافت...' : metric.value}
            unavailable={metric.unavailable}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function QuickLinks({ links }: { links: QuickLink[] }) {
  const visibleLinks = links.filter((link) => link.visible);
  if (!visibleLinks.length) return null;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">دسترسی سریع</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {visibleLinks.map((link) => (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              variant="outlined"
              size="small"
              startIcon={<ArrowForwardIcon />}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function MainGrid() {
  const user = useAuthStore((state) => state.user);
  const hasReports = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const canViewOpportunities = can(user, 'opportunity:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canViewTasks = can(user, 'task:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canViewNotifications = can(user, 'notification:view', ['ADMIN']);
  const canViewOrganization = can(user, 'organization:view', ['ADMIN']);
  const canManageOrganizations = can(user, 'organization:manage', ['ADMIN']);
  const canViewSso = canAny(user, ['sso-provider:view', 'sso-provider:manage'], ['ADMIN']);
  const canViewProducts = canAny(user, ['product:view', 'product:manage'], ['ADMIN']);
  const dateRange = defaultActivityDateRange();

  const companies = useCompanies({ page: 1, limit: 5, archiveStatus: 'ACTIVE' });
  const opportunities = useOpportunities({ page: 1, limit: 5, includeArchived: false }, canViewOpportunities);
  const todoTasks = useTasks({ page: 1, limit: 100, status: 'TODO' }, canViewTasks);
  const inProgressTasks = useTasks({ page: 1, limit: 100, status: 'IN_PROGRESS' }, canViewTasks);
  const unreadNotifications = useUnreadNotificationCount(canViewNotifications);
  const organization = useCurrentOrganization(canViewOrganization);

  const pipeline = usePipelineSummaryReport(dateRange, hasReports);
  const conversion = useConversionRatesReport(dateRange, hasReports);
  const activities = useActivityReport(dateRange, hasReports);
  const forbidden = [pipeline.error, conversion.error, activities.error].some(isForbiddenError);

  const openTaskRows = [...(todoTasks.data?.data ?? []), ...(inProgressTasks.data?.data ?? [])];
  const overdueTasks = openTaskRows.filter(isTaskOverdue).length;

  const salesMetrics: DashboardMetric[] = [
    {
      label: 'تعداد شرکت‌ها',
      value: formatCount(companies.data?.meta.total),
      loading: companies.isLoading,
      unavailable: companies.isError,
    },
    {
      label: 'تعداد فرصت‌های فعال',
      value: formatCount(opportunities.data?.meta.total),
      loading: opportunities.isLoading,
      unavailable: opportunities.isError || !canViewOpportunities,
    },
    {
      label: 'کل فرصت‌ها در گزارش',
      value: formatCount(pipeline.data?.summary.totalOpportunities ?? pipeline.data?.summary.totalCompanies),
      loading: pipeline.isLoading,
      unavailable: pipeline.isError || !hasReports,
    },
    {
      label: 'نرخ تبدیل کل',
      value: formatPercent(conversion.data?.summary.overallOpportunityConversionRate ?? conversion.data?.summary.overallConversionRate),
      loading: conversion.isLoading,
      unavailable: conversion.isError || !hasReports,
    },
  ];

  const operationsMetrics: DashboardMetric[] = [
    {
      label: 'کارهای باز',
      value: formatCount((todoTasks.data?.meta.total ?? 0) + (inProgressTasks.data?.meta.total ?? 0)),
      loading: todoTasks.isLoading || inProgressTasks.isLoading,
      unavailable: todoTasks.isError || inProgressTasks.isError || !canViewTasks,
    },
    {
      label: 'کارهای سررسید گذشته',
      value: formatCount(overdueTasks),
      loading: todoTasks.isLoading || inProgressTasks.isLoading,
      unavailable: todoTasks.isError || inProgressTasks.isError || !canViewTasks,
    },
    {
      label: 'اعلان‌های خوانده‌نشده',
      value: formatCount(unreadNotifications.data?.total),
      loading: unreadNotifications.isLoading,
      unavailable: unreadNotifications.isError || !canViewNotifications,
    },
    {
      label: 'فعالیت‌های ۳۰ روز اخیر',
      value: formatCount(activities.data?.totalActivities),
      loading: activities.isLoading,
      unavailable: activities.isError || !hasReports,
    },
  ];

  const quickLinks: QuickLink[] = [
    { label: 'فرصت‌ها', to: '/opportunities', visible: canViewOpportunities },
    { label: 'کارها', to: '/tasks', visible: canViewTasks },
    { label: 'اعلان‌ها', to: '/notifications', visible: canViewNotifications },
    { label: 'گزارش‌ها', to: '/reports', visible: hasReports },
    { label: 'کاتالوگ محصولات', to: '/admin/libraries', visible: canViewProducts },
    { label: 'سازمان‌ها', to: '/admin/organizations', visible: canManageOrganizations },
    { label: 'ورود سازمانی', to: '/admin/sso-providers', visible: canViewSso },
  ];

  return (
    <Stack spacing={3} sx={{ width: '100%', mt: 2 }}>
      {forbidden && (
        <Alert severity="info">
          گزارش‌های مدیریتی برای نقش شما فعال نیست.
        </Alert>
      )}

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>خلاصه فروش</Typography>
        <MetricGrid metrics={salesMetrics} />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>کارها و اعلان‌ها</Typography>
        <MetricGrid metrics={operationsMetrics} />
      </Box>

      {canViewOrganization && (
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
            <Box>
              <Typography variant="h6">وضعیت سازمان جاری</Typography>
              <Typography color="text.secondary">
                {organization.isLoading ? 'در حال دریافت سازمان...' : organization.data?.name ?? 'سازمان نامشخص'}
              </Typography>
            </Box>
            {organization.data && (
              <Chip
                color={getOrganizationStatusColor(organization.data.status)}
                label={getOrganizationStatusLabel(organization.data.status)}
              />
            )}
            {organization.isError && <Alert severity="warning">دریافت وضعیت سازمان انجام نشد.</Alert>}
          </Stack>
        </Paper>
      )}

      <QuickLinks links={quickLinks} />
    </Stack>
  );
}
