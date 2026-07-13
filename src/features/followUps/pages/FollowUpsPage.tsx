import { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Tab, TablePagination, Tabs, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import FollowUpCard from '../components/FollowUpCard';
import FollowUpsSummaryCards from '../components/FollowUpsSummaryCards';
import { useDueFollowUps } from '../hooks/useFollowUps';
import type { FollowUpFilter } from '../types/followUp.types';
import { getFollowUpDueStatus } from '../utils/followUpDisplay';

const filters: { value: FollowUpFilter; label: string }[] = [
  { value: 'ALL', label: 'همه' },
  { value: 'OVERDUE', label: 'عقب‌افتاده' },
  { value: 'TODAY', label: 'امروز' },
  { value: 'UPCOMING', label: 'آینده' },
];

export default function FollowUpsPage() {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'follow-up:view', ['ADMIN', 'MANAGER', 'REP']) || can(user, 'activity:view');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<5 | 10 | 20 | 50>(20);
  const [filter, setFilter] = useState<FollowUpFilter>('ALL');
  const query = useDueFollowUps({ page, limit });
  const items = useMemo(() => query.data?.data ?? [], [query.data?.data]);
  const filtered = useMemo(() => items.filter((item) => {
    if (filter === 'ALL') return true;
    return getFollowUpDueStatus(item.nextActionDate) === filter.toLowerCase();
  }), [filter, items]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده پیگیری‌ها برای این حساب فعال نیست.</Alert>;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box><Typography variant="h4">پیگیری‌ها</Typography><Typography color="text.secondary">فعالیت‌هایی که زمان پیگیری آن‌ها رسیده یا گذشته است.</Typography></Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => query.refetch()} disabled={query.isFetching}>بروزرسانی</Button>
      </Stack>

      {query.isLoading ? (
        <Stack sx={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }} spacing={2}><CircularProgress /><Typography>در حال دریافت پیگیری‌ها...</Typography></Stack>
      ) : query.isError ? (
        <Alert severity="error">خطا در دریافت پیگیری‌ها.</Alert>
      ) : items.length === 0 ? (
        <Alert severity="info">در حال حاضر پیگیری سررسید شده‌ای وجود ندارد.</Alert>
      ) : (
        <Stack spacing={2}>
          <FollowUpsSummaryCards items={items} />
          <Paper><Tabs value={filter} onChange={(_, value: FollowUpFilter) => setFilter(value)} variant="scrollable" scrollButtons="auto">{filters.map((item) => <Tab key={item.value} value={item.value} label={item.label} />)}</Tabs></Paper>
          {query.isFetching && <Typography variant="caption" color="text.secondary">در حال بروزرسانی پیگیری‌ها...</Typography>}
          {filtered.length ? filtered.map((item) => <FollowUpCard key={item.id} followUp={item} />) : <Paper sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">موردی در این فیلتر وجود ندارد.</Typography></Paper>}
          <Paper>
            <TablePagination component="div" count={query.data?.meta.total ?? 0} page={page - 1} onPageChange={(_, value) => setPage(value + 1)} rowsPerPage={limit} onRowsPerPageChange={(event) => { setLimit(Number(event.target.value) as 5 | 10 | 20 | 50); setPage(1); }} rowsPerPageOptions={[5, 10, 20, 50]} labelRowsPerPage="تعداد ردیف در صفحه" labelDisplayedRows={({ from, to, count }) => `از ${from} تا ${to} از ${count}`} />
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
