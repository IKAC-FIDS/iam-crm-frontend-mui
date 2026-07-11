import type { ChipProps } from '@mui/material/Chip';
import type { OrganizationStatus } from '../types/organization.types';

export function getOrganizationStatusLabel(status: OrganizationStatus): string {
  if (status === 'ACTIVE') return 'فعال';
  if (status === 'SUSPENDED') return 'تعلیق‌شده';
  return 'بایگانی‌شده';
}

export function getOrganizationStatusColor(status: OrganizationStatus): ChipProps['color'] {
  if (status === 'ACTIVE') return 'success';
  if (status === 'SUSPENDED') return 'warning';
  return 'default';
}

export function getOrganizationStatusAlertText(status: OrganizationStatus): string | null {
  if (status === 'SUSPENDED') {
    return 'وضعیت سازمان تعلیق‌شده است. ممکن است برخی عملیات‌ها توسط سرور محدود شوند.';
  }

  if (status === 'ARCHIVED') {
    return 'این سازمان بایگانی شده است. ممکن است دسترسی‌ها محدود باشد.';
  }

  return null;
}
