import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import type { StageDurationReportItem } from '../types/report.types';
import { formatCount, formatDurationDays } from '../utils/reportDisplay';

export default function StageDurationsSection({ data, isLoading, isError }: { data?: StageDurationReportItem[]; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <Typography>در حال دریافت زمان ماندگاری مراحل...</Typography>;
  if (isError) return <Alert severity="error">خطا در دریافت زمان ماندگاری مراحل.</Alert>;
  return <Stack spacing={2}><Typography variant="h5">زمان ماندگاری مراحل</Typography>{data?.length ? <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>مرحله</TableCell><TableCell>تعداد نمونه</TableCell><TableCell>میانگین روز</TableCell><TableCell>کمترین روز</TableCell><TableCell>بیشترین روز</TableCell></TableRow></TableHead><TableBody>{data.map((item) => <TableRow key={item.stage}><TableCell>{getStageLabel(item.stage)}</TableCell><TableCell>{formatCount(item.sample_count)}</TableCell><TableCell>{formatDurationDays(item.avg_duration_days)}</TableCell><TableCell>{formatDurationDays(item.min_duration_days)}</TableCell><TableCell>{formatDurationDays(item.max_duration_days)}</TableCell></TableRow>)}</TableBody></Table></TableContainer> : <Alert severity="info">هنوز داده کافی برای محاسبه زمان ماندگاری مراحل وجود ندارد.</Alert>}</Stack>;
}
