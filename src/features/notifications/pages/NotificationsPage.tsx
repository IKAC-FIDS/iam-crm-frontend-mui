import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SendIcon from '@mui/icons-material/Send';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useReadAllNotifications } from '../hooks/useNotifications';
import NotificationsTable from '../components/NotificationsTable';
import SendNotificationDialog from '../components/SendNotificationDialog';

export default function NotificationsPage() {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'notification:view', ['ADMIN']);
  const canManage = can(user, 'notification:manage', ['ADMIN']);
  const canSend = can(user, 'notification:send', ['ADMIN', 'MANAGER']);
  const readAll = useReadAllNotifications();
  const [sendOpen, setSendOpen] = useState(false);

  const markAllRead = async () => {
    try {
      await readAll.mutateAsync({});
      toast.success('همه اعلان‌ها خوانده شدند.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'خوانده کردن همه اعلان‌ها انجام نشد.'));
    }
  };

  if (!canView) {
    return <Alert severity="warning">دسترسی مشاهده اعلان‌ها فعال نیست.</Alert>;
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box>
          <Typography variant="h4">مرکز اعلان‌ها</Typography>
          <Typography color="text.secondary">اعلان‌های داخلی سیستم و پیام‌های مرتبط با کارها و فرصت‌ها</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<MarkEmailReadIcon />}
            onClick={markAllRead}
            disabled={!canManage || readAll.isPending}
          >
            خواندن همه
          </Button>
          {canSend && (
            <Button variant="contained" startIcon={<SendIcon />} onClick={() => setSendOpen(true)}>
              ارسال اعلان
            </Button>
          )}
        </Stack>
      </Stack>
      <NotificationsTable canManage={canManage} />
      {sendOpen && <SendNotificationDialog open onClose={() => setSendOpen(false)} />}
    </Box>
  );
}
