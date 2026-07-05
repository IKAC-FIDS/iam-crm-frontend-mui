export const COMPANY_SOCIAL_PLATFORM_OPTIONS = [
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
] as const;

export type CompanySocialPlatform = (typeof COMPANY_SOCIAL_PLATFORM_OPTIONS)[number]['value'];

export interface CompanySocialChannel {
  id: string;
  companyId: string;
  platform: CompanySocialPlatform;
  handle: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanySocialChannelPayload {
  platform: CompanySocialPlatform;
  handle: string;
}

export type UpdateCompanySocialChannelPayload = Partial<CreateCompanySocialChannelPayload>;
