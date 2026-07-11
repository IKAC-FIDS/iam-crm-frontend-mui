import { useState } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useUnreadNotificationCount } from '../hooks/useNotifications';
import NotificationMenu from './NotificationMenu';

export default function NotificationBell() {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'notification:view', ['ADMIN']);
  const canManage = can(user, 'notification:manage', ['ADMIN']);
  const count = useUnreadNotificationCount(canView);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!canView) return null;

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="اعلان‌ها"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Badge color="error" badgeContent={count.data?.total ?? 0} max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        canManage={canManage}
      />
    </>
  );
}
