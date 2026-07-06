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
export type CompanyArchiveStatus = 'ACTIVE' | 'ARCHIVED' | 'ALL';

export const COMPANY_STAGE_OPTIONS: readonly { value: PipelineStage; label: string }[] = [
  { value: 'LEAD', label: 'سرنخ' },
  { value: 'CONTACTED', label: 'تماس گرفته شده' },
  { value: 'INTERESTED', label: 'علاقه‌مند' },
  { value: 'QUALIFIED', label: 'واجد شرایط' },
  { value: 'NEEDS_ASSESSMENT', label: 'نیازسنجی' },
  { value: 'PENDING_PRE_INVOICE_APPROVAL', label: 'در انتظار تأیید پیش‌فاکتور' },
  { value: 'POC_PILOT_SCHEDULED', label: 'پایلوت زمان‌بندی شده' },
  { value: 'POC_PILOT_IN_PROGRESS', label: 'پایلوت در حال انجام' },
  { value: 'PENDING_POC_PILOT_APPROVAL', label: 'در انتظار تأیید پایلوت' },
  { value: 'PENDING_PAYMENT_INVOICE_APPROVAL', label: 'در انتظار تأیید فاکتور پرداخت' },
  { value: 'INSTALLATION_SCHEDULED', label: 'نصب زمان‌بندی شده' },
  { value: 'INSTALLATION_IN_PROGRESS', label: 'نصب در حال انجام' },
  { value: 'PENDING_CUSTOMER_ACCEPTANCE', label: 'در انتظار پذیرش مشتری' },
  { value: 'DONE', label: 'انجام شده' },
  { value: 'ON_HOLD', label: 'متوقف شده' },
  { value: 'LOST', label: 'از دست رفته' },
  { value: 'NO_RESPONSE', label: 'بدون پاسخ' },
];

export const COMPANY_PRIORITY_OPTIONS: readonly { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'کم' },
  { value: 'MEDIUM', label: 'متوسط' },
  { value: 'HIGH', label: 'زیاد' },
  { value: 'STRATEGIC', label: 'استراتژیک' },
];

export const COMPANY_OWNERSHIP_OPTIONS: readonly {
  value: CompanyOwnership;
  label: string;
}[] = [
  { value: 'PRIVATE', label: 'خصوصی' },
  { value: 'STATE', label: 'دولتی' },
  { value: 'SEMI_STATE', label: 'نیمه‌دولتی' },
  { value: 'PUBLIC_LISTED', label: 'بورسی' },
  { value: 'BANK', label: 'بانک' },
  { value: 'HOLDING', label: 'هلدینگ' },
];

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
  ownership?: CompanyOwnership | null;
  stage?: PipelineStage | null;
  priority?: Priority | null;
  ownerId?: string | null;
  owner?: CompanyOwner | null;
  headOfficeCity?: string | null;
  website?: string | null;
  source?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  isArchived?: boolean;
  archived?: boolean;
  archivedAt?: string | null;
  archiveReason?: string | null;
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
  | 'isArchived'
  | 'archived'
  | 'archivedAt'
  | 'archiveReason'
>;

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

export interface ChangeCompanyStagePayload {
  stage: CompanyStage;
}

export interface ChangeCompanyOwnerPayload {
  newOwnerId: string;
}

export interface ArchiveCompanyPayload { reason: string }

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
  archiveStatus?: CompanyArchiveStatus;
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

export const companyStageLabels = Object.fromEntries(
  COMPANY_STAGE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<PipelineStage, string>;

export const companyPriorityLabels = Object.fromEntries(
  COMPANY_PRIORITY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Priority, string>;

export const companyOwnershipLabels = Object.fromEntries(
  COMPANY_OWNERSHIP_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyOwnership, string>;

export function isCompanyStage(value: string): value is CompanyStage {
  return COMPANY_STAGES.some((stage) => stage === value);
}

export function isCompanyPriority(value: string): value is CompanyPriority {
  return COMPANY_PRIORITIES.some((priority) => priority === value);
}

export function isCompanyOwnership(value: string): value is CompanyOwnership {
  return COMPANY_OWNERSHIPS.some((ownership) => ownership === value);
}

export function isCompanyArchived(company: Pick<Company, 'isArchived' | 'archived' | 'archivedAt'>): boolean {
  if (typeof company.isArchived === 'boolean') return company.isArchived;
  if (typeof company.archived === 'boolean') return company.archived;
  return Boolean(company.archivedAt);
}
