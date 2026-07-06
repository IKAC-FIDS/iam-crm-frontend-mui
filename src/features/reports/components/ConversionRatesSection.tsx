import { Alert, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import type { ConversionRatesReport } from '../types/report.types';
import { formatCount, formatPercent } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';

export default function ConversionRatesSection({ data, isLoading, isError }: { data?: ConversionRatesReport; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>Ø¯Ø± Ø­Ø§Ù„ Ø¯Ø±ÛŒØ§ÙØª Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„...</Typography>;
  if (isError || !data) return <Alert severity="error">Ø®Ø·Ø§ Ø¯Ø± Ø¯Ø±ÛŒØ§ÙØª Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„.</Alert>;
  return <Stack spacing={2}><Typography variant="h5">Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„</Typography><Grid container spacing={2}>{[
    ['فرصت‌های ورودی', formatCount(data.summary.totalCompanies)],
    ['فرصت‌های موفق', formatCount(data.summary.completedCompanies)],
    ['Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„ Ú©Ù„', formatPercent(data.summary.overallConversionRate)],
  ].map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 4 }}><ReportMetricCard label={label} value={value} /></Grid>)}</Grid>
    <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>Ø§Ø² Ù…Ø±Ø­Ù„Ù‡</TableCell><TableCell>Ø¨Ù‡ Ù…Ø±Ø­Ù„Ù‡</TableCell><TableCell>ØªØ¹Ø¯Ø§Ø¯ Ù…Ø¨Ø¯Ø£</TableCell><TableCell>ØªØ¹Ø¯Ø§Ø¯ Ù…Ù‚ØµØ¯</TableCell><TableCell>Ù†Ø±Ø® ØªØ¨Ø¯ÛŒÙ„</TableCell></TableRow></TableHead><TableBody>{data.stages.map((item, index) => <TableRow key={`${item.fromStage}-${item.toStage}-${index}`}><TableCell>{getStageLabel(item.fromStage)}</TableCell><TableCell>{getStageLabel(item.toStage)}</TableCell><TableCell>{formatCount(item.fromCount)}</TableCell><TableCell>{formatCount(item.toCount)}</TableCell><TableCell>{formatPercent(item.conversionRate)}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Stack>;
}
