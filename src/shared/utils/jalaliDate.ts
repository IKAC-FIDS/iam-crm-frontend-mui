import { isValidJalaaliDate, toGregorian } from 'jalaali-js';
import { getEffectiveTimeZone, type EffectiveTimeZoneOptions } from './timeZone';

export const EMPTY_DATE_LABEL = '—';

const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDateDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = persianDigits.indexOf(char);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = arabicDigits.indexOf(char);
    return arabicIndex >= 0 ? String(arabicIndex) : char;
  });
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const displayLocale = 'fa-IR-u-ca-persian-nu-latn';
function displayParts(value: string | null | undefined, options: EffectiveTimeZoneOptions, includeDate: boolean, includeTime: boolean): string {
  const date = toDate(value);
  if (!date) return EMPTY_DATE_LABEL;
  try {
    const parts = new Intl.DateTimeFormat(displayLocale, {
      calendar: 'persian', timeZone: getEffectiveTimeZone(options), hourCycle: 'h23',
      ...(includeDate ? { year: 'numeric', month: '2-digit', day: '2-digit' } as const : {}),
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } as const : {}),
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
    const dateText = includeDate ? `${part('year')}/${part('month')}/${part('day')}` : '';
    const timeText = includeTime ? `${part('hour')}:${part('minute')}` : '';
    return [dateText, timeText].filter(Boolean).join(' - ') || EMPTY_DATE_LABEL;
  } catch {
    return EMPTY_DATE_LABEL;
  }
}

export function formatUserJalaliDate(value?: string | null, options: EffectiveTimeZoneOptions = {}): string { return displayParts(value, options, true, false); }
export function formatUserJalaliDateTime(value?: string | null, options: EffectiveTimeZoneOptions = {}): string { return displayParts(value, options, true, true); }
export function formatUserTime(value?: string | null, options: EffectiveTimeZoneOptions = {}): string { return displayParts(value, options, false, true); }

export function formatJalaliDate(value?: string | null): string {
  return formatUserJalaliDate(value);
}

export function formatJalaliDateTime(value?: string | null): string {
  return formatUserJalaliDateTime(value);
}

function dateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatRelativeJalaliDateTime(
  value?: string | null,
  options: EffectiveTimeZoneOptions = {},
  now = new Date(),
): string | undefined {
  const date = toDate(value);
  if (!date) return undefined;
  try {
    const timeZone = getEffectiveTimeZone(options);
    const time = new Intl.DateTimeFormat('fa-IR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(date);
    const todayKey = dateKey(now, timeZone);
    const yesterdayKey = dateKey(new Date(now.getTime() - 86_400_000), timeZone);
    const valueKey = dateKey(date, timeZone);
    if (valueKey === todayKey) return `امروز، ${time}`;
    if (valueKey === yesterdayKey) return `دیروز، ${time}`;
    const day = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
    return `${day}، ${time}`;
  } catch {
    return undefined;
  }
}

export function toJalaliInputValue(value?: string | null, includeTime = false): string {
  const date = toDate(value);
  if (!date) return '';
  const jalaliDate = formatJalaliDate(value);
  if (!includeTime) return jalaliDate;
  return `${jalaliDate} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseJalaliInputToIso(value: string, includeTime = false): string | undefined {
  const normalized = normalizeDateDigits(value).trim();
  if (!normalized) return undefined;

  const match = normalized.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?)?$/,
  );
  if (!match) return undefined;

  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  const hour = includeTime ? Number(match[4] ?? 0) : 0;
  const minute = includeTime ? Number(match[5] ?? 0) : 0;

  if (!isValidJalaaliDate(jy, jm, jd) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return undefined;
  }

  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd, hour, minute, 0, 0).toISOString();
}

export function toEndOfDayIso(value?: string): string | undefined {
  const date = toDate(value);
  if (!date) return undefined;
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export function isoToLocalDateTimeInput(value?: string | null): string {
  const date = toDate(value);
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function isoToLocalDateInput(value?: string | null): string {
  const date = toDate(value);
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
