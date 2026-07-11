import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import AppNavbar from '@/components/dashboard/AppNavbar';
import SideMenu from '@/components/dashboard/SideMenu';
import OrganizationStatusAlert from '@/features/organizations/components/OrganizationStatusAlert';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', direction: 'rtl', minHeight: '100vh' }}>
      <CssBaseline />
      <AppNavbar onOpenNavigation={() => setMobileMenuOpen(true)} />
      <SideMenu
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: 'auto',
          backgroundColor: (theme) => theme.palette.background.default,
          textAlign: 'right',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <OrganizationStatusAlert />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
