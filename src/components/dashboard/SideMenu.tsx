import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import KeyIcon from '@mui/icons-material/Key';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';

import { can, canAny } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { appTokens } from '@/theme/tokens';

const drawerWidth = appTokens.layout.drawerWidth;
const rtlDrawerAnchor = 'left';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderInlineEnd: `1px solid ${theme.palette.divider}`,
  },
}));

const menuItems = [
  { group: 'عملیات فروش', text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { group: 'عملیات فروش', text: 'شرکت‌ها', icon: <BusinessIcon />, path: '/companies' },
  { group: 'عملیات فروش', text: 'فرصت‌ها', icon: <WorkIcon />, path: '/opportunities', permission: 'opportunity:view', fallbackRoles: ['ADMIN', 'MANAGER', 'REP', 'BOARDS'] },
  { group: 'عملیات فروش', text: 'پایپ‌لاین', icon: <ViewKanbanIcon />, path: '/pipeline' },
  { group: 'عملیات فروش', text: 'کارها', icon: <AssignmentIcon />, path: '/tasks', permission: 'task:view', fallbackRoles: ['ADMIN', 'MANAGER', 'REP', 'BOARDS'] },
  { group: 'عملیات فروش', text: 'جلسات', icon: <EventIcon />, path: '/meetings', permission: 'meeting:view', fallbackRoles: [] },
  { group: 'عملیات فروش', text: 'پیگیری‌ها', icon: <NotificationsActiveIcon />, path: '/follow-ups' },
  { group: 'عملیات فروش', text: 'اعلان‌ها', icon: <NotificationsIcon />, path: '/notifications', permission: 'notification:view', fallbackRoles: ['ADMIN'] },
  { group: 'عملیات فروش', text: 'افراد', icon: <PeopleIcon />, path: '/people', peopleOnly: true },
  { group: 'عملیات فروش', text: 'گزارش‌ها', icon: <AssessmentIcon />, path: '/reports', reportOnly: true },
  { group: 'مدیریت', text: 'کاربران', icon: <PeopleIcon />, path: '/admin/users', permission: 'user:manage' },
  { group: 'مدیریت', text: 'تیم‌ها', icon: <GroupsIcon />, path: '/admin/teams', permissions: ['team:view', 'team:manage'] },
  { group: 'مدیریت', text: 'سازمان‌ها', icon: <CorporateFareIcon />, path: '/admin/organizations', permission: 'organization:manage' },
  { group: 'مدیریت', text: 'ورود سازمانی', icon: <LoginIcon />, path: '/admin/sso-providers', permissions: ['sso-provider:view', 'sso-provider:manage'] },
  { group: 'مدیریت', text: 'نقش‌ها و مجوزها', icon: <SecurityIcon />, path: '/admin/permissions', permissions: ['permission:view', 'permission:manage', 'role:view', 'role:manage'] },
  {
    group: 'مدیریت',
    text: 'کتابخانه‌ها',
    icon: <LibraryBooksIcon />,
    path: '/admin/libraries',
    permissions: [
      'library:industry:manage',
      'library:pain-point:manage',
      'library:use-case:manage',
      'library:persona:manage',
      'library:lead-source:manage',
      'lookup:manage',
      'library:university:manage',
      'product:view',
      'product:manage',
    ],
  },
  {
    group: 'مدیریت',
    text: 'تنظیمات پایپ‌لاین',
    icon: <ViewKanbanIcon />,
    path: '/admin/pipeline',
    permissions: ['pipeline:config:manage', 'pipeline:transition:manage'],
  },
  { group: 'مدیریت', text: 'لاگ تغییرات', icon: <HistoryIcon />, path: '/admin/audit-logs', permission: 'audit-log:view' },
  { group: 'حساب', text: 'امنیت حساب', icon: <KeyIcon />, path: '/account/security' },
];

interface SideMenuProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ mobileOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const canViewReports = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const canViewPeople = can(user, 'people:directory:view');

  const visibleMenuItems = menuItems.filter(
    (item) =>
      (!item.reportOnly || canViewReports) &&
      (!item.peopleOnly || canViewPeople) &&
      (!item.permission || can(user, item.permission, item.fallbackRoles ?? ['ADMIN'])) &&
      (!item.permissions || canAny(user, item.permissions, ['ADMIN']))
  );
  const groups = Array.from(new Set(visibleMenuItems.map((item) => item.group)));

  const isSelected = (path: string) =>
    location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(`${path}/`));

  const menuContent = (
    <>
      <Toolbar />
      <List sx={{ mt: 1 }}>
        {groups.map((group, index) => (
          <List
            key={group}
            disablePadding
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent', lineHeight: 2.5 }}>
                {group}
              </ListSubheader>
            }
          >
            {index > 0 && <Divider sx={{ mx: 2, mb: 1 }} />}
            {visibleMenuItems.filter((item) => item.group === group).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isSelected(item.path)}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    justifyContent: 'flex-start',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
      </List>
    </>
  );

  return (
    <>
      <StyledDrawer
        variant="temporary"
        anchor={rtlDrawerAnchor}
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        anchor={rtlDrawerAnchor}
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {menuContent}
      </StyledDrawer>
    </>
  );
}
