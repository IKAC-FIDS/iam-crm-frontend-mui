import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'داشبورد',
  companies: 'شرکت‌ها',
  people: 'اشخاص',
  notifications: 'اعلان‌ها',
  activities: 'فعالیت‌ها',
  'call-card': 'Call Card',
  import: 'واردات SAM',
  settings: 'تنظیمات',
};

export default function Header() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[0] || 'dashboard';
  const pageTitle =
    currentPage === 'companies' && pathSegments[1]
      ? 'جزئیات شرکت'
      : breadcrumbMap[currentPage] || 'داشبورد';

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Typography variant="h4" component="h1">
        {pageTitle}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 0.5 }}>
        <Link underline="hover" color="inherit" href="/">
          خانه
        </Link>
        <Typography color="text.primary">{pageTitle}</Typography>
      </Breadcrumbs>
    </Box>
  );
}
