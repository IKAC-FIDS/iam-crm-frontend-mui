export const PERSON_CONTACT_TYPE_OPTIONS = [
  { value: 'MOBILE', label: 'موبایل' },
  { value: 'WORK', label: 'تلفن کاری' },
  { value: 'PERSONAL_EMAIL', label: 'ایمیل شخصی' },
  { value: 'WORK_EMAIL', label: 'ایمیل کاری' },
  { value: 'OTHER', label: 'سایر' },
] as const;

export const PERSON_SOCIAL_PLATFORM_OPTIONS = [
  { value: 'LINKEDIN', label: 'لینکدین' },
  { value: 'INSTAGRAM', label: 'اینستاگرام' },
  { value: 'TELEGRAM', label: 'تلگرام' },
  { value: 'BALE', label: 'بله' },
  { value: 'EITAA', label: 'ایتا' },
  { value: 'SOROUSH', label: 'سروش' },
  { value: 'ROOBIKA', label: 'روبیکا' },
  { value: 'APARAT', label: 'آپارات' },
  { value: 'YOUTUBE', label: 'یوتیوب' },
  { value: 'WEBSITE', label: 'وب‌سایت' },
  { value: 'OTHER', label: 'سایر' },
] as const;

export type PersonContactType = (typeof PERSON_CONTACT_TYPE_OPTIONS)[number]['value'];
export type PersonSocialPlatform = (typeof PERSON_SOCIAL_PLATFORM_OPTIONS)[number]['value'];

export interface PersonContact {
  id: string;
  personId: string;
  type: PersonContactType | string;
  value: string;
  note?: string | null;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePersonContactPayload {
  type: PersonContactType;
  value: string;
  note?: string;
  isPrimary?: boolean;
}

export type UpdatePersonContactPayload = Partial<CreatePersonContactPayload>;

export interface PersonSocial {
  id: string;
  personId: string;
  platform: PersonSocialPlatform | string;
  handle: string;
  note?: string | null;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePersonSocialPayload {
  platform: PersonSocialPlatform;
  handle: string;
  note?: string;
  isPrimary?: boolean;
}

export type UpdatePersonSocialPayload = Partial<CreatePersonSocialPayload>;

export interface Person {
  id: string;
  companyId: string;
  fullName: string;
  title?: string | null;
  department?: string | null;
  personaTag?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  isPrimaryContact?: boolean;
  isSecondaryContact?: boolean;
  createdAt?: string;
  updatedAt?: string;
  contacts?: PersonContact[];
  socials?: PersonSocial[];
}

export interface CreatePersonPayload {
  companyId: string;
  fullName: string;
  title?: string;
  department?: string;
  personaTag?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  isPrimaryContact?: boolean;
  isSecondaryContact?: boolean;
  contacts?: CreatePersonContactPayload[];
  socials?: CreatePersonSocialPayload[];
}

export type UpdatePersonPayload = Partial<
  Omit<CreatePersonPayload, 'companyId' | 'contacts' | 'socials'>
>;

export interface GetPeopleParams {
  companyId: string;
  page: number;
  limit: 5 | 10 | 20 | 100;
}

export function getContactTypeLabel(type?: string | null): string {
  return PERSON_CONTACT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? '—';
}

export function getSocialPlatformLabel(platform?: string | null): string {
  return PERSON_SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ?? '—';
}
