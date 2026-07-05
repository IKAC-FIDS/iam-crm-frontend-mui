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
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    clearUser();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="باز کردن منوی اصلی"
          onClick={onOpenNavigation}
          edge="start"
          sx={{ display: { md: 'none' }, ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IAM CRM
        </Typography>
        <Box>
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }} // منو از چپ
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ ml: 1 }} /> پروفایل
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ ml: 1 }} /> تنظیمات
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ ml: 1 }} /> خروج
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
