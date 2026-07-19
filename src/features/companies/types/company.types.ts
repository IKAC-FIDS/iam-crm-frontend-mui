import type { OwnershipScope } from '@/shared/types/ownership';

export const COMPANY_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'STRATEGIC'] as const;
export const COMPANY_OWNERSHIPS = [
  'PRIVATE',
  'STATE',
  'SEMI_STATE',
  'PUBLIC_LISTED',
  'BANK',
  'HOLDING',
] as const;
export const COMPANY_PAGE_SIZES = [5, 10, 20, 50, 100] as const;
export const COMPANY_ACTIVITY_STATUSES = ['ACTIVE', 'INACTIVE', 'MERGED', 'UNKNOWN'] as const;
export const COMPANY_LEGAL_DOCUMENT_TYPES = ['OFFICIAL_GAZETTE', 'LATEST_CHANGES'] as const;

export type Priority = (typeof COMPANY_PRIORITIES)[number];
export type CompanyPriority = Priority;
export type CompanyOwnership = (typeof COMPANY_OWNERSHIPS)[number];
export type CompanyPageSize = (typeof COMPANY_PAGE_SIZES)[number];
export type CompanyArchiveStatus = 'ACTIVE' | 'ARCHIVED' | 'ALL';
export type CompanyActivityStatus = (typeof COMPANY_ACTIVITY_STATUSES)[number];
export type CompanyLegalDocumentType = (typeof COMPANY_LEGAL_DOCUMENT_TYPES)[number];

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

export const COMPANY_ACTIVITY_STATUS_OPTIONS: readonly {
  value: CompanyActivityStatus;
  label: string;
}[] = [
  { value: 'ACTIVE', label: 'فعال' },
  { value: 'INACTIVE', label: 'غیر فعال' },
  { value: 'MERGED', label: 'ادغام شده' },
  { value: 'UNKNOWN', label: 'نامشخص' },
];

export const COMPANY_LEGAL_DOCUMENT_TYPE_OPTIONS: readonly {
  value: CompanyLegalDocumentType;
  label: string;
}[] = [
  { value: 'OFFICIAL_GAZETTE', label: 'روزنامه رسمی' },
  { value: 'LATEST_CHANGES', label: 'آخرین تغییرات' },
];

export interface CompanyOwner {
  id: string;
  fullName: string;
  email?: string;
  team?: string;
  role?: string;
}

export interface CompanySummary {
  id: string;
  legalName: string;
  brandName?: string | null;
}

export interface CompanyLegalDocumentAttachment {
  id: string;
  originalFileName?: string | null;
  originalName?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  createdAt?: string | null;
}

export interface CompanyLegalDocument {
  id: string;
  companyId: string;
  type: CompanyLegalDocumentType;
  title: string;
  description?: string | null;
  documentDate?: string | null;
  attachmentId?: string | null;
  fileAttachmentId?: string | null;
  attachment?: CompanyLegalDocumentAttachment | null;
  fileAttachment?: CompanyLegalDocumentAttachment | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  legalName: string;
  brandName?: string | null;
  industry?: string | null;
  ownership?: CompanyOwnership | null;
  /** Legacy backend field kept for response compatibility. Sales pipeline stage belongs to Opportunity. */
  stage?: string | null;
  priority?: Priority | null;
  ownerId?: string | null;
  owner?: CompanyOwner | null;
  headOfficeCity?: string | null;
  website?: string | null;
  source?: string | null;
  registrationNumber?: string | null;
  nationalId?: string | null;
  economicCode?: string | null;
  establishmentDate?: string | null;
  activityStatus?: CompanyActivityStatus | null;
  registeredCapital?: string | number | null;
  employeeCount?: number | null;
  parentCompanyIds?: string[];
  subsidiaryCompanyIds?: string[];
  parentCompanies?: CompanySummary[];
  subsidiaryCompanies?: CompanySummary[];
  legalDocuments?: CompanyLegalDocument[];
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
  registrationNumber?: string;
  nationalId?: string;
  economicCode?: string;
  establishmentDate?: string;
  activityStatus?: CompanyActivityStatus;
  registeredCapital?: string;
  employeeCount?: number;
  parentCompanyIds?: string[];
  subsidiaryCompanyIds?: string[];
}

export interface UploadCompanyLegalDocumentPayload {
  type: CompanyLegalDocumentType;
  title: string;
  description?: string;
  documentDate?: string;
  file: File;
}

export interface UpdateCompanyLegalDocumentPayload {
  type?: CompanyLegalDocumentType;
  title?: string;
  description?: string;
  documentDate?: string;
}

export interface GetCompaniesParams {
  page: number;
  limit: CompanyPageSize;
  priority?: CompanyPriority;
  search?: string;
  ownerId?: string;
  ownershipScope?: OwnershipScope;
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

export const companyPriorityLabels = Object.fromEntries(
  COMPANY_PRIORITY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Priority, string>;

export const companyOwnershipLabels = Object.fromEntries(
  COMPANY_OWNERSHIP_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyOwnership, string>;

export const companyActivityStatusLabels = Object.fromEntries(
  COMPANY_ACTIVITY_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyActivityStatus, string>;

export const companyLegalDocumentTypeLabels = Object.fromEntries(
  COMPANY_LEGAL_DOCUMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyLegalDocumentType, string>;

export function isCompanyPriority(value: string): value is CompanyPriority {
  return COMPANY_PRIORITIES.some((priority) => priority === value);
}

export function isCompanyOwnership(value: string): value is CompanyOwnership {
  return COMPANY_OWNERSHIPS.some((ownership) => ownership === value);
}

export function isCompanyActivityStatus(value: string): value is CompanyActivityStatus {
  return COMPANY_ACTIVITY_STATUSES.some((status) => status === value);
}

export function isCompanyArchived(company: Pick<Company, 'isArchived' | 'archived' | 'archivedAt'>): boolean {
  if (typeof company.isArchived === 'boolean') return company.isArchived;
  if (typeof company.archived === 'boolean') return company.archived;
  return Boolean(company.archivedAt);
}
