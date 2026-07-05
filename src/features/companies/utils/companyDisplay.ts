import {
  companyOwnershipLabels,
  companyPriorityLabels,
  companyStageLabels,
  isCompanyOwnership,
  isCompanyPriority,
  isCompanyStage,
} from '../types/company.types';
import type {
  CompanyOwnership,
  PipelineStage,
  Priority,
} from '../types/company.types';

export function getStageLabel(stage?: PipelineStage | string | null): string {
  return stage && isCompanyStage(stage) ? companyStageLabels[stage] : '—';
}

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
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
