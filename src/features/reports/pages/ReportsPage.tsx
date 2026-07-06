import { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ActivityByUserSection from '../components/ActivityByUserSection';
import ActivityReportSection from '../components/ActivityReportSection';
import ConversionRatesSection from '../components/ConversionRatesSection';
import PipelineByOwnerSection from '../components/PipelineByOwnerSection';
import PipelineSummarySection from '../components/PipelineSummarySection';
import ReportFilterPanel from '../components/ReportFilterPanel';
import StageDurationsSection from '../components/StageDurationsSection';
import {
  reportQueryKeys,
  useActivitiesByUserReport,
  useActivityReport,
  useConversionRatesReport,
  usePipelineByOwnerReport,
  usePipelineSummaryReport,
  useReportFilterOptions,
  useStageDurationsReport,
} from '../hooks/useReports';
import type { ReportFilters } from '../types/report.types';
import { defaultActivityDateRange, isForbiddenError } from '../utils/reportDisplay';

function initialFilters(): ReportFilters { return defaultActivityDateRange(); }

export default function ReportsPage() {
  const user = useAuthStore((state) => state.user);
  const hasAccess = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ReportFilters>(initialFilters);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const filterOptions = useReportFilterOptions(hasAccess);
  const pipeline = usePipelineSummaryReport(filters, hasAccess);
  const conversion = useConversionRatesReport(filters, hasAccess);
  const durations = useStageDurationsReport(filters, hasAccess);
  const activities = useActivityReport(filters, hasAccess);
  const activitiesByUser = useActivitiesByUserReport(filters, hasAccess);
  const pipelineByOwner = usePipelineByOwnerReport(filters, hasAccess);
  const reports = [pipeline, conversion, durations, activities, activitiesByUser, pipelineByOwner];

  if (!hasAccess) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;
  const forbidden = [filterOptions.error, ...reports.map((query) => query.error)].some(isForbiddenError);
  if (forbidden) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;

  const reset = () => {
    const next = initialFilters();
    setDraft(next);
    setFilters(next);
  };

  return <Box sx={{ minWidth: 0 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}><Box><Typography variant="h4">گزارش‌ها</Typography><Typography color="text.secondary">نمای کلی عملکرد پایپ‌لاین و فعالیت‌های فروش با فیلترهای پیشرفته.</Typography></Box><Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => queryClient.invalidateQueries({ queryKey: reportQueryKeys.all })}>بروزرسانی گزارش‌ها</Button></Stack>
    <Stack spacing={4}>
      <ReportFilterPanel draft={draft} options={filterOptions.data} isLoading={filterOptions.isLoading} isError={filterOptions.isError} isApplying={reports.some((query) => query.isFetching)} onChange={setDraft} onApply={() => setFilters({ ...draft })} onReset={reset} />
      <PipelineSummarySection data={pipeline.data} isLoading={pipeline.isLoading} isError={pipeline.isError} />
      <ConversionRatesSection data={conversion.data} isLoading={conversion.isLoading} isError={conversion.isError} />
      <StageDurationsSection data={durations.data} isLoading={durations.isLoading} isError={durations.isError} />
      <ActivityReportSection data={activities.data} isLoading={activities.isLoading} isError={activities.isError} />
      <ActivityByUserSection data={activitiesByUser.data} isLoading={activitiesByUser.isLoading} isError={activitiesByUser.isError} />
      <PipelineByOwnerSection data={pipelineByOwner.data} isLoading={pipelineByOwner.isLoading} isError={pipelineByOwner.isError} />
    </Stack>
  </Box>;
}
