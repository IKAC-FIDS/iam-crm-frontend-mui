import type { ActivityType } from '@/features/activities/types/activity.types';
import type { OwnershipScope } from '@/shared/types/ownership';
import type { SalesChannel } from '@/features/opportunityLineItems/types/opportunityLineItem.types';

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
  productIds?: string[];
  categories?: string[];
  salesChannels?: SalesChannel[];
  entityTypes?: string[];
  severities?: DataQualitySeverity[];
  ruleKeys?: string[];
  comparisonMode?: ComparisonMode;
  compareStartDate?: string;
  compareEndDate?: string;
}

export interface AdvancedReportFilters extends ReportFilters { page?: number; limit?: number; ruleKey?: string }
export type DataQualitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ReportingScope = 'ORGANIZATION' | 'GLOBAL_CATALOG';
export interface DataQualityScore { overall: NumericValue | null; eligibleChecks: number; passedChecks: number; issueOccurrences: number }
export interface DataQualityRule { ruleKey: string; title: string; description: string; entityType: string; severity: DataQualitySeverity; scope: ReportingScope; fieldNames: string[]; eligibleCount: number; issueCount: number; passRate: NumericValue | null }
export interface DataQualitySection { score: DataQualityScore; byEntityType: Array<{ entityType: string; eligibleChecks: number; issueOccurrences: number; score: NumericValue | null }>; bySeverity: Array<{ severity: DataQualitySeverity; issueOccurrences: number }>; rules: DataQualityRule[] }
export interface DataQualityReport { asOf: string; organization: DataQualitySection; globalCatalog?: DataQualitySection | null }
export interface DataQualityIssue { entityId: string; entityType: string; scope: ReportingScope; title: string; subtitle?: string | null; company?: { id: string; legalName: string; brandName?: string | null } | null; owner?: { id: string; fullName: string } | null; fieldNames: string[]; message: string; routeHint?: string | null; detectedAt: string }
export interface DataQualityIssuesReport { asOf: string; rule: DataQualityRule; data: DataQualityIssue[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrevious: boolean } }
export type ComparisonMode = 'PREVIOUS_PERIOD' | 'PREVIOUS_YEAR' | 'CUSTOM';
export interface ComparisonMetric { key: string; label: string; valueType: 'COUNT' | 'PERCENT' | 'IRR' | 'DECIMAL' | string; currentValue: NumericValue; comparisonValue: NumericValue; absoluteChange: NumericValue; percentChange: number | null; direction: 'UP' | 'DOWN' | 'UNCHANGED'; polarity: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'NEUTRAL'; isImprovement: boolean | null; dateBasis: string }
export interface PeriodComparisonReport { currentPeriod: { startDate: string; endDate: string }; comparisonPeriod: { startDate: string; endDate: string; mode: ComparisonMode }; groups: Array<{ key: string; title: string; metrics: ComparisonMetric[] }> }
export interface PeriodComparisonFilters extends ReportFilters { comparisonMode?: ComparisonMode; compareStartDate?: string; compareEndDate?: string }
export interface DashboardSummary {
  generatedAt: string; period: { startDate: string; endDate: string };
  current: { activeOpportunities: { count: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue; missingValueCount: number; missingProbabilityCount: number }; tasks: { openCount: number; overdueCount: number; dueTodayCount: number; dueNextSevenDaysCount: number }; meetings: { todayCount: number; upcomingSevenDaysCount: number; pastScheduledCount: number } };
  periodPerformance: { opportunities: { createdCount: number; wonCount: number; lostCount: number; wonEstimatedValueIrr: NumericValue; winRate: NumericValue }; tasks: TaskPerformanceReport['periodFlow']; meetings: { totalCount: number; completedCount: number; cancelledCount: number; pastScheduledCount: number; executionRate: NumericValue } };
  forecast: { horizonStartDate: string; horizonEndDate: string; opportunityCount: number; estimatedValueIrr: NumericValue; weightedValueIrr: NumericValue; overdueCloseCount: number; withoutCloseDateCount: number };
  attention: { overdueOpportunities: DashboardOpportunityAttention[]; overdueTasks: DashboardTaskAttention[]; pastScheduledMeetings: DashboardMeetingAttention[] };
  finance?: { outstandingAmountIrr: NumericValue; overdueAmountIrr: NumericValue; collectedInPeriodAmountIrr: NumericValue; overduePaymentCount: number };
  catalog?: { activeProductCount: number; usdProductCount: number; irrProductCount: number; currentExchangeRate: NumericValue | null; currentExchangeRateValidFrom: string | null; staleUsdProductCount: number };
  salesChannels?: { wonInPersonAmountIrr: NumericValue; wonDigikalaAmountIrr: NumericValue; wonOtherAmountIrr: NumericValue; wonLegacyUnknownAmountIrr: NumericValue };
  dataQuality?: { overallScore: NumericValue | null; criticalIssueCount: number; highIssueCount: number; totalIssueOccurrences: number } | null;
  catalogQuality?: { overallScore: NumericValue | null; criticalIssueCount: number; highIssueCount: number; totalIssueOccurrences: number } | null;
  periodComparison?: { currentPeriod: { startDate: string; endDate: string }; comparisonPeriod: { startDate: string; endDate: string }; metrics: Array<Pick<ComparisonMetric, 'key' | 'currentValue' | 'comparisonValue' | 'percentChange' | 'direction' | 'polarity' | 'isImprovement'>> };
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

export interface FinancialCollectionsReport { period: ReportPeriod; current: { outstandingAmountIrr: NumericValue; outstandingPaymentCount: number; overdueAmountIrr: NumericValue; overduePaymentCount: number; dueTodayAmountIrr: NumericValue; dueTodayPaymentCount: number; dueNextThirtyDaysAmountIrr: NumericValue; dueNextThirtyDaysPaymentCount: number }; periodFlow: { paymentCreatedAmountIrr: NumericValue; paymentCreatedCount: number; collectedAmountIrr: NumericValue; collectedPaymentCount: number; documentCreatedAmountIrr: NumericValue; documentCreatedCount: number; documentIssuedAmountIrr: NumericValue; documentIssuedCount: number; documentAcceptedAmountIrr: NumericValue; documentAcceptedCount: number; documentSignedAmountIrr: NumericValue; documentSignedCount: number; collectionRate: NumericValue }; aging: Array<{ key: string; paymentCount: number; amountIrr: NumericValue }>; trend: Array<{ periodStart: string; periodEnd: string; collectedAmountIrr: NumericValue; createdReceivableAmountIrr: NumericValue; dueAmountIrr: NumericValue }>; byOwner: Array<{ ownerId: string | null; ownerName: string; outstandingAmountIrr: NumericValue; collectedAmountIrr: NumericValue }>; byCompany: Array<{ companyId: string; companyName: string; outstandingAmountIrr: NumericValue; collectedAmountIrr: NumericValue }>; excludedCurrencies: Array<{ currency: string; paymentCount: number; documentCount: number }> }
export interface ProductPerformanceReport { period: ReportPeriod & { wonDateBasis?: string }; wonSales: { opportunityCount: number; lineItemCount: number; quantity: NumericValue; netLineValueIrr: NumericValue; grossLineValueIrr: NumericValue; discountAmountIrr: NumericValue; taxAmountIrr: NumericValue }; activePipeline: { opportunityCount: number; lineItemCount: number; quantity: NumericValue; netLineValueIrr: NumericValue }; byProduct: Array<{ productId: string | null; productCode: string; productName: string; category: string | null; wonOpportunityCount: number; wonLineItemCount: number; wonQuantity: NumericValue; wonNetValueIrr: NumericValue; activePipelineQuantity: NumericValue; activePipelineNetValueIrr: NumericValue }>; byChannel: Array<{ salesChannel: SalesChannel; opportunityCount: number; lineItemCount: number; quantity: NumericValue; netValueIrr: NumericValue; percentage: NumericValue }>; trend: Array<{ periodStart: string; periodEnd: string; opportunityCount: number; quantity: NumericValue; netValueIrr: NumericValue }> }
export interface ExchangeRateImpactRow { productId: string; productCode: string; productName: string; category: string | null; exchangeRateId: string; previousExchangeRate: NumericValue | null; exchangeRate: NumericValue; previousInPersonPriceIrr: NumericValue | null; inPersonPriceIrr: NumericValue; inPersonDeltaIrr: NumericValue | null; previousDigikalaPriceIrr: NumericValue | null; digikalaPriceIrr: NumericValue; digikalaDeltaIrr: NumericValue | null; effectiveFrom: string }
export interface ExchangeRateImpactReport { period: ReportPeriod; current: { currentRate: NumericValue | null; currentValidFrom: string | null; previousRate: NumericValue | null; rateChangePercent: NumericValue | null; usdProductCount: number; irrProductCount: number; staleUsdProductCount: number }; history: Array<{ exchangeRateId: string; rate: NumericValue; validFrom: string; validTo: string | null; previousRate: NumericValue | null; changePercent: NumericValue | null; affectedProductCount: number; aggregateInPersonDeltaIrr: NumericValue; aggregateDigikalaDeltaIrr: NumericValue }>; productImpacts: { data: ExchangeRateImpactRow[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrevious: boolean } } }

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
