import BusinessIcon from '@mui/icons-material/Business';
import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useCurrentOrganization } from '../hooks/useCurrentOrganization';
import {
  getOrganizationStatusColor,
  getOrganizationStatusLabel,
} from '../utils/organizationDisplay';

export default function CurrentOrganizationBadge() {
  const query = useCurrentOrganization();

  if (query.fetchStatus === 'idle' && !query.data) return null;

  if (query.isLoading) {
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
        <CircularProgress size={16} color="inherit" />
        <Typography variant="body2" color="inherit">در حال دریافت سازمان...</Typography>
      </Stack>
    );
  }

  if (query.isError) {
    return (
      <Typography variant="body2" color="inherit" sx={{ opacity: 0.85, display: { xs: 'none', md: 'block' } }}>
        سازمان نامشخص
      </Typography>
    );
  }

  const organization = query.data;
  if (!organization) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        minWidth: 0,
        maxWidth: { xs: 120, sm: 260, md: 360 },
        px: { xs: 0.5, sm: 1 },
      }}
    >
      <BusinessIcon fontSize="small" sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="caption" color="inherit" sx={{ opacity: 0.75, lineHeight: 1 }}>
          سازمان
        </Typography>
        <Typography variant="body2" color="inherit" noWrap sx={{ lineHeight: 1.25 }}>
          {organization.name}
          {organization.code ? ` (${organization.code})` : ''}
        </Typography>
      </Box>
      <Typography variant="body2" color="inherit" noWrap sx={{ display: { xs: 'block', sm: 'none' }, maxWidth: 96 }}>
        {organization.name}
      </Typography>
      {organization.status !== 'ACTIVE' && (
        <Chip
          size="small"
          color={getOrganizationStatusColor(organization.status)}
          label={getOrganizationStatusLabel(organization.status)}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        />
      )}
    </Stack>
  );
}
