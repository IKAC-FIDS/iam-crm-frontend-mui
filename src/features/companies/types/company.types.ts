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
export const COMPANY_PAGE_SIZES = [5, 10, 20] as const;

export type CompanyStage = (typeof COMPANY_STAGES)[number];
export type CompanyPriority = (typeof COMPANY_PRIORITIES)[number];
export type CompanyPageSize = (typeof COMPANY_PAGE_SIZES)[number];

export interface CompanyOwner {
  id: string;
  fullName: string;
}

export interface Company {
  id: string;
  legalName: string;
  brandName?: string | null;
  industry?: string | null;
  stage?: CompanyStage | string | null;
  priority?: CompanyPriority | string | null;
  owner?: CompanyOwner | null;
  headOfficeCity?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface CreateCompanyPayload {
  legalName: string;
  brandName?: string;
  industry?: string;
  priority?: CompanyPriority;
  headOfficeCity?: string;
  website?: string;
  source?: string;
  ownerId?: string;
}

export interface CompaniesQueryParams {
  page: number;
  limit: CompanyPageSize;
  stage?: CompanyStage;
  priority?: CompanyPriority;
  withoutOwner?: boolean;
  search?: string;
  ownerId?: string;
}

export interface CompaniesPageResult {
  items: Company[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

export function isCompanyStage(value: string): value is CompanyStage {
  return COMPANY_STAGES.some((stage) => stage === value);
}

export function isCompanyPriority(value: string): value is CompanyPriority {
  return COMPANY_PRIORITIES.some((priority) => priority === value);
}
