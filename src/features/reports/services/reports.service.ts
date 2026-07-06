import axiosInstance from '@/lib/axios';
import type {
  ActivityByUserReportItem,
  ActivityReport,
  ConversionRatesReport,
  PipelineByOwnerReportItem,
  PipelineSummaryReport,
  ReportFilterOption,
  ReportFilterOptions,
  ReportFilters,
  StageDurationReportItem,
} from '../types/report.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
}

function option(value: unknown): ReportFilterOption | null {
  if (typeof value === 'string' || typeof value === 'number') return { value: String(value), label: String(value) };
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const rawValue = item.value ?? item.id ?? item.code ?? item.name;
  if (rawValue === undefined || rawValue === null) return null;
  return {
    value: String(rawValue),
    label: String(item.label ?? item.fullName ?? item.name ?? rawValue),
    team: item.team === undefined || item.team === null ? undefined : String(item.team),
  };
}

function options(value: unknown): ReportFilterOption[] {
  return Array.isArray(value) ? value.map(option).filter((item): item is ReportFilterOption => item !== null) : [];
}

function requestParams(filters: ReportFilters): Record<string, string | string[]> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)),
  );
}

async function getList<T>(url: string, filters: ReportFilters): Promise<T[]> {
  const response = await axiosInstance.get<T[] | { data: T[] } | { items: T[] }>(url, { params: requestParams(filters) });
  const payload = unwrap(response.data);
  if (Array.isArray(payload)) return payload;
  return 'items' in payload && Array.isArray(payload.items) ? payload.items : [];
}

export const reportsService = {
  getFilterOptions: async (): Promise<ReportFilterOptions> => {
    const response = await axiosInstance.get<Record<string, unknown> | { data: Record<string, unknown> }>('/reports/filter-options');
    const data = unwrap(response.data);
    return {
      users: options(data.users),
      teams: options(data.teams),
      owners: options(data.owners),
      pipelineStages: options(data.pipelineStages ?? data.stages),
      priorities: options(data.priorities),
      industries: options(data.industries),
      leadSources: options(data.leadSources ?? data.sources),
      activityTypes: options(data.activityTypes),
    };
  },
  getPipelineSummaryReport: async (filters: ReportFilters = {}): Promise<PipelineSummaryReport> => {
    const response = await axiosInstance.get<PipelineSummaryReport | { data: PipelineSummaryReport }>('/reports/pipeline-summary', { params: requestParams(filters) });
    const data = unwrap(response.data);
    return { ...data, stages: data.stages ?? [], summary: data.summary ?? { totalCompanies: 0, activeCompanies: 0, lostCompanies: 0, lostRate: 0 } };
  },
  getConversionRatesReport: async (filters: ReportFilters = {}): Promise<ConversionRatesReport> => {
    const response = await axiosInstance.get<ConversionRatesReport | { data: ConversionRatesReport }>('/reports/conversion-rates', { params: requestParams(filters) });
    const data = unwrap(response.data);
    return { ...data, stages: data.stages ?? [], summary: data.summary ?? { totalCompanies: 0, completedCompanies: 0, overallConversionRate: 0 } };
  },
  getStageDurationsReport: async (filters: ReportFilters = {}): Promise<StageDurationReportItem[]> => getList('/reports/stage-durations', filters),
  getActivityReport: async (filters: ReportFilters = {}): Promise<ActivityReport> => {
    const response = await axiosInstance.get<ActivityReport | { data: ActivityReport }>('/reports/activities', { params: requestParams(filters) });
    const data = unwrap(response.data);
    return { ...data, breakdown: data.breakdown ?? [], totalActivities: data.totalActivities ?? 0 };
  },
  getActivitiesByUserReport: (filters: ReportFilters = {}): Promise<ActivityByUserReportItem[]> => getList('/reports/activities/by-user', filters),
  getPipelineByOwnerReport: (filters: ReportFilters = {}): Promise<PipelineByOwnerReportItem[]> => getList('/reports/pipeline/by-owner', filters),
};
