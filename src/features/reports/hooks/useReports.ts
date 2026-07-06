import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import type { ReportFilters } from '../types/report.types';

export const reportQueryKeys = {
  all: ['reports'] as const,
  filterOptions: () => [...reportQueryKeys.all, 'filter-options'] as const,
  pipelineSummary: (filters: ReportFilters) => [...reportQueryKeys.all, 'pipeline-summary', filters] as const,
  conversionRates: (filters: ReportFilters) => [...reportQueryKeys.all, 'conversion-rates', filters] as const,
  stageDurations: (filters: ReportFilters) => [...reportQueryKeys.all, 'stage-durations', filters] as const,
  activities: (filters: ReportFilters) => [...reportQueryKeys.all, 'activities', filters] as const,
  activitiesByUser: (filters: ReportFilters) => [...reportQueryKeys.all, 'activities-by-user', filters] as const,
  pipelineByOwner: (filters: ReportFilters) => [...reportQueryKeys.all, 'pipeline-by-owner', filters] as const,
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
