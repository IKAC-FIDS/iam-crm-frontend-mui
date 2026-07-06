import { Alert, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import type { NumericValue, PipelineByOwnerReportItem } from '../types/report.types';
import { formatCount, formatPercent } from '../utils/reportDisplay';

function stages(value: PipelineByOwnerReportItem['stageBreakdown']): Array<[string, NumericValue]> {
  if (Array.isArray(value)) return value.map((item) => [item.stage, item.count]);
  return value ? Object.entries(value) : [];
}

export default function PipelineByOwnerSection({ data, isLoading, isError }: { data?: PipelineByOwnerReportItem[]; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>در حال دریافت گزارش پایپ‌لاین مالکان...</Typography>;
  if (isError) return <Alert severity="error">خطا در دریافت گزارش پایپ‌لاین مالکان.</Alert>;
  return <Stack spacing={2}><Typography variant="h5">پایپ‌لاین به تفکیک مالک</Typography>{data?.length ? <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>مالک</TableCell><TableCell>تیم</TableCell><TableCell>کل شرکت‌ها</TableCell><TableCell>فعال</TableCell><TableCell>انجام‌شده</TableCell><TableCell>ازدست‌رفته</TableCell><TableCell>نرخ تبدیل</TableCell><TableCell>نرخ ازدست‌رفتگی</TableCell><TableCell>تفکیک مراحل</TableCell></TableRow></TableHead><TableBody>{data.map((item, index) => <TableRow key={item.ownerId ?? `${item.ownerName ?? item.fullName}-${index}`}><TableCell>{item.ownerName ?? item.fullName ?? 'بدون مالک'}</TableCell><TableCell>{item.team || '—'}</TableCell><TableCell>{formatCount(item.totalCompanies)}</TableCell><TableCell>{formatCount(item.activeCompanies)}</TableCell><TableCell>{formatCount(item.doneCompanies)}</TableCell><TableCell>{formatCount(item.lostCompanies)}</TableCell><TableCell>{formatPercent(item.conversionRate)}</TableCell><TableCell>{formatPercent(item.lostRate)}</TableCell><TableCell><Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', minWidth: 180 }}>{stages(item.stageBreakdown).map(([stage, count]) => <Chip key={stage} size="small" label={`${getStageLabel(stage)}: ${formatCount(count)}`} />)}{!stages(item.stageBreakdown).length && '—'}</Stack></TableCell></TableRow>)}</TableBody></Table></TableContainer> : <Alert severity="info">داده‌ای برای پایپ‌لاین مالکان با فیلترهای انتخاب‌شده وجود ندارد.</Alert>}</Stack>;
}
