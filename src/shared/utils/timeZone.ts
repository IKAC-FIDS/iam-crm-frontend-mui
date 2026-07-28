export const DEFAULT_DISPLAY_TIME_ZONE = 'Asia/Tehran';

export interface EffectiveTimeZoneOptions {
  preferredTimeZone?: string | null;
  organizationTimeZone?: string | null;
}

export function isValidTimeZone(value?: string | null): value is string {
  if (!value?.trim()) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function browserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

export function getEffectiveTimeZone(options: EffectiveTimeZoneOptions = {}): string {
  if (isValidTimeZone(options.preferredTimeZone)) return options.preferredTimeZone;
  const browser = browserTimeZone();
  if (isValidTimeZone(browser)) return browser;
  if (isValidTimeZone(options.organizationTimeZone)) return options.organizationTimeZone;
  return DEFAULT_DISPLAY_TIME_ZONE;
}
