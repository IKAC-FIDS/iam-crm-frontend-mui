import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { can } from '@/features/auth/utils/permissions';
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
import { useAuthStore } from '@/store/authStore';

export default function MainGrid() {
  const user = useAuthStore((state) => state.user);
  const hasAccess = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const dateRange = defaultActivityDateRange();

  const pipeline = usePipelineSummaryReport(dateRange, hasAccess);
  const conversion = useConversionRatesReport(dateRange, hasAccess);
  const activities = useActivityReport(dateRange, hasAccess);

  if (!hasAccess) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        گزارش‌های مدیریتی برای نقش شما فعال نیست.
      </Alert>
    );
  }

  const forbidden = [pipeline.error, conversion.error, activities.error].some(isForbiddenError);

  const metrics = [
    {
      label: 'کل فرصت‌ها',
      value: formatCount(pipeline.data?.summary.totalCompanies),
      unavailable: pipeline.isError,
      loading: pipeline.isLoading,
    },
    {
      label: 'فرصت‌های فعال',
      value: formatCount(pipeline.data?.summary.activeCompanies),
      unavailable: pipeline.isError,
      loading: pipeline.isLoading,
    },
    {
      label: 'فرصت‌های از دست‌رفته',
      value: formatCount(pipeline.data?.summary.lostCompanies),
      unavailable: pipeline.isError,
      loading: pipeline.isLoading,
    },
    {
      label: 'نرخ از دست‌رفتگی',
      value: formatPercent(pipeline.data?.summary.lostRate),
      unavailable: pipeline.isError,
      loading: pipeline.isLoading,
    },
    {
      label: 'نرخ تبدیل کل',
      value: formatPercent(conversion.data?.summary.overallConversionRate),
      unavailable: conversion.isError,
      loading: conversion.isLoading,
    },
    {
      label: 'فرصت‌های موفق',
      value: formatCount(conversion.data?.summary.completedCompanies),
      unavailable: conversion.isError,
      loading: conversion.isLoading,
    },
    {
      label: 'فعالیت‌های ۳۰ روز اخیر',
      value: formatCount(activities.data?.totalActivities),
      unavailable: activities.isError,
      loading: activities.isLoading,
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {forbidden && (
        <Alert severity="info" sx={{ mb: 2 }}>
          گزارش‌های مدیریتی برای نقش شما فعال نیست.
        </Alert>
      )}

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
    </Box>
  );
}