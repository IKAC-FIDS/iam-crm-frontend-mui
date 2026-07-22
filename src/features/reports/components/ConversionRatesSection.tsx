import {
  Alert,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ConversionRatesReport } from '../types/report.types';
import { formatCount, formatPercent, reportDateBasisText } from '../utils/reportDisplay';
import ReportMetricCards from './ReportMetricCards';

function fromLabel(item: ConversionRatesReport['stages'][number]) {
  return item.fromLabel || item.fromStage || 'ورودی اولیه';
}

function toLabel(item: ConversionRatesReport['stages'][number]) {
  return item.toLabel || item.toStage || '—';
}

export default function ConversionRatesSection({
  data,
  isLoading,
  isError,
}: {
  data?: ConversionRatesReport;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return <Typography>در حال دریافت نرخ تبدیل...</Typography>;
  }

  if (isError || !data) {
    return <Alert severity="error">خطا در دریافت نرخ تبدیل.</Alert>;
  }

  const total = data.summary.totalOpportunities ?? data.summary.totalCompanies;
  const won = data.summary.wonOpportunities ?? data.summary.completedCompanies;
  const rate =
    data.summary.overallOpportunityConversionRate ??
    data.summary.overallConversionRate;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">نرخ تبدیل بر اساس قوانین انتقال</Typography>
      <Typography color="text.secondary">انتقال‌های انجام‌شده در بازه انتخابی — {reportDateBasisText(data.period, 'بر اساس تاریخ تغییر مرحله')}. کل فرصت‌ها، فرصت‌های متمایز دارای انتقال واجد شرایط هستند.</Typography>

      <ReportMetricCards columns={3} items={[
        { key: 'report.conversion.total', label: 'کل فرصت‌ها', value: formatCount(total), contextLabel: 'بازه انتخابی' },
        { key: 'report.conversion.won', label: 'فرصت‌های موفق', value: formatCount(won) },
        { key: 'report.conversion.overallRate', label: 'نرخ تبدیل کل', value: formatPercent(rate), unavailable: Number(total) === 0 },
      ]} />

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>مبدأ قانون انتقال</TableCell>
              <TableCell>مقصد قانون انتقال</TableCell>
              <TableCell>تعداد فرصت‌های مبدأ</TableCell>
              <TableCell>تعداد انتقال انجام‌شده</TableCell>
              <TableCell>نرخ تبدیل</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.stages.map((item, index) => (
              <TableRow key={`${item.fromStageId ?? 'entry'}-${item.toStageId ?? item.toStage}-${index}`}>
                <TableCell>{fromLabel(item)}</TableCell>
                <TableCell>{toLabel(item)}</TableCell>
                <TableCell>{formatCount(item.fromCount)}</TableCell>
                <TableCell>{formatCount(item.toCount)}</TableCell>
                <TableCell>{formatPercent(item.conversionRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!data.stages.length && (
        <Alert severity="info">
          هنوز قانون انتقالی برای محاسبه نرخ تبدیل وجود ندارد.
        </Alert>
      )}
    </Stack>
  );
}
