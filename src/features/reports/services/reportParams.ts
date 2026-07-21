import type { AdvancedReportFilters, PeriodComparisonFilters } from '../types/report.types';

export type ReportParamSource = AdvancedReportFilters | PeriodComparisonFilters;
export type ReportParamKey = keyof AdvancedReportFilters | keyof PeriodComparisonFilters;
export const commonKeys: ReportParamKey[] = ['ownershipScope','companyIds','startDate','endDate','userIds','teams','ownerIds','stages','priorities','industries','leadSources','activityTypes'];
export const overviewKeys = commonKeys;
export const endpointFilterKeys = {
  dashboard: [...commonKeys,'meetingStatuses','meetingModes','taskStatuses','productIds','categories','salesChannels'],
  forecast: ['startDate','endDate','ownershipScope','companyIds','ownerIds','teams','stages','priorities','industries','leadSources'],
  aging: ['ownershipScope','companyIds','ownerIds','teams','stages','priorities','industries','leadSources','page','limit'],
  meetings: ['startDate','endDate','ownershipScope','companyIds','userIds','teams','meetingStatuses','meetingModes'],
  tasks: ['startDate','endDate','ownershipScope','companyIds','userIds','teams','priorities','taskStatuses'],
  financial: ['startDate','endDate','ownershipScope','companyIds','ownerIds','teams'],
  products: ['startDate','endDate','ownershipScope','companyIds','ownerIds','teams','productIds','categories','salesChannels'],
  exchange: ['startDate','endDate','productIds','categories','page','limit'],
  dataQuality: ['ownershipScope','companyIds','ownerIds','teams','entityTypes','severities','ruleKeys'],
  dataQualityIssues: ['ownershipScope','companyIds','ownerIds','teams','ruleKey','page','limit'],
  comparison: ['startDate','endDate','comparisonMode','compareStartDate','compareEndDate','ownershipScope','companyIds','ownerIds','teams'],
} as const satisfies Record<string, readonly ReportParamKey[]>;

export function selectReportFilters<T extends ReportParamSource>(filters: T, keys: readonly ReportParamKey[]): Partial<T> {
  return Object.fromEntries(keys.flatMap((key) => { const value = (filters as Record<string, unknown>)[key]; return value === undefined || value === '' || (Array.isArray(value) && !value.length) ? [] : [[key, value]]; })) as Partial<T>;
}

export function serializeReportParams(filters: ReportParamSource, keys: readonly ReportParamKey[]): Record<string, unknown> {
  const selected = selectReportFilters(filters, keys) as Record<string, unknown>;
  if (selected.leadSources) { selected.sources = selected.leadSources; delete selected.leadSources; }
  return selected;
}

export function comparisonParams(filters: PeriodComparisonFilters): PeriodComparisonFilters {
  const selected = selectReportFilters(filters, endpointFilterKeys.comparison);
  if (selected.comparisonMode !== 'CUSTOM') { delete selected.compareStartDate; delete selected.compareEndDate; }
  return selected;
}
