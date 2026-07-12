import type { ChipProps } from '@mui/material/Chip';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
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

export const organizationStatusOptions: { value: OrganizationStatus; label: string }[] = [
  { value: 'ACTIVE', label: getOrganizationStatusLabel('ACTIVE') },
  { value: 'SUSPENDED', label: getOrganizationStatusLabel('SUSPENDED') },
  { value: 'ARCHIVED', label: getOrganizationStatusLabel('ARCHIVED') },
];

export function formatOrganizationDate(value?: string | null): string {
  return formatJalaliDateTime(value);
}

export function getOrganizationLocaleLabel(locale: string): string {
  if (locale === 'fa-IR') return 'فارسی (ایران)';
  if (locale === 'en-US') return 'English (US)';
  return locale || '—';
}

export function getOrganizationTimezoneLabel(timezone: string): string {
  if (timezone === 'Asia/Tehran') return 'Asia/Tehran';
  if (timezone === 'UTC') return 'UTC';
  return timezone || '—';
}
