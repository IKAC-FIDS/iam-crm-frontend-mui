import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import type { ActivityReportParams } from '../types/report.types';

export const reportQueryKeys = {
  all: ['reports'] as const,
  pipelineSummary: () => [...reportQueryKeys.all, 'pipeline-summary'] as const,
  conversionRates: () => [...reportQueryKeys.all, 'conversion-rates'] as const,
  stageDurations: () => [...reportQueryKeys.all, 'stage-durations'] as const,
  activities: (params: ActivityReportParams) => [...reportQueryKeys.all, 'activities', params] as const,
};

export function usePipelineSummaryReport(enabled = true) {
  return useQuery({ queryKey: reportQueryKeys.pipelineSummary(), queryFn: reportsService.getPipelineSummaryReport, enabled });
}
export function useConversionRatesReport(enabled = true) {
  return useQuery({ queryKey: reportQueryKeys.conversionRates(), queryFn: reportsService.getConversionRatesReport, enabled });
}
export function useStageDurationsReport(enabled = true) {
  return useQuery({ queryKey: reportQueryKeys.stageDurations(), queryFn: reportsService.getStageDurationsReport, enabled });
}
export function useActivityReport(params: ActivityReportParams, enabled = true) {
  return useQuery({ queryKey: reportQueryKeys.activities(params), queryFn: () => reportsService.getActivityReport(params), placeholderData: keepPreviousData, enabled });
}
