import { useState } from 'react';
import { Alert, Button, Grid, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { getActivityTypeLabel } from '@/features/activities/types/activity.types';
import { useActivityReport } from '../hooks/useReports';
import type { ActivityType } from '@/features/activities/types/activity.types';
import { defaultActivityDateRange, formatCount, formatPercent, isForbiddenError, toSafeNumber } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';

export default function ActivityReportSection() {
  const initial = defaultActivityDateRange();
  const [draft, setDraft] = useState(initial);
  const [params, setParams] = useState(initial);
  const query = useActivityReport(params);
  if (query.isLoading) return <Typography>در حال دریافت گزارش فعالیت‌ها...</Typography>;
  return <Stack spacing={2}><Typography variant="h5">گزارش فعالیت‌ها</Typography>
    <Paper sx={{ p: 2 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField fullWidth label="از تاریخ" type="date" value={draft.startDate} onChange={(event) => setDraft((value) => ({ ...value, startDate: event.target.value }))} slotProps={{ inputLabel: { shrink: true } }} /><TextField fullWidth label="تا تاریخ" type="date" value={draft.endDate} onChange={(event) => setDraft((value) => ({ ...value, endDate: event.target.value }))} slotProps={{ inputLabel: { shrink: true } }} /><Button variant="contained" onClick={() => setParams(draft)} disabled={!draft.startDate || !draft.endDate || query.isFetching}>اعمال بازه</Button></Stack></Paper>
    {query.isError ? <Alert severity="error">{isForbiddenError(query.error) ? 'شما دسترسی مشاهده گزارش‌ها را ندارید.' : 'خطا در دریافت گزارش فعالیت‌ها.'}</Alert> : query.data ? <><Grid container spacing={2}><Grid size={{ xs: 12, sm: 4 }}><ReportMetricCard label="کل فعالیت‌ها" value={formatCount(query.data.totalActivities)} /></Grid></Grid><Paper sx={{ p: 2 }}><Stack spacing={2}>{query.data.breakdown.map((item) => { const percent = toSafeNumber(item.percentage) ?? 0; return <div key={item.type}><Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}><Typography>{getActivityTypeLabel(item.type as ActivityType)}</Typography><Typography>{formatCount(item.count)} — {formatPercent(item.percentage)}</Typography></Stack><LinearProgress variant="determinate" value={Math.min(100, Math.max(0, percent))} /></div>; })}</Stack></Paper></> : <Alert severity="info">داده‌ای برای نمایش گزارش فعالیت‌ها وجود ندارد.</Alert>}
  </Stack>;
}
