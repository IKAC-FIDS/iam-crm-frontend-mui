import type { ActivityType } from '../types/activity.types';

const activityTypeLabels: Record<ActivityType, string> = {
  CALL: 'تماس تلفنی',
  EMAIL: 'ایمیل',
  LINKEDIN_MESSAGE: 'پیام لینکدین',
  LINKEDIN_ENGAGEMENT: 'تعامل لینکدین',
  MEETING: 'جلسه',
  NOTE: 'یادداشت',
  STAGE_CHANGE: 'تغییر مرحله فرصت',
};

// These are the labels used by the legacy/default pipeline seed. Dynamic labels
// should be preferred whenever a caller has them available.
const defaultStageLabels: Record<string, string> = {
  LEAD: 'سرنخ',
  CONTACTED: 'تماس گرفته شده',
  INTERESTED: 'علاقه‌مند',
  QUALIFIED: 'واجد شرایط',
  NEEDS_ASSESSMENT: 'نیازسنجی',
  PENDING_PRE_INVOICE_APPROVAL: 'در انتظار تأیید پیش‌فاکتور',
  POC_PILOT_SCHEDULED: 'پایلوت زمان‌بندی شده',
  POC_PILOT_IN_PROGRESS: 'پایلوت در حال اجرا',
  PENDING_POC_PILOT_APPROVAL: 'در انتظار تأیید پایلوت',
  PENDING_PAYMENT_INVOICE_APPROVAL: 'در انتظار تأیید فاکتور پرداخت',
  INSTALLATION_SCHEDULED: 'نصب زمان‌بندی شده',
  INSTALLATION_IN_PROGRESS: 'نصب در حال اجرا',
  PENDING_CUSTOMER_ACCEPTANCE: 'در انتظار پذیرش مشتری',
  DONE: 'انجام شده',
  ON_HOLD: 'متوقف شده',
  LOST: 'از دست رفته',
  NO_RESPONSE: 'بدون پاسخ',
};

export function getActivityTypeLabel(type?: string | null): string {
  if (!type) return 'فعالیت';
  if (type in activityTypeLabels) return activityTypeLabels[type as ActivityType];
  return 'فعالیت';
}

export function getStageLabel(code?: string | null, labels?: ReadonlyMap<string, string>): string | undefined {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) return undefined;
  return labels?.get(normalized) ?? defaultStageLabels[normalized] ?? 'مرحله نامشخص';
}

export interface StageTransitionDisplay {
  from: string;
  to: string;
}

export function getStageTransitionDisplay(title?: string | null, labels?: ReadonlyMap<string, string>): StageTransitionDisplay | null {
  if (!title) return null;
  const parts = title.split(/\s*(?:->|→|←)\s*/u);
  if (parts.length !== 2) return null;
  const from = getStageLabel(parts[0], labels);
  const to = getStageLabel(parts[1], labels);
  return from && to ? { from, to } : null;
}

export function getActivityTitle(type?: string | null, title?: string | null): string {
  if (type === 'STAGE_CHANGE') return getActivityTypeLabel(type);
  const trimmed = title?.trim();
  if (trimmed && trimmed !== type && !/^[A-Z][A-Z0-9_]*$/u.test(trimmed)) return trimmed;
  return getActivityTypeLabel(type);
}
