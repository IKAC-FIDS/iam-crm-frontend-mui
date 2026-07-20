import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import type { AdvancedReportFilters, ReportFilters } from '../types/report.types';

export const reportQueryKeys = {
  all: ['reports'] as const,
  filterOptions: () => [...reportQueryKeys.all, 'filter-options'] as const,
  pipelineSummary: (filters: ReportFilters) => [...reportQueryKeys.all, 'pipeline-summary', filters] as const,
  conversionRates: (filters: ReportFilters) => [...reportQueryKeys.all, 'conversion-rates', filters] as const,
  stageDurations: (filters: ReportFilters) => [...reportQueryKeys.all, 'stage-durations', filters] as const,
  activities: (filters: ReportFilters) => [...reportQueryKeys.all, 'activities', filters] as const,
  activitiesByUser: (filters: ReportFilters) => [...reportQueryKeys.all, 'activities-by-user', filters] as const,
  pipelineByOwner: (filters: ReportFilters) => [...reportQueryKeys.all, 'pipeline-by-owner', filters] as const,
  dashboard: (filters: AdvancedReportFilters) => ['dashboard-summary', filters] as const,
  forecast: (filters: AdvancedReportFilters) => [...reportQueryKeys.all, 'forecast', filters] as const,
  aging: (filters: AdvancedReportFilters) => [...reportQueryKeys.all, 'aging', filters] as const,
  meetingPerformance: (filters: AdvancedReportFilters) => [...reportQueryKeys.all, 'meeting-performance', filters] as const,
  taskPerformance: (filters: AdvancedReportFilters) => [...reportQueryKeys.all, 'task-performance', filters] as const,
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
