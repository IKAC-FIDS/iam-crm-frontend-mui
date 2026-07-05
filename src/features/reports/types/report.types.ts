import type { ActivityType } from '@/features/activities/types/activity.types';
import type { PipelineStage } from '@/features/companies/types/company.types';

export type NumericValue = number | string;

export interface PipelineSummaryReport {
  stages: Array<{ stage: PipelineStage | string; count: NumericValue; percentage: NumericValue }>;
  summary: { totalCompanies: NumericValue; activeCompanies: NumericValue; lostCompanies: NumericValue; lostRate: NumericValue };
}

export interface ConversionRatesReport {
  stages: Array<{ fromStage: PipelineStage | string; toStage: PipelineStage | string; fromCount: NumericValue; toCount: NumericValue; conversionRate: NumericValue }>;
  summary: { totalCompanies: NumericValue; completedCompanies: NumericValue; overallConversionRate: NumericValue };
}

export interface StageDurationReportItem {
  stage: PipelineStage | string;
  sample_count: NumericValue;
  avg_duration_days: NumericValue;
  min_duration_days: NumericValue;
  max_duration_days: NumericValue;
}

export interface ActivityReport {
  startDate: string;
  endDate: string;
  totalActivities: NumericValue;
  breakdown: Array<{ type: ActivityType | string; count: NumericValue; percentage: NumericValue }>;
}

export interface ActivityReportParams { startDate?: string; endDate?: string }
