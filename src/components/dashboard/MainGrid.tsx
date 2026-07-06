import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ReportMetricCard from '@/features/reports/components/ReportMetricCard';
import { useActivityReport, useConversionRatesReport, usePipelineSummaryReport } from '@/features/reports/hooks/useReports';
import { defaultActivityDateRange, formatCount, formatPercent, isForbiddenError } from '@/features/reports/utils/reportDisplay';

export default function MainGrid() {
  const user = useAuthStore((state) => state.user);
  const hasAccess = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const dateRange = defaultActivityDateRange();
  const pipeline = usePipelineSummaryReport(dateRange, hasAccess);
  const conversion = useConversionRatesReport(dateRange, hasAccess);
  const activities = useActivityReport(dateRange, hasAccess);

  if (!hasAccess) {
    return <Alert severity="info" sx={{ mt: 2 }}>Ú¯Ø²Ø§Ø±Ø´â€ŒÙ‡Ø§ÛŒ Ù…Ø¯ÛŒØ±ÛŒØªÛŒ Ø¨Ø±Ø§ÛŒ Ù†Ù‚Ø´ Ø´Ù…Ø§ ÙØ¹Ø§Ù„ Ù†ÛŒØ³Øª.</Alert>;
  }

  const forbidden = [pipeline.error, conversion.error, activities.error].some(isForbiddenError);

  const metrics = [
    { label: 'کل فرصت‌ها', value: formatCount(pipeline.data?.summary.totalCompanies), unavailable: pipeline.isError, loading: pipeline.isLoading },
    { label: 'فرصت‌های فعال', value: formatCount(pipeline.data?.summary.activeCompanies), unavailable: pipeline.isError, loading: pipeline.isLoading },
    { label: 'فرصت‌های از دست‌رفته', value: formatCount(pipeline.data?.summary.lostCompanies), unavailable: pipeline.isError, loading: pipeline.isLoading },
    { label: 'Ù†Ø±Ø® Ø§Ø² Ø¯Ø³Øªâ€ŒØ±ÙØªÚ¯ÛŒ', value: formatPercent(pipeline.data?.summary.lostRate), unavailable: pipeline.isError, loading: pipeline.isLoading },
    { label: 'Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„ Ú©Ù„', value: formatPercent(conversion.data?.summary.overallConversionRate), unavailable: conversion.isError, loading: conversion.isLoading },
    { label: 'فرصت‌های موفق', value: formatCount(conversion.data?.summary.completedCompanies), unavailable: conversion.isError, loading: conversion.isLoading },
    { label: 'ÙØ¹Ø§Ù„ÛŒØªâ€ŒÙ‡Ø§ÛŒ Û³Û° Ø±ÙˆØ² Ø§Ø®ÛŒØ±', value: formatCount(activities.data?.totalActivities), unavailable: activities.isError, loading: activities.isLoading },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {forbidden && <Alert severity="info" sx={{ mb: 2 }}>Ú¯Ø²Ø§Ø±Ø´â€ŒÙ‡Ø§ÛŒ Ù…Ø¯ÛŒØ±ÛŒØªÛŒ Ø¨Ø±Ø§ÛŒ Ù†Ù‚Ø´ Ø´Ù…Ø§ ÙØ¹Ø§Ù„ Ù†ÛŒØ³Øª.</Alert>}
      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ReportMetricCard
              label={metric.label}
              value={metric.loading ? 'Ø¯Ø± Ø­Ø§Ù„ Ø¯Ø±ÛŒØ§ÙØª...' : metric.value}
              unavailable={metric.unavailable}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
