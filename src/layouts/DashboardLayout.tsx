import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppNavbar from '@/components/dashboard/AppNavbar';
import SideMenu from '@/components/dashboard/SideMenu';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', direction: 'rtl', minHeight: '100vh' }}>
      <CssBaseline />
      <AppNavbar />
      <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // فاصله برای AppBar
          overflow: 'auto',
          backgroundColor: (theme) => theme.palette.background.default,
            textAlign: 'right',
        }}
      >
        <Outlet /> {/* اینجا صفحات مختلف مثل DashboardPage قرار می‌گیرند */}
      </Box>
    </Box>
  );
}
