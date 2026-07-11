import { Alert } from '@mui/material';
import { useCurrentOrganization } from '../hooks/useCurrentOrganization';
import { getOrganizationStatusAlertText } from '../utils/organizationDisplay';

export default function OrganizationStatusAlert() {
  const query = useCurrentOrganization();
  const text = query.data ? getOrganizationStatusAlertText(query.data.status) : null;

  if (!text) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      {text}
    </Alert>
  );
}
