import { toast } from 'sonner';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Menu,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/apiResponse';
import {
  useArchiveNotification,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import {
  formatNotificationDate,
  getNotificationPriorityColor,
  getNotificationPriorityLabel,
  isUnread,
} from '../utils/notificationDisplay';
import { navigateToNotificationTarget } from '../utils/notificationNavigation';
import type { Notification } from '../types/notification.types';

export default function NotificationMenu({
  anchorEl,
  open,
  onClose,
  canManage,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  canManage: boolean;
}) {
  const navigate = useNavigate();
  const query = useNotifications({ page: 1, limit: 10, status: 'all', includeArchived: false }, open);
  const markRead = useMarkNotificationRead();
  const archive = useArchiveNotification();
  const notifications = [...(query.data?.data ?? [])].sort((first, second) => {
    if (isUnread(first) === isUnread(second)) return 0;
    return isUnread(first) ? -1 : 1;
  });

  const handleOpen = async (notification: Notification) => {
    try {
      if (canManage && isUnread(notification)) await markRead.mutateAsync(notification);
      const navigated = navigateToNotificationTarget(navigate, notification.actionUrl);
      if (!navigated) navigate('/notifications');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'باز کردن اعلان انجام نشد.'));
    }
  };

  const handleMarkRead = async (notification: Notification) => {
    try {
      await markRead.mutateAsync(notification);
      toast.success('اعلان خوانده شد.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'خوانده کردن اعلان انجام نشد.'));
    }
  };

  const handleArchive = async (notification: Notification) => {
    try {
      await archive.mutateAsync(notification);
      toast.success('اعلان بایگانی شد.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'بایگانی اعلان انجام نشد.'));
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: { xs: 340, sm: 430 }, maxWidth: 'calc(100vw - 24px)' } } }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography sx={{ fontWeight: 700 }}>اعلان‌ها</Typography>
      </Box>
      <Divider />
      {query.isLoading && (
        <Stack sx={{ py: 4, alignItems: 'center' }}>
          <CircularProgress size={24} />
        </Stack>
      )}
      {query.isError && (
        <Alert severity="error" sx={{ m: 2 }}>دریافت اعلان‌ها انجام نشد.</Alert>
      )}
      {!query.isLoading && !query.isError && !query.data?.data.length && (
        <Typography color="text.secondary" sx={{ p: 2 }}>اعلان جدیدی وجود ندارد.</Typography>
      )}
      <List dense disablePadding>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            divider
            sx={{ alignItems: 'flex-start', bgcolor: isUnread(notification) ? 'action.hover' : 'background.paper' }}
          >
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: isUnread(notification) ? 700 : 500 }} noWrap>{notification.title}</Typography>
                  <Chip
                    size="small"
                    color={getNotificationPriorityColor(notification.priority)}
                    label={getNotificationPriorityLabel(notification.priority)}
                  />
                </Stack>
              }
              secondary={
                <Stack spacing={1} sx={{ mt: 0.5 }}>
                  {notification.body && (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                      {notification.body}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatNotificationDate(notification.createdAt)}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Button size="small" onClick={() => handleOpen(notification)}>مشاهده</Button>
                    {canManage && isUnread(notification) && (
                      <Button size="small" onClick={() => handleMarkRead(notification)}>خوانده شد</Button>
                    )}
                    {canManage && (
                      <Button size="small" color="warning" onClick={() => handleArchive(notification)}>بایگانی</Button>
                    )}
                  </Stack>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <Button fullWidth onClick={() => { navigate('/notifications'); onClose(); }}>
          مشاهده همه اعلان‌ها
        </Button>
      </Box>
    </Menu>
  );
}
