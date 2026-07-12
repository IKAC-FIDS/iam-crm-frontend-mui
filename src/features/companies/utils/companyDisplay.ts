import {
  companyOwnershipLabels,
  companyPriorityLabels,
  isCompanyOwnership,
  isCompanyPriority,
} from '../types/company.types';
import type {
  CompanyOwnership,
  Priority,
} from '../types/company.types';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';

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

export function formatDateTime(value?: string | null): string {
  return formatJalaliDateTime(value);
}
