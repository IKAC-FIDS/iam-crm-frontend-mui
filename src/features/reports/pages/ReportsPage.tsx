import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ActivityReportSection from '../components/ActivityReportSection';
import ConversionRatesSection from '../components/ConversionRatesSection';
import PipelineSummarySection from '../components/PipelineSummarySection';
import StageDurationsSection from '../components/StageDurationsSection';
import { reportQueryKeys, useConversionRatesReport, usePipelineSummaryReport, useStageDurationsReport } from '../hooks/useReports';
import { isForbiddenError } from '../utils/reportDisplay';

export default function ReportsPage() {
  const user = useAuthStore((state) => state.user);
  const hasAccess = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const queryClient = useQueryClient();
  const pipeline = usePipelineSummaryReport(hasAccess);
  const conversion = useConversionRatesReport(hasAccess);
  const durations = useStageDurationsReport(hasAccess);
  if (!hasAccess) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;
  const forbidden = [pipeline.error, conversion.error, durations.error].some(isForbiddenError);
  if (forbidden) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;
  return <Box sx={{ minWidth: 0 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}><Box><Typography variant="h4">گزارش‌ها</Typography><Typography color="text.secondary">نمای کلی عملکرد پایپ‌لاین، نرخ تبدیل، زمان ماندگاری مراحل و فعالیت‌های فروش.</Typography></Box><Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => queryClient.invalidateQueries({ queryKey: reportQueryKeys.all })}>بروزرسانی گزارش‌ها</Button></Stack>
    <Stack spacing={4}><PipelineSummarySection data={pipeline.data} isLoading={pipeline.isLoading} isError={pipeline.isError} /><ConversionRatesSection data={conversion.data} isLoading={conversion.isLoading} isError={conversion.isError} /><StageDurationsSection data={durations.data} isLoading={durations.isLoading} isError={durations.isError} /><ActivityReportSection /></Stack>
  </Box>;
}
