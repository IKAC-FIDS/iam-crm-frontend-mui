import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { AccountCircle, Logout, Menu as MenuIcon, Settings } from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '@/features/notifications/components/NotificationBell';
import CurrentOrganizationBadge from '@/features/organizations/components/CurrentOrganizationBadge';
import { authService } from '@/features/auth/services/auth.service';

interface AppNavbarProps {
  onOpenNavigation: () => void;
}

export default function AppNavbar({ onOpenNavigation }: AppNavbarProps) {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleSecurity = () => {
    handleClose();
    navigate('/account/security');
  };
  const handleLogout = async () => {
    handleClose();
    try {
      await authService.logout();
    } finally {
      clearUser();
      navigate('/login', { replace: true });
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="باز کردن منوی اصلی"
          onClick={onOpenNavigation}
          edge="start"
          sx={{ display: { md: 'none' }, marginInlineEnd: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IAM CRM
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <CurrentOrganizationBadge />
          <NotificationBell />
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ marginInlineEnd: 1 }} /> پروفایل
            </MenuItem>
            <MenuItem onClick={handleSecurity}>
              <Settings sx={{ marginInlineEnd: 1 }} /> امنیت حساب
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ marginInlineEnd: 1 }} /> خروج
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

