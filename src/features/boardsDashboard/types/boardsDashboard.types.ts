import type {
  DashboardMeetingAttention,
  DashboardOpportunityAttention,
  DashboardTaskAttention,
  FinancialCollectionsReport,
  NumericValue,
  PeriodComparisonReport,
  ProductPerformanceReport,
} from '@/features/reports/types/report.types';

export type BoardsMetricUnit = 'COUNT' | 'IRR' | 'PERCENT';
export type BoardsMetricDirection = 'UP' | 'DOWN' | 'UNCHANGED' | 'FLAT';

export interface BoardsMetric {
  value: NumericValue;
  previousValue: NumericValue | null;
  changePercent: number | null;
  direction: BoardsMetricDirection;
  polarity: string;
  isImprovement: boolean | null;
  unit: BoardsMetricUnit;
}

export interface BoardsGauge extends BoardsMetric {
  key: string;
  label: string;
}

export interface BoardsStageFunnelItem {
  stageId: string;
  code: string;
  label: string;
  sortOrder: number;
  opportunityCount: number;
  estimatedValueIrr: NumericValue;
  weightedValueIrr: NumericValue;
  sharePercent: number;
}

export interface BoardsMonthlyTrendItem {
  periodStart: string;
  periodEnd: string;
  label: string;
  createdCount: number;
  wonCount: number;
  lostCount: number;
  createdValueIrr: NumericValue;
  wonValueIrr: NumericValue;
  lostValueIrr: NumericValue;
}

export interface BoardsDistributionItem {
  opportunityCount: number;
  estimatedValueIrr: NumericValue;
  weightedValueIrr: NumericValue;
  sharePercent: number;
}

export interface BoardsSourceDistributionItem extends BoardsDistributionItem {
  source: string;
}

export interface BoardsIndustryDistributionItem extends BoardsDistributionItem {
  industry: string;
}

export interface BoardsOwnerPerformanceItem extends BoardsDistributionItem {
  ownerId: string | null;
  ownerName: string;
  team: string | null;
}

export interface BoardsDashboardFilters {
  startDate?: string;
  endDate?: string;
}

export interface BoardsDashboardResponse {
  generatedAt: string;
  audience: 'BOARDS';
  responseVersion: '2.0' | string;
  period: {
    startDate: string;
    endDate: string;
    defaultApplied: boolean;
    defaultDays: number;
  };
  executive: {
    activePipeline: {
      count: BoardsMetric;
      valueIrr: BoardsMetric;
      weightedValueIrr: BoardsMetric;
    };
    periodSales: {
      createdCount: BoardsMetric;
      wonCount: BoardsMetric;
      lostCount: BoardsMetric;
      wonValueIrr: BoardsMetric;
      winRate: BoardsMetric;
    };
    forecast: {
      opportunityCount: BoardsMetric;
      estimatedValueIrr: BoardsMetric;
      weightedValueIrr: BoardsMetric;
    };
    finance: {
      collectedAmountIrr: BoardsMetric;
      collectionRate: BoardsMetric;
      outstandingAmountIrr: BoardsMetric;
      overdueAmountIrr: BoardsMetric;
      overduePaymentCount: BoardsMetric;
    };
    execution: {
      openTaskCount: BoardsMetric;
      overdueTaskCount: BoardsMetric;
      taskOnTimeCompletionRate: BoardsMetric;
      meetingExecutionRate: BoardsMetric;
      meetingsCompletedCount: BoardsMetric;
    };
  };
  gauges: BoardsGauge[];
  funnel: BoardsStageFunnelItem[];
  monthlyTrend: BoardsMonthlyTrendItem[];
  sourceDistribution: BoardsSourceDistributionItem[];
  industryDistribution: BoardsIndustryDistributionItem[];
  ownerPerformance: BoardsOwnerPerformanceItem[];
  commercial: {
    salesChannels: ProductPerformanceReport['byChannel'];
    topProducts: ProductPerformanceReport['byProduct'];
    wonSales: ProductPerformanceReport['wonSales'];
    activePipeline: ProductPerformanceReport['activePipeline'];
    salesTrend: ProductPerformanceReport['trend'];
  };
  finance: {
    current: FinancialCollectionsReport['current'];
    periodFlow: FinancialCollectionsReport['periodFlow'];
    aging: FinancialCollectionsReport['aging'];
    trend: FinancialCollectionsReport['trend'];
  };
  periodComparison: PeriodComparisonReport;
  attention: {
    overdueOpportunities: DashboardOpportunityAttention[];
    overdueTasks: DashboardTaskAttention[];
    pastScheduledMeetings: DashboardMeetingAttention[];
    overdueCloseCount: number;
    opportunitiesWithoutCloseDate: number;
  };
  presentation: {
    recommendedCharts: Record<string, string>;
    contractNote: string;
  };
}
