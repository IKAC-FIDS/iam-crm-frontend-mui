import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ActivityByUserSection from '../components/ActivityByUserSection';
import ActivityReportSection from '../components/ActivityReportSection';
import { AgingSection, ForecastSection, MeetingPerformanceSection, TaskPerformanceSection } from '../components/AdvancedReportSections';
import ConversionRatesSection from '../components/ConversionRatesSection';
import PipelineByOwnerSection from '../components/PipelineByOwnerSection';
import PipelineSummarySection from '../components/PipelineSummarySection';
import ReportFilterPanel from '../components/ReportFilterPanel';
import StageDurationsSection from '../components/StageDurationsSection';
import { ExchangeRateImpactSection, FinancialCollectionsSection, ProductPerformanceSection } from '../components/CommercialReportSections';
import { DataQualitySectionView, PeriodComparisonSection } from '../components/PhaseThreeReportSections';
import ReportExportButton from '../components/ReportExportButton';
import { reportQueryKeys, useActivitiesByUserReport, useActivityReport, useConversionRatesReport, useDataQualityReport, useExchangeRateImpactReport, useFinancialCollectionsReport, useForecastReport, useMeetingPerformanceReport, useOpportunityAgingReport, usePeriodComparisonReport, usePipelineByOwnerReport, usePipelineSummaryReport, useProductPerformanceReport, useReportFilterOptions, useStageDurationsReport, useTaskPerformanceReport } from '../hooks/useReports';
import type { ReportFilters } from '../types/report.types';
import type { CompanyOption } from '@/features/companies/types/company.types';
import { defaultActivityDateRange, isForbiddenError } from '../utils/reportDisplay';

type ReportTab = 'overview' | 'forecast' | 'aging' | 'meetings' | 'tasks' | 'financial' | 'products' | 'exchange' | 'data-quality' | 'comparison';
const tabs: Array<{ value: ReportTab; label: string }> = [{ value: 'overview', label: 'نمای کلی' }, { value: 'forecast', label: 'پیش‌بینی فروش' }, { value: 'aging', label: 'Aging فرصت‌ها' }, { value: 'meetings', label: 'جلسات' }, { value: 'tasks', label: 'کارها و SLA' }, { value: 'financial', label: 'مالی و وصول' }, { value: 'products', label: 'عملکرد محصولات' }, { value: 'exchange', label: 'نرخ ارز و اثر قیمت' }, { value: 'data-quality', label: 'کیفیت داده' }, { value: 'comparison', label: 'مقایسه دوره‌ها' }];
const arrayKeys: Array<keyof ReportFilters> = ['companyIds', 'userIds', 'teams', 'ownerIds', 'stages', 'priorities', 'industries', 'leadSources', 'activityTypes', 'meetingStatuses', 'meetingModes', 'taskStatuses', 'productIds', 'categories', 'salesChannels', 'entityTypes', 'severities', 'ruleKeys'];
function defaults(): ReportFilters { return { ...defaultActivityDateRange(), ownershipScope: 'all', comparisonMode: 'PREVIOUS_PERIOD' }; }
function fromUrl(params: URLSearchParams): ReportFilters { const result = defaults(); for (const key of ['startDate', 'endDate', 'ownershipScope', 'comparisonMode', 'compareStartDate', 'compareEndDate'] as const) { const value = params.get(key); if (value) Object.assign(result, { [key]: value }); } for (const key of arrayKeys) { const value = params.get(key); if (value) Object.assign(result, { [key]: value.split(',').filter(Boolean) }); } return result; }
function setFilterParams(params: URLSearchParams, filters: ReportFilters) { for (const key of ['startDate', 'endDate', 'ownershipScope', 'comparisonMode', 'compareStartDate', 'compareEndDate', ...arrayKeys] as Array<keyof ReportFilters>) { const value = filters[key]; const serialized = Array.isArray(value) ? value.join(',') : value; if (serialized && !(key === 'ownershipScope' && serialized === 'all') && !(key === 'comparisonMode' && serialized === 'PREVIOUS_PERIOD')) params.set(key, String(serialized)); else params.delete(key); } }

export default function ReportsPage() {
  const user = useAuthStore((s) => s.user); const hasAccess = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const [params, setParams] = useSearchParams(); const queryClient = useQueryClient();
  const rawTab = params.get('tab'); const tab: ReportTab = tabs.some((x) => x.value === rawTab) ? rawTab as ReportTab : 'overview';
  const [draft, setDraft] = useState<ReportFilters>(() => fromUrl(params)); const [filters, setFilters] = useState<ReportFilters>(() => fromUrl(params));
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyOption[]>([]);
  const agingPage = Math.max(0, Number(params.get('agingPage') || 1) - 1); const agingLimit = [10, 20, 50, 100].includes(Number(params.get('agingLimit'))) ? Number(params.get('agingLimit')) : 20;
  const impactPage = Math.max(0, Number(params.get('impactPage') || 1) - 1); const impactLimit = [10, 20, 50, 100].includes(Number(params.get('impactLimit'))) ? Number(params.get('impactLimit')) : 20;
  const options = useReportFilterOptions(hasAccess);
  const overview = tab === 'overview';
  const pipeline = usePipelineSummaryReport(filters, hasAccess && overview); const conversion = useConversionRatesReport(filters, hasAccess && overview); const durations = useStageDurationsReport(filters, hasAccess && overview); const activities = useActivityReport(filters, hasAccess && overview); const activitiesByUser = useActivitiesByUserReport(filters, hasAccess && overview); const pipelineByOwner = usePipelineByOwnerReport(filters, hasAccess && overview);
  const forecast = useForecastReport(filters, hasAccess && tab === 'forecast'); const aging = useOpportunityAgingReport({ ...filters, startDate: undefined, endDate: undefined, page: agingPage + 1, limit: agingLimit }, hasAccess && tab === 'aging'); const meetings = useMeetingPerformanceReport(filters, hasAccess && tab === 'meetings'); const tasks = useTaskPerformanceReport(filters, hasAccess && tab === 'tasks');
  const financial = useFinancialCollectionsReport(filters, hasAccess && tab === 'financial'); const products = useProductPerformanceReport(filters, hasAccess && tab === 'products'); const exchange = useExchangeRateImpactReport({ ...filters, ownershipScope: undefined, companyIds: undefined, ownerIds: undefined, teams: undefined, page: impactPage + 1, limit: impactLimit }, hasAccess && tab === 'exchange');
  const quality = useDataQualityReport(filters, hasAccess && tab === 'data-quality'); const comparison = usePeriodComparisonReport(filters, hasAccess && tab === 'comparison');
  const allQueries = [pipeline, conversion, durations, activities, activitiesByUser, pipelineByOwner, forecast, aging, meetings, tasks, financial, products, exchange, quality, comparison];
  if (!hasAccess) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;
  if ([options.error, ...allQueries.map((q) => q.error)].some(isForbiddenError)) return <Alert severity="warning">شما دسترسی مشاهده گزارش‌ها را ندارید.</Alert>;
  const updateParams = (mutate: (next: URLSearchParams) => void) => { const next = new URLSearchParams(params); mutate(next); setParams(next, { replace: true }); };
  const apply = () => { const next = { ...draft }; setFilters(next); updateParams((p) => { setFilterParams(p, next); p.set('agingPage', '1'); }); };
  const reset = () => { const next = defaults(); setDraft(next); setFilters(next); setSelectedCompanies([]); setParams(new URLSearchParams(), { replace: true }); };
  return <Box sx={{ minWidth: 0 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}><Box><Typography variant="h4">گزارش‌ها</Typography><Typography color="text.secondary">گزارش‌های مدیریتی مبتنی بر داده‌های تجمیعی سمت سرور.</Typography></Box><Stack direction="row"><ReportExportButton tab={tab} filters={filters} /><Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => queryClient.invalidateQueries({ queryKey: reportQueryKeys.all })}>به‌روزرسانی گزارش‌ها</Button></Stack></Stack>
    <Paper sx={{ mb: 3 }}><Tabs value={tab} onChange={(_, value: ReportTab) => updateParams((p) => value === 'overview' ? p.delete('tab') : p.set('tab', value))} variant="scrollable" scrollButtons="auto">{tabs.map((item) => <Tab key={item.value} value={item.value} label={item.label} />)}</Tabs></Paper>
    <Stack spacing={4}><ReportFilterPanel tab={tab} draft={draft} selectedCompanies={selectedCompanies} options={options.data} isLoading={options.isLoading} isError={options.isError} isApplying={allQueries.some((q) => q.isFetching)} onChange={setDraft} onCompaniesChange={(companies) => { setSelectedCompanies(companies); setDraft((f) => ({ ...f, companyIds: companies.map((c) => c.id) })); }} onApply={apply} onReset={reset} />
      {tab === 'overview' && <><PipelineSummarySection data={pipeline.data} isLoading={pipeline.isLoading} isError={pipeline.isError} /><ConversionRatesSection data={conversion.data} isLoading={conversion.isLoading} isError={conversion.isError} /><StageDurationsSection data={durations.data} isLoading={durations.isLoading} isError={durations.isError} /><ActivityReportSection data={activities.data} isLoading={activities.isLoading} isError={activities.isError} /><ActivityByUserSection data={activitiesByUser.data} isLoading={activitiesByUser.isLoading} isError={activitiesByUser.isError} /><PipelineByOwnerSection data={pipelineByOwner.data} isLoading={pipelineByOwner.isLoading} isError={pipelineByOwner.isError} /></>}
      {tab === 'forecast' && <ForecastSection query={forecast} />}
      {tab === 'aging' && <AgingSection query={aging} pagination={{ page: agingPage, pageSize: agingLimit }} onPagination={(model) => updateParams((p) => { p.set('agingPage', String(model.page + 1)); p.set('agingLimit', String(model.pageSize)); })} />}
      {tab === 'meetings' && <MeetingPerformanceSection query={meetings} />}
      {tab === 'tasks' && <TaskPerformanceSection query={tasks} />}
      {tab === 'financial' && <FinancialCollectionsSection query={financial} />}
      {tab === 'products' && <ProductPerformanceSection query={products} />}
      {tab === 'exchange' && <ExchangeRateImpactSection query={exchange} pagination={{ page: impactPage, pageSize: impactLimit }} onPagination={(model) => updateParams((p) => { p.set('impactPage', String(model.page + 1)); p.set('impactLimit', String(model.pageSize)); })} />}
      {tab === 'data-quality' && <DataQualitySectionView query={quality} filters={{ ...filters }} />}
      {tab === 'comparison' && <PeriodComparisonSection query={comparison} />}
    </Stack></Box>;
}
