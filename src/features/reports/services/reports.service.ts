import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
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
  AdvancedReportFilters, DashboardSummary, ForecastReport, OpportunityAgingReport, MeetingPerformanceReport, TaskPerformanceReport, FinancialCollectionsReport, ProductPerformanceReport, ExchangeRateImpactReport, DataQualityReport, DataQualityIssuesReport, PeriodComparisonReport, PeriodComparisonFilters,
} from '../types/report.types';
import { comparisonParams, endpointFilterKeys, overviewKeys, serializeReportParams } from './reportParams';

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

async function getList<T>(url: string, filters: ReportFilters, keys = overviewKeys): Promise<T[]> {
  const response = await axiosInstance.get<T[] | { data: T[] } | { items: T[] }>(url, { params: serializeReportParams(filters, keys) });
  const payload = unwrapApiResponse<T[] | { items: T[] }>(response.data);
  if (Array.isArray(payload)) return payload;
  return 'items' in payload && Array.isArray(payload.items) ? payload.items : [];
}

export const reportsService = {
  getDashboardSummary: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<DashboardSummary> => unwrapApiResponse<DashboardSummary>((await axiosInstance.get('/dashboard/summary', { params: serializeReportParams(filters, endpointFilterKeys.dashboard), signal })).data),
  getForecastReport: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<ForecastReport> => unwrapApiResponse<ForecastReport>((await axiosInstance.get('/reports/opportunities/forecast', { params: serializeReportParams(filters, endpointFilterKeys.forecast), signal })).data),
  getAgingReport: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<OpportunityAgingReport> => unwrapApiResponse<OpportunityAgingReport>((await axiosInstance.get('/reports/opportunities/aging', { params: serializeReportParams(filters, endpointFilterKeys.aging), signal })).data),
  getMeetingPerformance: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<MeetingPerformanceReport> => unwrapApiResponse<MeetingPerformanceReport>((await axiosInstance.get('/reports/meetings/performance', { params: serializeReportParams(filters, endpointFilterKeys.meetings), signal })).data),
  getTaskPerformance: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<TaskPerformanceReport> => unwrapApiResponse<TaskPerformanceReport>((await axiosInstance.get('/reports/tasks/performance', { params: serializeReportParams(filters, endpointFilterKeys.tasks), signal })).data),
  getFinancialCollections: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<FinancialCollectionsReport> => unwrapApiResponse<FinancialCollectionsReport>((await axiosInstance.get('/reports/financial/collections', { params: serializeReportParams(filters, endpointFilterKeys.financial), signal })).data),
  getProductPerformance: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<ProductPerformanceReport> => unwrapApiResponse<ProductPerformanceReport>((await axiosInstance.get('/reports/products/performance', { params: serializeReportParams(filters, endpointFilterKeys.products), signal })).data),
  getExchangeRateImpact: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<ExchangeRateImpactReport> => unwrapApiResponse<ExchangeRateImpactReport>((await axiosInstance.get('/reports/exchange-rates/impact', { params: serializeReportParams(filters, endpointFilterKeys.exchange), signal })).data),
  getDataQuality: async (filters: AdvancedReportFilters = {}, signal?: AbortSignal): Promise<DataQualityReport> => unwrapApiResponse<DataQualityReport>((await axiosInstance.get('/reports/data-quality', { params: serializeReportParams(filters, endpointFilterKeys.dataQuality), signal })).data),
  getDataQualityIssues: async (filters: AdvancedReportFilters & { ruleKey: string }, signal?: AbortSignal): Promise<DataQualityIssuesReport> => unwrapApiResponse<DataQualityIssuesReport>((await axiosInstance.get('/reports/data-quality/issues', { params: serializeReportParams(filters, endpointFilterKeys.dataQualityIssues), signal })).data),
  getPeriodComparison: async (filters: PeriodComparisonFilters = {}, signal?: AbortSignal): Promise<PeriodComparisonReport> => unwrapApiResponse<PeriodComparisonReport>((await axiosInstance.get('/reports/period-comparison', { params: serializeReportParams(comparisonParams(filters), endpointFilterKeys.comparison), signal })).data),
  getFilterOptions: async (): Promise<ReportFilterOptions> => {
    const response = await axiosInstance.get<Record<string, unknown> | { data: Record<string, unknown> }>('/reports/filter-options');
    const data = unwrapApiResponse<Record<string, unknown>>(response.data);
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
    const response = await axiosInstance.get<PipelineSummaryReport | { data: PipelineSummaryReport }>('/reports/pipeline-summary', { params: serializeReportParams(filters, overviewKeys) });
    const data = unwrapApiResponse<PipelineSummaryReport>(response.data);
    return { ...data, stages: data.stages ?? [], summary: data.summary ?? { totalCompanies: 0, activeCompanies: 0, lostCompanies: 0, lostRate: 0 } };
  },
  getConversionRatesReport: async (filters: ReportFilters = {}): Promise<ConversionRatesReport> => {
    const response = await axiosInstance.get<ConversionRatesReport | { data: ConversionRatesReport }>('/reports/conversion-rates', { params: serializeReportParams(filters, overviewKeys) });
    const data = unwrapApiResponse<ConversionRatesReport>(response.data);
    return { ...data, stages: data.stages ?? [], summary: data.summary ?? { totalCompanies: 0, completedCompanies: 0, overallConversionRate: 0 } };
  },
  getStageDurationsReport: async (filters: ReportFilters = {}): Promise<StageDurationReportItem[]> => getList('/reports/stage-durations', filters),
  getActivityReport: async (filters: ReportFilters = {}): Promise<ActivityReport> => {
    const response = await axiosInstance.get<ActivityReport | { data: ActivityReport }>('/reports/activities', { params: serializeReportParams(filters, overviewKeys) });
    const data = unwrapApiResponse<ActivityReport>(response.data);
    return { ...data, breakdown: data.breakdown ?? [], totalActivities: data.totalActivities ?? 0 };
  },
  getActivitiesByUserReport: (filters: ReportFilters = {}): Promise<ActivityByUserReportItem[]> => getList('/reports/activities/by-user', filters),
  getPipelineByOwnerReport: async (filters: ReportFilters = {}): Promise<PipelineByOwnerReportItem[]> => {
    const data = await getList<PipelineByOwnerReportItem & { stages?: PipelineByOwnerReportItem['stageBreakdown'] }>('/reports/pipeline/by-owner', filters);
    return data.map((item) => ({ ...item, stageBreakdown: item.stageBreakdown ?? item.stages ?? [] }));
  },
};
