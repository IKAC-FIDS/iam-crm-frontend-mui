import type { ActivityType } from '@/features/activities/types/activity.types';

export type NumericValue = number | string;

export interface ReportFilterOption {
  value: string;
  label: string;
  team?: string | null;
}

export interface ReportFilterOptions {
  users: ReportFilterOption[];
  teams: ReportFilterOption[];
  owners: ReportFilterOption[];
  pipelineStages: ReportFilterOption[];
  priorities: ReportFilterOption[];
  industries: ReportFilterOption[];
  leadSources: ReportFilterOption[];
  activityTypes: ReportFilterOption[];
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  userIds?: string[];
  teams?: string[];
  ownerIds?: string[];
  stages?: string[];
  priorities?: string[];
  industries?: string[];
  leadSources?: string[];
  activityTypes?: string[];
}

export interface ReportStageBreakdownItem {
  stage: string;
  stageId?: string;
  label?: string;
  sortOrder?: number;
  count: NumericValue;
  percentage?: NumericValue;
}

export interface PipelineSummaryReport {
  stages: ReportStageBreakdownItem[];
  summary: {
    totalCompanies: NumericValue;
    activeCompanies: NumericValue;
    lostCompanies: NumericValue;
    lostRate: NumericValue;

    totalOpportunities?: NumericValue;
    activeOpportunities?: NumericValue;
    wonOpportunities?: NumericValue;
    lostOpportunities?: NumericValue;
    wonRate?: NumericValue;
    lostOpportunityRate?: NumericValue;
  };
}

export interface ConversionRatesReport {
  stages: Array<{
    fromStageId?: string | null;
    fromStage?: string | null;
    fromLabel?: string;
    toStageId?: string;
    toStage: string;
    toLabel?: string;
    fromCount: NumericValue;
    toCount: NumericValue;
    conversionRate: NumericValue;
  }>;
  summary: {
    totalCompanies: NumericValue;
    completedCompanies: NumericValue;
    overallConversionRate: NumericValue;

    totalOpportunities?: NumericValue;
    wonOpportunities?: NumericValue;
    overallOpportunityConversionRate?: NumericValue;
  };
}

export interface StageDurationReportItem {
  stage: string;
  stageId?: string;
  label?: string;
  sortOrder?: number;
  sample_count: NumericValue;
  avg_duration_days: NumericValue;
  min_duration_days: NumericValue;
  max_duration_days: NumericValue;
}

export interface ActivityReport {
  startDate: string;
  endDate: string;
  totalActivities: NumericValue;
  breakdown: Array<{
    type: ActivityType | string;
    count: NumericValue;
    percentage: NumericValue;
  }>;
}

export interface ActivityByUserReportItem {
  userId?: string;
  userName?: string;
  fullName?: string;
  team?: string | null;
  totalActivities: NumericValue;
  calls: NumericValue;
  emails: NumericValue;
  meetings: NumericValue;
  notes: NumericValue;
  linkedinMessages: NumericValue;
  linkedinEngagements: NumericValue;
}

export interface PipelineByOwnerStageItem {
  stage: string;
  stageId?: string;
  label?: string;
  sortOrder?: number;
  count: NumericValue;
}

export interface PipelineByOwnerReportItem {
  ownerId?: string;
  ownerName?: string;
  fullName?: string;
  team?: string | null;

  totalCompanies: NumericValue;
  activeCompanies: NumericValue;
  doneCompanies: NumericValue;
  lostCompanies: NumericValue;

  totalOpportunities?: NumericValue;
  activeOpportunities?: NumericValue;
  wonOpportunities?: NumericValue;
  lostOpportunities?: NumericValue;

  conversionRate: NumericValue;
  lostRate: NumericValue;

  stageBreakdown?: PipelineByOwnerStageItem[] | Record<string, NumericValue>;
  stages?: PipelineByOwnerStageItem[];
}