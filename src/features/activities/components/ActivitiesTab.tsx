import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import ActivityFormDialog from './ActivityFormDialog';
import EditActivityDialog from './EditActivityDialog';
import { useActivities } from '../hooks/useActivities';
import type { Activity } from '../types/activity.types';
import { getActivityTypeLabel } from '../types/activity.types';

interface ActivitiesTabProps {
  companyId: string;
}

type FollowUpStatus = 'overdue' | 'today' | 'upcoming';

function display(value?: string | null): string {
  return value?.trim() || '—';
}

function formatDateTime(value?: string | null): string {
  return formatJalaliDateTime(value);
}

function getFollowUpStatus(value: string): FollowUpStatus | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const followUpDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (followUpDay < today) return 'overdue';
  if (followUpDay === today) return 'today';
  return 'upcoming';
}

const followUpPresentation: Record<FollowUpStatus, { label: string; color: 'error' | 'warning' | 'info' }> = {
  overdue: { label: 'عقب‌افتاده', color: 'error' },
  today: { label: 'موعد امروز', color: 'warning' },
  upcoming: { label: 'پیش رو', color: 'info' },
};

function ActivityItem({ activity, isLast, canEdit, onEdit }: { activity: Activity; isLast: boolean; canEdit: boolean; onEdit: (activity: Activity) => void }) {
  const followUpStatus = activity.nextActionDate
    ? getFollowUpStatus(activity.nextActionDate)
    : null;

  return (
    <Box sx={{ position: 'relative', pr: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          position: 'absolute',
          right: 5,
          top: 8,
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          boxShadow: (theme) => `0 0 0 4px ${theme.palette.background.paper}`,
        }}
      />
      {!isLast && (
        <Box sx={{ position: 'absolute', right: 10, top: 20, bottom: -24, width: 2, bgcolor: 'divider' }} />
      )}

      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip size="small" color="primary" variant="outlined" label={getActivityTypeLabel(activity.type)} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {display(activity.person?.fullName)}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            تاریخ ثبت: {formatDateTime(activity.createdAt)}
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
          <Typography variant="body2"><strong>ثبت‌کننده:</strong> {display(activity.user?.fullName)}</Typography>
          <Typography variant="body2"><strong>زمان انجام:</strong> {formatDateTime(activity.occurredAt)}</Typography>
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary">یادداشت</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {display(activity.notes)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">نتیجه</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {display(activity.outcome)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2">
            <strong>پیگیری بعدی:</strong> {formatDateTime(activity.nextActionDate)}
          </Typography>
          {followUpStatus && (
            <Chip
              size="small"
              color={followUpPresentation[followUpStatus].color}
              label={followUpPresentation[followUpStatus].label}
            />
          )}
        </Stack>
        {canEdit && (
          <Button size="small" onClick={() => onEdit(activity)}>ویرایش</Button>
        )}
      </Stack>
      {!isLast && <Divider sx={{ my: 3 }} />}
    </Box>
  );
}

export default function ActivitiesTab({ companyId }: ActivitiesTabProps) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'activity:view', ['ADMIN', 'MANAGER', 'REP']);
  const canCreate = can(user, 'activity:create', ['ADMIN', 'MANAGER', 'REP']);
  const canEdit = can(user, 'activity:update', ['ADMIN', 'MANAGER', 'REP']);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<5 | 10 | 20>(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const activitiesQuery = useActivities({ companyId, page, limit });

  if (!canView) {
    return <Alert severity="warning">دسترسی مشاهده فعالیت‌ها برای این حساب فعال نیست.</Alert>;
  }

  const activities = activitiesQuery.data?.data ?? [];

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6">فعالیت‌های شرکت</Typography>
        {canCreate && (
          <Button variant="contained" onClick={() => setFormOpen(true)}>ثبت فعالیت</Button>
        )}
      </Stack>

      {activitiesQuery.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت فعالیت‌های شرکت.</Alert>
      )}

      {activitiesQuery.isLoading ? (
        <Stack sx={{ minHeight: 260, alignItems: 'center', justifyContent: 'center' }} spacing={2}>
          <CircularProgress size={32} />
          <Typography color="text.secondary">در حال دریافت فعالیت‌ها...</Typography>
        </Stack>
      ) : !activitiesQuery.isError && activities.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">هنوز فعالیتی برای این شرکت ثبت نشده است.</Typography>
        </Paper>
      ) : activities.length > 0 ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          {activitiesQuery.isFetching && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              در حال به‌روزرسانی فعالیت‌ها...
            </Typography>
          )}
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === activities.length - 1}
              canEdit={canEdit}
              onEdit={setEditingActivity}
            />
          ))}
          <TablePagination
            component="div"
            count={activitiesQuery.data?.meta.total ?? 0}
            page={page - 1}
            onPageChange={(_, nextPage) => setPage(nextPage + 1)}
            rowsPerPage={limit}
            onRowsPerPageChange={(event) => {
              setLimit(Number(event.target.value) as 5 | 10 | 20);
              setPage(1);
            }}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="تعداد ردیف در صفحه"
            labelDisplayedRows={({ from, to, count }) => `از ${from} تا ${to} از ${count}`}
          />
        </Paper>
      ) : null}

      {canCreate && (
        <ActivityFormDialog
          key={formOpen ? 'open' : 'closed'}
          companyId={companyId}
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      )}
      {canEdit && editingActivity && (
        <EditActivityDialog
          key={editingActivity.id}
          activity={editingActivity}
          open
          onClose={() => setEditingActivity(null)}
        />
      )}
    </Box>
  );
}
