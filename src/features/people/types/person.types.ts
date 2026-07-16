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

export interface PersonEmploymentPosition {
  id: string;
  employmentHistoryId: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
}

export interface PersonEmploymentHistory {
  id: string;
  personId: string;
  companyId: string;
  company?: import('@/features/companies/types/company.types').CompanySummary;
  positions?: PersonEmploymentPosition[];
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonEmploymentHistoryPayload {
  companyId: string;
  description?: string;
}

export type UpdatePersonEmploymentHistoryPayload = Partial<CreatePersonEmploymentHistoryPayload>;

export interface CreatePersonEmploymentPositionPayload {
  title: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export type UpdatePersonEmploymentPositionPayload = Partial<CreatePersonEmploymentPositionPayload>;

export const PERSON_EDUCATION_DEGREE_OPTIONS = [
  { value: 'DIPLOMA', label: 'دیپلم' },
  { value: 'ASSOCIATE', label: 'کاردانی' },
  { value: 'BACHELOR', label: 'کارشناسی' },
  { value: 'PHD', label: 'دکتری' },
  { value: 'POSTDOC', label: 'پسا دکتری' },
] as const;
export type PersonEducationDegree = (typeof PERSON_EDUCATION_DEGREE_OPTIONS)[number]['value'];

export interface PersonEducationUniversity {
  id: string;
  name: string;
}

export interface PersonEducationHistory {
  id: string;
  personId: string;
  degree?: PersonEducationDegree | null;
  degreeLabel?: string | null;
  universityId?: string | null;
  university?: PersonEducationUniversity | null;
  universityNameSnapshot?: string | null;
  educationDate?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonEducationHistoryPayload {
  degree?: PersonEducationDegree;
  universityId?: string;
  educationDate?: string;
  description?: string;
}

export type UpdatePersonEducationHistoryPayload = Partial<CreatePersonEducationHistoryPayload>;

export function getPersonEducationDegreeLabel(value?: PersonEducationDegree | null): string {
  return PERSON_EDUCATION_DEGREE_OPTIONS.find((option) => option.value === value)?.label ?? '—';
}

export interface Person {
  id: string;
  companyId: string;
  fullName: string;
  /** Backend persistence field kept for compatibility; use jobTitle in UI code. */
  title?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  /** Backend persistence field kept for compatibility; use personaRole in UI code. */
  personaTag?: string | null;
  personaRole?: string | null;
  seniorityLevel?: string | null;
  // linkedinUrl?: string | null;
  // email?: string | null;
  // phone?: string | null;
  isPrimaryContact?: boolean;
  isSecondaryContact?: boolean;
  createdAt?: string;
  updatedAt?: string;
  contacts?: PersonContact[];
  socials?: PersonSocial[];
  employmentHistory?: PersonEmploymentHistory[];
  educationHistory?: PersonEducationHistory[];
}

export interface PersonDirectoryCompany {
  id: string;
  legalName: string;
  brandName?: string | null;
  owner?: { id: string; fullName: string; team?: string | null } | null;
}

export interface DirectoryPerson extends Omit<Person, 'contacts' | 'socials'> {
  company?: PersonDirectoryCompany | null;
  owner?: { id: string; fullName: string; team?: string | null } | null;
  contacts?: Array<Pick<PersonContact, 'id' | 'type' | 'value' | 'isPrimary'>>;
  socials?: Array<Pick<PersonSocial, 'id' | 'platform' | 'handle'>>;
  emailSummary?: string | null;
  phoneSummary?: string | null;
}

export interface CreatePersonPayload {
  companyId: string;
  fullName: string;
  title?: string;
  jobTitle?: string;
  department?: string;
  personaTag?: string;
  personaRole?: string;
  seniorityLevel?: string;
  // linkedinUrl?: string;
  // email?: string;
  // phone?: string;
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

export interface PeopleDirectoryParams {
  page: number;
  limit: 5 | 10 | 20 | 50;
  search?: string;
  companyId?: string;
  ownerId?: string;
  team?: string;
  department?: string;
  jobTitle?: string;
  personaTag?: string;
  personaRole?: string;
  seniorityLevel?: string;
  isPrimaryContact?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
}

export function getContactTypeLabel(type?: string | null): string {
  return PERSON_CONTACT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? '—';
}

export function getSocialPlatformLabel(platform?: string | null): string {
  return PERSON_SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ?? '—';
}
