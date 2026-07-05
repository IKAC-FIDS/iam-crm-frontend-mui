import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation } from 'react-router-dom';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'داشبورد',
  companies: 'شرکت‌ها',
  people: 'اشخاص',
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
    <div style={{ width: '100%', padding: '16px 0' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {pageTitle}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ justifyContent: 'flex-end' }}>
        <Link underline="hover" color="inherit" href="/">
          خانه
        </Link>
        <Typography color="text.primary">{pageTitle}</Typography>
      </Breadcrumbs>
    </div>
  );
}
