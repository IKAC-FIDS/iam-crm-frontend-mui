import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

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
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'شرکت‌ها', icon: <BusinessIcon />, path: '/companies' },
  { text: 'پایپ‌لاین', icon: <ViewKanbanIcon />, path: '/pipeline' },
  { text: 'پیگیری‌ها', icon: <NotificationsActiveIcon />, path: '/follow-ups' },
  { text: 'گزارش‌ها', icon: <AssessmentIcon />, path: '/reports', reportOnly: true },
  { text: 'کاربران', icon: <PeopleIcon />, path: '/admin/users', permission: 'user:manage' },
  { text: 'مجوزها', icon: <SecurityIcon />, path: '/admin/permissions', permission: 'permission:manage' },
  { text: 'کتابخانه‌ها', icon: <LibraryBooksIcon />, path: '/admin/libraries', permission: 'catalog:manage' },
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

  const menuContent = (
    <>
      <Toolbar />
      <List sx={{ mt: 2 }}>
        {menuItems.filter((item) => (!item.reportOnly || canViewReports) && (!item.permission || can(user, item.permission, ['ADMIN']))).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
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
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        anchor="right"
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {menuContent}
      </StyledDrawer>
    </>
  );
}
