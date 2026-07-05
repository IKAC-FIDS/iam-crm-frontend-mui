import { COMPANY_SOCIAL_PLATFORM_OPTIONS } from '../types/companySocialChannel.types';
import type { CompanySocialPlatform } from '../types/companySocialChannel.types';

export function getCompanySocialPlatformLabel(platform?: CompanySocialPlatform | null): string {
  return COMPANY_SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ?? '—';
}

export function isLikelyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatSocialHandle(_platform: CompanySocialPlatform, handle: string): string {
  return handle.trim() || '—';
}

export function canOpenSocialHandle(platform: CompanySocialPlatform, handle: string): boolean {
  return ['WEBSITE', 'LINKEDIN', 'INSTAGRAM', 'YOUTUBE', 'APARAT'].includes(platform)
    && isLikelyUrl(handle);
}
