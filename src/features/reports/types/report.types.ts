import type { ActivityType } from '@/features/activities/types/activity.types';
import type { OwnershipScope } from '@/shared/types/ownership';

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
  ownershipScope?: OwnershipScope;
  companyIds?: string[];
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
  meetingStatuses?: string[];
  meetingModes?: string[];
  taskStatuses?: string[];
}

export interface AdvancedReportFilters extends ReportFilters { page?: number; limit?: number }
export interface DashboardSummary {
  generatedAt: string; period: { startDate: string; endDate: string };
  current: { activeOpportunities: { count: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue; missingValueCount: number; missingProbabilityCount: number }; tasks: { openCount: number; overdueCount: number; dueTodayCount: number; dueNextSevenDaysCount: number }; meetings: { todayCount: number; upcomingSevenDaysCount: number; pastScheduledCount: number } };
  periodPerformance: { opportunities: { createdCount: number; wonCount: number; lostCount: number; wonEstimatedValueIrr: NumericValue; winRate: NumericValue }; tasks: TaskPerformanceReport['periodFlow']; meetings: { totalCount: number; completedCount: number; cancelledCount: number; pastScheduledCount: number; executionRate: NumericValue } };
  forecast: { horizonStartDate: string; horizonEndDate: string; opportunityCount: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue; overdueCloseCount: number; withoutCloseDateCount: number };
  attention: { overdueOpportunities: DashboardOpportunityAttention[]; overdueTasks: DashboardTaskAttention[]; pastScheduledMeetings: DashboardMeetingAttention[] };
}
export interface DashboardOpportunityAttention { id: string; title: string; expectedCloseDate: string; estimatedValue?: NumericValue | null; probability?: number | null; company?: { legalName: string; brandName?: string | null }; owner?: { fullName: string } | null; stage?: { label: string } }
export interface DashboardTaskAttention { id: string; title: string; status: string; priority: string; dueAt: string; assignedTo?: { fullName: string } | null; company?: { legalName: string; brandName?: string | null } | null }
export interface DashboardMeetingAttention { id: string; title: string; startAt: string; endAt: string; company?: { legalName: string; brandName?: string | null }; organizer?: { fullName: string } }
export interface ForecastBreakdown { opportunityCount: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue }
export interface ForecastReport { generatedAt: string; period: ReportPeriod; summary: { totalActiveOpportunities: number; forecastOpportunityCount: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue; overdueCloseCount: number; overdueEstimatedValueIrr: NumericValue; withoutCloseDateCount: number; withoutCloseDateEstimatedValueIrr: NumericValue; missingValueCount: number; missingProbabilityCount: number }; periods: Array<ForecastBreakdown & { periodStart: string; periodEnd: string; label: string }>; byStage: Array<ForecastBreakdown & { stageId: string; code: string; label: string; sortOrder: number }>; byOwner: Array<ForecastBreakdown & { ownerId?: string | null; ownerName: string; team?: string | null }> }
export interface OpportunityAgingRow { id: string; title: string; company: { id: string; legalName: string; brandName?: string | null }; owner?: { id: string; fullName: string; team?: string | null } | null; stage: { id: string; code: string; label: string }; priority: string; estimatedValue?: NumericValue | null; probability?: number | null; expectedCloseDate?: string | null; createdAt: string; stageEnteredAt: string; totalAgeDays: number; currentStageAgeDays: number; isExpectedCloseOverdue: boolean }
export interface OpportunityAgingReport { asOf: string; summary: { activeOpportunityCount: number; averageTotalAgeDays: NumericValue; averageCurrentStageAgeDays: NumericValue; overdueCloseCount: number; withoutExpectedCloseDateCount: number; estimatedValueIrr: NumericValue }; buckets: Array<{ key: string; minDays: number; maxDays?: number | null; opportunityCount: number; estimatedValueIrr: NumericValue }>; data: OpportunityAgingRow[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext?: boolean; hasPrevious?: boolean } }
export interface MeetingPerformanceReport { period: ReportPeriod; summary: { totalCount: number; scheduledCount: number; completedCount: number; cancelledCount: number; pastScheduledCount: number; completionRate: NumericValue; executionRate: NumericValue; cancellationRate: NumericValue; averagePlannedDurationMinutes: NumericValue }; byStatus: Array<{ status: string; count: number }>; byMode: Array<{ mode: string; count: number }>; byOrganizer: Array<{ organizerId: string; organizerName: string; team?: string | null; totalCount: number; completedCount: number; cancelledCount: number; pastScheduledCount: number; executionRate: NumericValue }>; trend: TrendItem[] }
export interface TrendItem { periodStart: string; periodEnd: string; granularity: string; totalCount: number; createdCount: number; completedCount: number; cancelledCount: number; pastScheduledCount: number }
export interface TaskPerformanceReport { period: ReportPeriod; current: { openCount: number; overdueCount: number; dueTodayCount: number; dueNextSevenDaysCount: number }; periodFlow: { createdCount: number; completedCount: number; cancelledCount: number; dueCount: number; onTimeCompletedCount: number; lateCompletedCount: number; completedWithoutDueDateCount: number; onTimeCompletionRate: NumericValue; averageCompletionHours: NumericValue }; byPriority: Array<{ priority: string; openCount: number; overdueCount: number; completedCount: number }>; byAssignee: Array<{ userId?: string | null; fullName: string; team?: string | null; openCount: number; overdueCount: number; completedInPeriodCount: number; onTimeCompletedCount: number; lateCompletedCount: number; onTimeCompletionRate: NumericValue }>; trend: TrendItem[] }

export interface ReportPeriod {
  startDate?: string | null;
  endDate?: string | null;
  dateBasis?: 'OPPORTUNITY_CREATED_AT' | 'STAGE_TRANSITION_CHANGED_AT' | 'ACTIVITY_OCCURRED_AT' | string;
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
  period?: ReportPeriod;
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
  period?: ReportPeriod;
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
  period?: ReportPeriod;
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
