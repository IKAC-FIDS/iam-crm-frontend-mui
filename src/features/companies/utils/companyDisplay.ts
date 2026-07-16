import {
  companyOwnershipLabels,
  companyPriorityLabels,
  companyActivityStatusLabels,
  companyLegalDocumentTypeLabels,
  isCompanyActivityStatus,
  COMPANY_LEGAL_DOCUMENT_TYPES,
  isCompanyOwnership,
  isCompanyPriority,
} from '../types/company.types';
import type {
  CompanyActivityStatus,
  CompanyLegalDocumentType,
  CompanyOwnership,
  Priority,
} from '../types/company.types';
import { formatJalaliDate, formatJalaliDateTime } from '@/shared/utils/jalaliDate';

export function getPriorityLabel(priority?: Priority | string | null): string {
  return priority && isCompanyPriority(priority) ? companyPriorityLabels[priority] : '—';
}

export function getOwnershipLabel(
  ownership?: CompanyOwnership | string | null,
): string {
  return ownership && isCompanyOwnership(ownership)
    ? companyOwnershipLabels[ownership]
    : '—';
}

export function getActivityStatusLabel(status?: CompanyActivityStatus | string | null): string {
  return status && isCompanyActivityStatus(status) ? companyActivityStatusLabels[status] : '—';
}

export function getLegalDocumentTypeLabel(type?: CompanyLegalDocumentType | string | null): string {
  return type && COMPANY_LEGAL_DOCUMENT_TYPES.some((item) => item === type)
    ? companyLegalDocumentTypeLabels[type as CompanyLegalDocumentType]
    : '—';
}

export function formatDateTime(value?: string | null): string {
  return formatJalaliDateTime(value);
}

export function formatDate(value?: string | null): string {
  return formatJalaliDate(value);
}

export function formatNumber(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') return '—';
  const number = Number(value);
  return Number.isFinite(number) ? new Intl.NumberFormat('fa-IR').format(number) : String(value);
}
