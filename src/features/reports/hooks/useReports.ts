import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import type { AdvancedReportFilters, PeriodComparisonFilters, ReportFilters } from '../types/report.types';
import { comparisonParams, endpointFilterKeys, overviewKeys, selectReportFilters } from '../services/reportParams';

export const reportQueryKeys = {
  all: ['reports'] as const,
  filterOptions: () => [...reportQueryKeys.all, 'filter-options'] as const,
  pipelineSummary: (f: ReportFilters) => [...reportQueryKeys.all, 'pipeline-summary', selectReportFilters(f, overviewKeys)] as const,
  conversionRates: (f: ReportFilters) => [...reportQueryKeys.all, 'conversion-rates', selectReportFilters(f, overviewKeys)] as const,
  stageDurations: (f: ReportFilters) => [...reportQueryKeys.all, 'stage-durations', selectReportFilters(f, overviewKeys)] as const,
  activities: (f: ReportFilters) => [...reportQueryKeys.all, 'activities', selectReportFilters(f, overviewKeys)] as const,
  activitiesByUser: (f: ReportFilters) => [...reportQueryKeys.all, 'activities-by-user', selectReportFilters(f, overviewKeys)] as const,
  pipelineByOwner: (f: ReportFilters) => [...reportQueryKeys.all, 'pipeline-by-owner', selectReportFilters(f, overviewKeys)] as const,
  dashboard: (f: AdvancedReportFilters) => ['dashboard-summary', selectReportFilters(f, endpointFilterKeys.dashboard)] as const,
  forecast: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'forecast', selectReportFilters(f, endpointFilterKeys.forecast)] as const,
  aging: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'aging', selectReportFilters(f, endpointFilterKeys.aging)] as const,
  meetingPerformance: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'meeting-performance', selectReportFilters(f, endpointFilterKeys.meetings)] as const,
  taskPerformance: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'task-performance', selectReportFilters(f, endpointFilterKeys.tasks)] as const,
  financialCollections: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'financial-collections', selectReportFilters(f, endpointFilterKeys.financial)] as const,
  productPerformance: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'product-performance', selectReportFilters(f, endpointFilterKeys.products)] as const,
  exchangeRateImpact: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'exchange-rate-impact', selectReportFilters(f, endpointFilterKeys.exchange)] as const,
  dataQuality: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'data-quality', selectReportFilters(f, endpointFilterKeys.dataQuality)] as const,
  dataQualityIssues: (f: AdvancedReportFilters) => [...reportQueryKeys.all, 'data-quality-issues', selectReportFilters(f, endpointFilterKeys.dataQualityIssues)] as const,
  periodComparison: (f: PeriodComparisonFilters) => [...reportQueryKeys.all, 'period-comparison', comparisonParams(f)] as const,
};

const common = { placeholderData: keepPreviousData } as const;

export function useReportFilterOptions(enabled = true) {
  return useQuery({ queryKey: reportQueryKeys.filterOptions(), queryFn: reportsService.getFilterOptions, enabled, staleTime: 5 * 60 * 1000 });
}
export function usePipelineSummaryReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.pipelineSummary(filters), queryFn: () => reportsService.getPipelineSummaryReport(filters), enabled });
}
export function useConversionRatesReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.conversionRates(filters), queryFn: () => reportsService.getConversionRatesReport(filters), enabled });
}
export function useStageDurationsReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.stageDurations(filters), queryFn: () => reportsService.getStageDurationsReport(filters), enabled });
}
export function useActivityReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.activities(filters), queryFn: () => reportsService.getActivityReport(filters), enabled });
}
export function useActivitiesByUserReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.activitiesByUser(filters), queryFn: () => reportsService.getActivitiesByUserReport(filters), enabled });
}
export function usePipelineByOwnerReport(filters: ReportFilters = {}, enabled = true) {
  return useQuery({ ...common, queryKey: reportQueryKeys.pipelineByOwner(filters), queryFn: () => reportsService.getPipelineByOwnerReport(filters), enabled });
}
export function useDashboardSummary(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.dashboard(filters), queryFn: ({ signal }) => reportsService.getDashboardSummary(filters, signal), enabled, staleTime: 60_000 }); }
export function useForecastReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.forecast(filters), queryFn: ({ signal }) => reportsService.getForecastReport(filters, signal), enabled, staleTime: 60_000 }); }
export function useOpportunityAgingReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.aging(filters), queryFn: ({ signal }) => reportsService.getAgingReport(filters, signal), enabled, placeholderData: keepPreviousData, staleTime: 60_000 }); }
export function useMeetingPerformanceReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.meetingPerformance(filters), queryFn: ({ signal }) => reportsService.getMeetingPerformance(filters, signal), enabled, staleTime: 60_000 }); }
export function useTaskPerformanceReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.taskPerformance(filters), queryFn: ({ signal }) => reportsService.getTaskPerformance(filters, signal), enabled, staleTime: 60_000 }); }
export function useFinancialCollectionsReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.financialCollections(filters), queryFn: ({ signal }) => reportsService.getFinancialCollections(filters, signal), enabled, staleTime: 60_000 }); }
export function useProductPerformanceReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.productPerformance(filters), queryFn: ({ signal }) => reportsService.getProductPerformance(filters, signal), enabled, staleTime: 60_000 }); }
export function useExchangeRateImpactReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.exchangeRateImpact(filters), queryFn: ({ signal }) => reportsService.getExchangeRateImpact(filters, signal), enabled, placeholderData: keepPreviousData, staleTime: 60_000 }); }
export function useDataQualityReport(filters: AdvancedReportFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.dataQuality(filters), queryFn: ({ signal }) => reportsService.getDataQuality(filters, signal), enabled, staleTime: 60_000 }); }
export function useDataQualityIssues(filters: AdvancedReportFilters & { ruleKey: string }, enabled = true) { return useQuery({ queryKey: reportQueryKeys.dataQualityIssues(filters), queryFn: ({ signal }) => reportsService.getDataQualityIssues(filters, signal), enabled: enabled && Boolean(filters.ruleKey), placeholderData: keepPreviousData, staleTime: 60_000 }); }
export function usePeriodComparisonReport(filters: PeriodComparisonFilters = {}, enabled = true) { return useQuery({ queryKey: reportQueryKeys.periodComparison(filters), queryFn: ({ signal }) => reportsService.getPeriodComparison(filters, signal), enabled, staleTime: 60_000 }); }
