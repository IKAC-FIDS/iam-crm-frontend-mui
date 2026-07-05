import axiosInstance from '@/lib/axios';
import type { ActivityReport, ActivityReportParams, ConversionRatesReport, PipelineSummaryReport, StageDurationReportItem } from '../types/report.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
}

export const reportsService = {
  getPipelineSummaryReport: async (): Promise<PipelineSummaryReport> => {
    const response = await axiosInstance.get<PipelineSummaryReport | { data: PipelineSummaryReport }>('/reports/pipeline-summary');
    return unwrap(response.data);
  },
  getConversionRatesReport: async (): Promise<ConversionRatesReport> => {
    const response = await axiosInstance.get<ConversionRatesReport | { data: ConversionRatesReport }>('/reports/conversion-rates');
    return unwrap(response.data);
  },
  getStageDurationsReport: async (): Promise<StageDurationReportItem[]> => {
    const response = await axiosInstance.get<StageDurationReportItem[] | { data: StageDurationReportItem[] }>('/reports/stage-durations');
    return unwrap(response.data);
  },
  getActivityReport: async (params: ActivityReportParams): Promise<ActivityReport> => {
    const response = await axiosInstance.get<ActivityReport | { data: ActivityReport }>('/reports/activities', { params });
    return unwrap(response.data);
  },
};
