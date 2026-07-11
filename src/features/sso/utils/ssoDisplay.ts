import type { ChipProps } from '@mui/material/Chip';
import type { PublicSsoProvider, SsoProvider, SsoProviderType } from '../types/sso.types';

export const ssoProviderTypeOptions: { value: SsoProviderType; label: string }[] = [
  { value: 'OIDC', label: 'OIDC' },
  { value: 'SAML', label: 'SAML' },
];

export function getSsoProviderTypeLabel(type: SsoProviderType): string {
  return ssoProviderTypeOptions.find((item) => item.value === type)?.label ?? type;
}

export function isSsoProviderActive(provider: SsoProvider | PublicSsoProvider): boolean {
  if (typeof provider.isActive === 'boolean') return provider.isActive;
  return 'status' in provider ? provider.status === 'ACTIVE' : true;
}

export function getSsoProviderStatusLabel(provider: SsoProvider | PublicSsoProvider): string {
  return isSsoProviderActive(provider) ? 'فعال' : 'غیرفعال';
}

export function getSsoProviderStatusColor(provider: SsoProvider | PublicSsoProvider): ChipProps['color'] {
  return isSsoProviderActive(provider) ? 'success' : 'default';
}

export function getSsoProviderDisplayName(provider: SsoProvider | PublicSsoProvider): string {
  return provider.displayName?.trim() || provider.name;
}

export function formatSsoDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function splitCommaList(value: string): string[] {
  return Array.from(new Set(value.split(',').map((item) => item.trim()).filter(Boolean)));
}

export function joinCommaList(value?: string[] | null): string {
  return value?.join(', ') ?? '';
}
