import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getRouteBreadcrumbs } from '@/routes/routeNavigation';

export default function Header() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const breadcrumbs = getRouteBreadcrumbs(location.pathname, user);
  const pageTitle = breadcrumbs.at(-1)?.label ?? 'داشبورد';

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Typography variant="h4" component="h1">
        {pageTitle}
      </Typography>
      <Breadcrumbs aria-label="مسیر صفحه" sx={{ mt: 0.5 }}>
        {breadcrumbs.map((breadcrumb) => breadcrumb.to ? (
          <Link key={breadcrumb.routeId} component={RouterLink} underline="hover" color="inherit" to={breadcrumb.to}>
            {breadcrumb.label}
          </Link>
        ) : (
          <Typography key={breadcrumb.routeId} color="text.primary" aria-current="page">{breadcrumb.label}</Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
