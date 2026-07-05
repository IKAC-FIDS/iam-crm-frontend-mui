import { Alert, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import type { ConversionRatesReport } from '../types/report.types';
import { formatCount, formatPercent } from '../utils/reportDisplay';
import ReportMetricCard from './ReportMetricCard';

export default function ConversionRatesSection({ data, isLoading, isError }: { data?: ConversionRatesReport; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>در حال دریافت نرخ تبدیل...</Typography>;
  if (isError || !data) return <Alert severity="error">خطا در دریافت نرخ تبدیل.</Alert>;
  return <Stack spacing={2}><Typography variant="h5">نرخ تبدیل</Typography><Grid container spacing={2}>{[
    ['شرکت‌های ورودی', formatCount(data.summary.totalCompanies)],
    ['شرکت‌های موفق', formatCount(data.summary.completedCompanies)],
    ['نرخ تبدیل کل', formatPercent(data.summary.overallConversionRate)],
  ].map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 4 }}><ReportMetricCard label={label} value={value} /></Grid>)}</Grid>
    <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>از مرحله</TableCell><TableCell>به مرحله</TableCell><TableCell>تعداد مبدأ</TableCell><TableCell>تعداد مقصد</TableCell><TableCell>نرخ تبدیل</TableCell></TableRow></TableHead><TableBody>{data.stages.map((item, index) => <TableRow key={`${item.fromStage}-${item.toStage}-${index}`}><TableCell>{getStageLabel(item.fromStage)}</TableCell><TableCell>{getStageLabel(item.toStage)}</TableCell><TableCell>{formatCount(item.fromCount)}</TableCell><TableCell>{formatCount(item.toCount)}</TableCell><TableCell>{formatPercent(item.conversionRate)}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
  </Stack>;
}
