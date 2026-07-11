import { Alert, Box, Stack, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import OrganizationsTable from '../components/OrganizationsTable';

export default function AdminOrganizationsPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'organization:manage', ['ADMIN']);

  if (!allowed) {
    return <Alert severity="warning">دسترسی مدیریت سازمان‌ها فعال نیست.</Alert>;
  }

  return (
    <Box>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">مدیریت سازمان‌ها</Typography>
        <Typography color="text.secondary">
          مدیریت سازمان‌ها برای زیرساخت چندسازمانی سامانه
        </Typography>
      </Stack>
      <OrganizationsTable />
    </Box>
  );
}
