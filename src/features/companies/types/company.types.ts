export const COMPANY_STAGES = [
  'LEAD',
  'CONTACTED',
  'INTERESTED',
  'QUALIFIED',
  'NEEDS_ASSESSMENT',
  'PENDING_PRE_INVOICE_APPROVAL',
  'POC_PILOT_SCHEDULED',
  'POC_PILOT_IN_PROGRESS',
  'PENDING_POC_PILOT_APPROVAL',
  'PENDING_PAYMENT_INVOICE_APPROVAL',
  'INSTALLATION_SCHEDULED',
  'INSTALLATION_IN_PROGRESS',
  'PENDING_CUSTOMER_ACCEPTANCE',
  'DONE',
  'ON_HOLD',
  'LOST',
  'NO_RESPONSE',
] as const;

export const COMPANY_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'STRATEGIC'] as const;
export const COMPANY_OWNERSHIPS = [
  'PRIVATE',
  'STATE',
  'SEMI_STATE',
  'PUBLIC_LISTED',
  'BANK',
  'HOLDING',
] as const;
export const COMPANY_PAGE_SIZES = [5, 10, 20] as const;

export type PipelineStage = (typeof COMPANY_STAGES)[number];
export type Priority = (typeof COMPANY_PRIORITIES)[number];
export type CompanyStage = PipelineStage;
export type CompanyPriority = Priority;
export type CompanyOwnership = (typeof COMPANY_OWNERSHIPS)[number];
export type CompanyPageSize = (typeof COMPANY_PAGE_SIZES)[number];

export interface CompanyOwner {
  id: string;
  fullName: string;
  email?: string;
  team?: string;
  role?: string;
}

export interface Company {
  id: string;
  legalName: string;
  brandName?: string | null;
  industry?: string | null;
  ownership?: CompanyOwnership | string | null;
  stage?: CompanyStage | string | null;
  priority?: CompanyPriority | string | null;
  owner?: CompanyOwner | null;
  headOfficeCity?: string | null;
  website?: string | null;
  source?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  people?: unknown[];
  branches?: unknown[];
  socialChannels?: unknown[];
  callCard?: unknown | null;
  activities?: unknown[];
  stageHistory?: unknown[];
}

export type CompanyListItem = Pick<
  Company,
  | 'id'
  | 'legalName'
  | 'brandName'
  | 'industry'
  | 'stage'
  | 'priority'
  | 'owner'
  | 'headOfficeCity'
  | 'updatedAt'
>;

export interface UpdateCompanyPayload {
  legalName?: string;
  brandName?: string;
  industry?: string;
  priority?: CompanyPriority;
  headOfficeCity?: string;
  website?: string;
  source?: string;
  ownerId?: string;
}

export interface ChangeCompanyStagePayload {
  stage: CompanyStage;
}

export interface ChangeCompanyOwnerPayload {
  newOwnerId: string;
}

export interface CreateCompanyPayload {
  legalName: string;
  brandName?: string;
  industry?: string;
  ownership?: CompanyOwnership;
  priority?: CompanyPriority;
  headOfficeCity?: string;
  website?: string;
  source?: string;
  ownerId?: string;
}

export interface GetCompaniesParams {
  page: number;
  limit: CompanyPageSize;
  stage?: CompanyStage;
  priority?: CompanyPriority;
  withoutOwner?: boolean;
  search?: string;
  ownerId?: string;
}

export type CompaniesQueryParams = GetCompaniesParams;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

export const companyStageLabels: Record<CompanyStage, string> = {
  LEAD: 'سرنخ',
  CONTACTED: 'تماس گرفته‌شده',
  INTERESTED: 'علاقه‌مند',
  QUALIFIED: 'واجد شرایط',
  NEEDS_ASSESSMENT: 'نیازمند ارزیابی',
  PENDING_PRE_INVOICE_APPROVAL: 'در انتظار تأیید پیش‌فاکتور',
  POC_PILOT_SCHEDULED: 'پایلوت برنامه‌ریزی‌شده',
  POC_PILOT_IN_PROGRESS: 'پایلوت در حال اجرا',
  PENDING_POC_PILOT_APPROVAL: 'در انتظار تأیید پایلوت',
  PENDING_PAYMENT_INVOICE_APPROVAL: 'در انتظار تأیید فاکتور پرداخت',
  INSTALLATION_SCHEDULED: 'نصب برنامه‌ریزی‌شده',
  INSTALLATION_IN_PROGRESS: 'نصب در حال انجام',
  PENDING_CUSTOMER_ACCEPTANCE: 'در انتظار تأیید مشتری',
  DONE: 'انجام‌شده',
  ON_HOLD: 'متوقف‌شده',
  LOST: 'از دست رفته',
  NO_RESPONSE: 'بدون پاسخ',
};

export const companyPriorityLabels: Record<CompanyPriority, string> = {
  LOW: 'کم',
  MEDIUM: 'متوسط',
  HIGH: 'زیاد',
  STRATEGIC: 'استراتژیک',
};

export const companyOwnershipLabels: Record<CompanyOwnership, string> = {
  PRIVATE: 'خصوصی',
  STATE: 'دولتی',
  SEMI_STATE: 'نیمه‌دولتی',
  PUBLIC_LISTED: 'بورسی',
  BANK: 'بانک',
  HOLDING: 'هلدینگ',
};

export function isCompanyStage(value: string): value is CompanyStage {
  return COMPANY_STAGES.some((stage) => stage === value);
}

export function isCompanyPriority(value: string): value is CompanyPriority {
  return COMPANY_PRIORITIES.some((priority) => priority === value);
}

export function isCompanyOwnership(value: string): value is CompanyOwnership {
  return COMPANY_OWNERSHIPS.some((ownership) => ownership === value);
}
