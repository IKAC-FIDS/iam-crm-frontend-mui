export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'CALL', label: 'تماس' },
  { value: 'EMAIL', label: 'ایمیل' },
  { value: 'LINKEDIN_MESSAGE', label: 'پیام لینکدین' },
  { value: 'LINKEDIN_ENGAGEMENT', label: 'تعامل لینکدین' },
  { value: 'MEETING', label: 'جلسه' },
  { value: 'NOTE', label: 'یادداشت' },
  { value: 'STAGE_CHANGE', label: 'تغییر مرحله' },
] as const;

export const MANUAL_ACTIVITY_TYPE_OPTIONS = ACTIVITY_TYPE_OPTIONS.filter(
  (option) => option.value !== 'STAGE_CHANGE',
);

export type ActivityType = (typeof ACTIVITY_TYPE_OPTIONS)[number]['value'];
export type ManualActivityType = Exclude<ActivityType, 'STAGE_CHANGE'>;

export interface ActivityPerson {
  id: string;
  fullName: string;
  title?: string | null;
  department?: string | null;
}

export interface ActivityUser {
  id: string;
  fullName: string;
  email?: string;
  role?: string;
  team?: string;
}

export interface Activity {
  id: string;
  companyId: string;
  personId?: string | null;
  userId?: string | null;
  type: ActivityType;
  notes?: string | null;
  outcome?: string | null;
  occurredAt?: string | null;
  nextActionDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  person?: ActivityPerson | null;
  user?: ActivityUser | null;
}

export interface CreateActivityPayload {
  companyId: string;
  personId?: string;
  type: ManualActivityType;
  notes?: string;
  outcome?: string;
  occurredAt?: string;
  nextActionDate?: string;
}

export interface UpdateActivityPayload {
  type?: ManualActivityType;
  personId?: string | null;
  notes?: string | null;
  outcome?: string | null;
  occurredAt?: string | null;
  nextActionDate?: string | null;
}

export interface GetActivitiesParams {
  companyId: string;
  page: number;
  limit: 5 | 10 | 20;
}

export function getActivityTypeLabel(type: ActivityType): string {
  return ACTIVITY_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}
