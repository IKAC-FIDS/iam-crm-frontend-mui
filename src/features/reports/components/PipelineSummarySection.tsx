import { Alert, Box, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';

import type { PipelineSummaryReport } from '../types/report.types';
import { formatCount, formatPercent, reportDateBasisText, toSafeNumber } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';

function stageLabel(item: { label?: string; stage?: string }) {
  return item.label || item.stage || '—';
}

export default function PipelineSummarySection({
  data,
  isLoading,
  isError,
}: {
  data?: PipelineSummaryReport;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return <Typography>در حال دریافت خلاصه پایپ‌لاین...</Typography>;
  }

  if (isError || !data) {
    return <Alert severity="error">خطا در دریافت خلاصه پایپ‌لاین.</Alert>;
  }

  const total = data.summary.totalOpportunities ?? data.summary.totalCompanies;
  const active = data.summary.activeOpportunities ?? data.summary.activeCompanies;
  const won = data.summary.wonOpportunities;
  const lost = data.summary.lostOpportunities ?? data.summary.lostCompanies;
  const lostRate = data.summary.lostOpportunityRate ?? data.summary.lostRate;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">خلاصه پایپ‌لاین</Typography>
      <Typography color="text.secondary">فرصت‌های ایجادشده در بازه انتخابی — {reportDateBasisText(data.period, 'بر اساس تاریخ ایجاد فرصت')}</Typography>

      <Grid container spacing={2}>
        {[
          ['کل فرصت‌ها', formatCount(total)],
          ['فرصت‌های فعال', formatCount(active)],
          ['فرصت‌های موفق', formatCount(won)],
          ['فرصت‌های از دست‌رفته', formatCount(lost)],
          ['نرخ از دست‌رفتگی', formatPercent(lostRate)],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <ReportMetricCard label={label} value={value} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {data.stages.map((item) => {
            const percentage = toSafeNumber(item.percentage) ?? 0;

            return (
              <Box key={item.stageId ?? item.stage}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', mb: 0.5 }}
                >
                  <Typography>{stageLabel(item)}</Typography>
                  <Typography>
                    {formatCount(item.count)} — {formatPercent(item.percentage)}
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, percentage))}
                />
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
