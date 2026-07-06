import { Alert, Box, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import type { PipelineSummaryReport } from '../types/report.types';
import { formatCount, formatPercent, toSafeNumber } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';

export default function PipelineSummarySection({ data, isLoading, isError }: { data?: PipelineSummaryReport; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>Ø¯Ø± Ø­Ø§Ù„ Ø¯Ø±ÛŒØ§ÙØª Ø®Ù„Ø§ØµÙ‡ Ù¾Ø§ÛŒÙ¾â€ŒÙ„Ø§ÛŒÙ†...</Typography>;
  if (isError || !data) return <Alert severity="error">Ø®Ø·Ø§ Ø¯Ø± Ø¯Ø±ÛŒØ§ÙØª Ø®Ù„Ø§ØµÙ‡ Ù¾Ø§ÛŒÙ¾â€ŒÙ„Ø§ÛŒÙ†.</Alert>;
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Ø®Ù„Ø§ØµÙ‡ Ù¾Ø§ÛŒÙ¾â€ŒÙ„Ø§ÛŒÙ†</Typography>
      <Grid container spacing={2}>
        {[
          ['کل فرصت‌ها', formatCount(data.summary.totalCompanies)],
          ['فرصت‌های فعال', formatCount(data.summary.activeCompanies)],
          ['فرصت‌های از دست‌رفته', formatCount(data.summary.lostCompanies)],
          ['Ù†Ø±Ø® Ø§Ø² Ø¯Ø³Øªâ€ŒØ±ÙØªÚ¯ÛŒ', formatPercent(data.summary.lostRate)],
        ].map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}><ReportMetricCard label={label} value={value} /></Grid>)}
      </Grid>
      <Paper sx={{ p: 2 }}><Stack spacing={2}>{data.stages.map((item) => {
        const percentage = toSafeNumber(item.percentage) ?? 0;
        return <Box key={item.stage}><Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}><Typography>{getStageLabel(item.stage)}</Typography><Typography>{formatCount(item.count)} â€” {formatPercent(item.percentage)}</Typography></Stack><LinearProgress variant="determinate" value={Math.min(100, Math.max(0, percentage))} /></Box>;
      })}</Stack></Paper>
    </Stack>
  );
}
