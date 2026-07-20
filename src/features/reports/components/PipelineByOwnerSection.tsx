import {
  Alert,
  Chip,
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

import type {
  NumericValue,
  PipelineByOwnerReportItem,
  PipelineByOwnerStageItem,
} from '../types/report.types';
import { formatCount, formatPercent } from '../utils/reportDisplay';

function stageItems(
  value: PipelineByOwnerReportItem['stageBreakdown'] | PipelineByOwnerReportItem['stages'],
): PipelineByOwnerStageItem[] {
  if (Array.isArray(value)) return value;

  if (value) {
    return Object.entries(value).map(([stage, count]) => ({
      stage,
      label: stage,
      count: count as NumericValue,
    }));
  }

  return [];
}

function stageLabel(item: PipelineByOwnerStageItem) {
  return item.label || item.stage || '—';
}

export default function PipelineByOwnerSection({
  data,
  isLoading,
  isError,
}: {
  data?: PipelineByOwnerReportItem[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return <Typography>در حال دریافت گزارش پایپ‌لاین مالکان...</Typography>;
  }

  if (isError) {
    return <Alert severity="error">خطا در دریافت گزارش پایپ‌لاین مالکان.</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">پایپ‌لاین به تفکیک مالک</Typography>
      <Typography color="text.secondary">عملکرد مالکان بر اساس تاریخ ایجاد فرصت در بازه انتخابی محاسبه می‌شود.</Typography>

      {data?.length ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>مالک</TableCell>
                <TableCell>تیم</TableCell>
                <TableCell>کل فرصت‌ها</TableCell>
                <TableCell>فعال</TableCell>
                <TableCell>موفق</TableCell>
                <TableCell>ازدست‌رفته</TableCell>
                <TableCell>نرخ تبدیل</TableCell>
                <TableCell>نرخ ازدست‌رفتگی</TableCell>
                <TableCell>تفکیک مراحل</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((item, index) => {
                const stages = stageItems(item.stages ?? item.stageBreakdown);

                return (
                  <TableRow key={item.ownerId ?? `${item.ownerName ?? item.fullName}-${index}`}>
                    <TableCell>{item.ownerName ?? item.fullName ?? 'بدون مالک'}</TableCell>
                    <TableCell>{item.team || '—'}</TableCell>
                    <TableCell>{formatCount(item.totalOpportunities ?? item.totalCompanies)}</TableCell>
                    <TableCell>{formatCount(item.activeOpportunities ?? item.activeCompanies)}</TableCell>
                    <TableCell>{formatCount(item.wonOpportunities ?? item.doneCompanies)}</TableCell>
                    <TableCell>{formatCount(item.lostOpportunities ?? item.lostCompanies)}</TableCell>
                    <TableCell>{formatPercent(item.conversionRate)}</TableCell>
                    <TableCell>{formatPercent(item.lostRate)}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        useFlexGap
                        sx={{ flexWrap: 'wrap', minWidth: 180 }}
                      >
                        {stages
                          .filter((stage) => Number(stage.count) > 0)
                          .map((stage) => (
                            <Chip
                              key={stage.stageId ?? stage.stage}
                              size="small"
                              label={`${stageLabel(stage)}: ${formatCount(stage.count)}`}
                            />
                          ))}

                        {!stages.some((stage) => Number(stage.count) > 0) && '—'}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">
          داده‌ای برای پایپ‌لاین مالکان با فیلترهای انتخاب‌شده وجود ندارد.
        </Alert>
      )}
    </Stack>
  );
}
