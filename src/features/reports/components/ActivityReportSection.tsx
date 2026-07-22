import { Alert, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { getActivityTypeLabel } from '@/features/activities/types/activity.types';
import type { ActivityType } from '@/features/activities/types/activity.types';
import type { ActivityReport } from '../types/report.types';
import { formatCount, formatPercent, reportDateBasisText, toSafeNumber } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';
import { getMetricHelp } from '../metrics/metricHelpRegistry';

export default function ActivityReportSection({ data, isLoading, isError }: { data?: ActivityReport; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>در حال دریافت گزارش فعالیت‌ها...</Typography>;
  return <Stack spacing={2}><Typography variant="h5">گزارش فعالیت‌ها</Typography><Typography color="text.secondary">{reportDateBasisText(data?.period, 'بر اساس تاریخ انجام فعالیت')}</Typography>
    {isError ? <Alert severity="error">خطا در دریافت گزارش فعالیت‌ها.</Alert> : data ? <><Grid container spacing={2}><Grid size={{ xs: 12, sm: 4 }}><ReportMetricCard label="کل فعالیت‌ها" value={formatCount(data.totalActivities)} help={getMetricHelp('report.activity.total')} /></Grid></Grid>{data.breakdown.length ? <Paper sx={{ p: 2 }}><Stack spacing={2}>{data.breakdown.map((item) => { const percent = toSafeNumber(item.percentage) ?? 0; return <div key={item.type}><Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}><Typography>{getActivityTypeLabel(item.type as ActivityType)}</Typography><Typography>{formatCount(item.count)} — {formatPercent(item.percentage)}</Typography></Stack><LinearProgress variant="determinate" value={Math.min(100, Math.max(0, percent))} /></div>; })}</Stack></Paper> : <Alert severity="info">فعالیتی با فیلترهای انتخاب‌شده وجود ندارد.</Alert>}</> : <Alert severity="info">داده‌ای برای نمایش گزارش فعالیت‌ها وجود ندارد.</Alert>}
  </Stack>;
}
