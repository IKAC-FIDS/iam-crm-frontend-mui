import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import MainGrid from '@/components/dashboard/MainGrid';
import { useAuthStore } from '@/store/authStore';
import { BOARDS_DASHBOARD_PATH } from '@/features/auth/utils/defaultRoute';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'BOARDS') {
    return <Navigate to={BOARDS_DASHBOARD_PATH} replace />;
  }

  return (
    <Box>
      <Header />
      <MainGrid />
    </Box>
  );
}
