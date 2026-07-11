import { useMemo } from 'react';
import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useTasks } from '../hooks/useTasks';
import { isTaskOverdue } from '../utils/taskDisplay';
import TasksTable from '../components/TasksTable';

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <Grid size={{ xs: 12, sm: 6, md: 3 }}><Paper sx={{ p: 2 }}><Typography color="text.secondary" variant="caption">{label}</Typography><Typography variant="h5">{value.toLocaleString('fa-IR')}</Typography></Paper></Grid>;
}

export default function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'task:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const summary = useTasks({ page: 1, limit: 100 }, allowed);
  const items = useMemo(() => summary.data?.data ?? [], [summary.data?.data]);

  if (!allowed) return <Alert severity="warning">دسترسی مشاهده کارها فعال نیست.</Alert>;

  return (
    <Box>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">مدیریت کارها</Typography>
        <Typography color="text.secondary">کارهای مستقل از چرخه قدیمی پیگیری فعالیت‌ها. صفحه پیگیری‌ها همچنان جداگانه در دسترس است.</Typography>
      </Stack>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <SummaryCard label="کل کارها" value={summary.data?.meta.total ?? items.length} />
        <SummaryCard label="انجام‌نشده" value={items.filter((item) => item.status === 'TODO').length} />
        <SummaryCard label="سررسید گذشته" value={items.filter(isTaskOverdue).length} />
        <SummaryCard label="انجام‌شده" value={items.filter((item) => item.status === 'DONE').length} />
      </Grid>
      <TasksTable />
    </Box>
  );
}
