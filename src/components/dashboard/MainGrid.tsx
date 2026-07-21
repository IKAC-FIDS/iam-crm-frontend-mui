import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Chip, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { can, canAny } from '@/features/auth/utils/permissions';
import { useCurrentOrganization } from '@/features/organizations/hooks/useCurrentOrganization';
import { getOrganizationStatusColor, getOrganizationStatusLabel } from '@/features/organizations/utils/organizationDisplay';
import { useUnreadNotificationCount } from '@/features/notifications/hooks/useNotifications';
import ReportMetricCard, { type MetricCardTone, type MetricComparison } from '@/features/reports/components/ReportMetricCard';
import { getMetricHelp, type MetricHelpKey } from '@/features/reports/metrics/metricHelpRegistry';
import { useDashboardSummary } from '@/features/reports/hooks/useReports';
import type { NumericValue } from '@/features/reports/types/report.types';
import { formatCount, formatPercent } from '@/features/reports/utils/reportDisplay';
import { formatIrrPrice } from '@/features/opportunityLineItems/utils/money';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import { useAuthStore } from '@/store/authStore';

interface Metric { key: MetricHelpKey; label: string; value?: string; unavailable?: boolean; unavailableText?: string; contextLabel?: string; secondaryText?: string; tone?: MetricCardTone; statusLabel?: string; comparison?: MetricComparison }
function Metrics({ title, items }: { title: string; items: Metric[] }) { return <Box><Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography><Grid container spacing={2}>{items.map((item) => <Grid key={item.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}><ReportMetricCard {...item} help={getMetricHelp(item.key)} /></Grid>)}</Grid></Box>; }
function value(input: NumericValue | undefined, money = false) { return money ? formatIrrPrice(input) : formatCount(input); }
function positive(input: NumericValue | undefined) { return Number(input) > 0; }
function actionable(input: NumericValue | undefined, severe = false): Pick<Metric, 'tone' | 'statusLabel'> { return positive(input) ? { tone: severe ? 'error' : 'warning', statusLabel: severe ? 'نیازمند اقدام' : 'نیازمند بررسی' } : {}; }
function AttentionList({ title, rows }: { title: string; rows: Array<{ id: string; title: string; subtitle: string; to?: string }> }) { return <Paper sx={{ p: 2, minWidth: 0 }}><Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography><Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>{rows.length ? rows.map((row) => <Stack key={row.id} direction="row" sx={{ py: 1, justifyContent: 'space-between', gap: 1 }}><Box sx={{ minWidth: 0 }}><Typography noWrap>{row.title}</Typography><Typography variant="caption" color="text.secondary">{row.subtitle}</Typography></Box>{row.to && <Button component={RouterLink} to={row.to} size="small">مشاهده</Button>}</Stack>) : <Typography color="text.secondary">موردی نیازمند توجه نیست.</Typography>}</Stack></Paper>; }

const comparisonMeta: Record<string, { key: MetricHelpKey; label: string }> = {
  OPPORTUNITIES_WON: { key: 'dashboard.comparison.opportunitiesWon', label: 'فرصت‌های موفق' },
  OPPORTUNITIES_WON_VALUE_IRR: { key: 'dashboard.comparison.opportunitiesWonValue', label: 'ارزش فرصت‌های موفق' },
  ACTIVITIES_RECORDED: { key: 'dashboard.comparison.activities', label: 'فعالیت‌ها' },
  TASKS_COMPLETED: { key: 'dashboard.comparison.tasksCompleted', label: 'کارهای تکمیل‌شده' },
  TASK_ON_TIME_COMPLETION_RATE: { key: 'dashboard.comparison.taskOnTimeRate', label: 'نرخ انجام به‌موقع' },
  PAYMENTS_COLLECTED_IRR: { key: 'dashboard.comparison.paymentsCollected', label: 'مبلغ وصول‌شده' },
};

export default function MainGrid() {
  const user = useAuthStore((state) => state.user); const hasReports = can(user, 'report:view', ['ADMIN', 'MANAGER', 'BOARDS']);
  const canOpportunity = can(user, 'opportunity:view'), canTask = can(user, 'task:view'), canMeeting = can(user, 'meeting:view'), canProductView = can(user, 'product:view');
  const canNotifications = can(user, 'notification:view', ['ADMIN']), canOrganization = can(user, 'organization:view', ['ADMIN']);
  const summary = useDashboardSummary({}, hasReports); const unread = useUnreadNotificationCount(canNotifications); const organization = useCurrentOrganization(canOrganization); const data = summary.data;
  const quickLinks = [{ label: 'فرصت‌ها', to: '/opportunities', visible: canOpportunity }, { label: 'کارها', to: '/tasks', visible: canTask }, { label: 'جلسات', to: '/meetings', visible: canMeeting }, { label: 'اعلان‌ها', to: '/notifications', visible: canNotifications }, { label: 'گزارش‌ها', to: '/reports', visible: hasReports }, { label: 'کاتالوگ محصولات', to: '/admin/libraries', visible: canAny(user, ['product:view', 'product:manage'], ['ADMIN']) }].filter((item) => item.visible);
  const periodLabel = data ? `${formatJalaliDateTime(data.period.startDate)} تا ${formatJalaliDateTime(data.period.endDate)}` : undefined;
  const taskRateAvailable = Boolean(data && data.periodPerformance.tasks.onTimeCompletedCount + data.periodPerformance.tasks.lateCompletedCount > 0);
  const winRateAvailable = Boolean(data && data.periodPerformance.opportunities.wonCount + data.periodPerformance.opportunities.lostCount > 0);
  const meetingRateAvailable = Boolean(data && data.periodPerformance.meetings.completedCount + data.periodPerformance.meetings.cancelledCount + data.periodPerformance.meetings.pastScheduledCount > 0);
  return <Stack spacing={3} sx={{ width: '100%', mt: 2 }}>
    {hasReports && summary.isLoading && <Paper sx={{ p: 3 }}><Skeleton height={48} /><Skeleton height={120} /></Paper>}
    {hasReports && summary.isError && <Alert severity="error" action={<Button onClick={() => summary.refetch()}>تلاش مجدد</Button>}>خلاصه مدیریتی در دسترس نیست؛ مقادیر خطا به‌صورت صفر نمایش داده نمی‌شوند.</Alert>}
    {data && <><Typography color="text.secondary">آخرین تولید گزارش: {formatJalaliDateTime(data.generatedAt)}</Typography>
      <Metrics title="تصویر فعلی فروش" items={[
        { key: 'dashboard.current.active.count', label: 'فرصت‌های فعال', value: value(data.current.activeOpportunities.count), contextLabel: 'وضعیت فعلی' },
        { key: 'dashboard.current.active.estimated', label: 'ارزش پایپ‌لاین فعال', value: value(data.current.activeOpportunities.estimatedValueIrr, true) },
        { key: 'dashboard.current.active.weighted', label: 'ارزش وزنی پایپ‌لاین', value: value(data.current.activeOpportunities.weightedValueIrr, true) },
        { key: 'dashboard.current.active.missingValue', label: 'فرصت‌های فاقد ارزش', value: value(data.current.activeOpportunities.missingValueCount), ...actionable(data.current.activeOpportunities.missingValueCount) },
        { key: 'dashboard.current.active.missingProbability', label: 'فرصت‌های فاقد احتمال موفقیت', value: value(data.current.activeOpportunities.missingProbabilityCount), ...actionable(data.current.activeOpportunities.missingProbabilityCount) },
      ]} />
      <Metrics title="کارها و جلسات نیازمند اقدام" items={[
        { key: 'dashboard.current.tasks.open', label: 'کارهای باز', value: value(data.current.tasks.openCount) },
        { key: 'dashboard.current.tasks.overdue', label: 'کارهای سررسید گذشته', value: value(data.current.tasks.overdueCount), ...actionable(data.current.tasks.overdueCount, true) },
        { key: 'dashboard.current.tasks.today', label: 'کارهای امروز', value: value(data.current.tasks.dueTodayCount) },
        { key: 'dashboard.current.meetings.today', label: 'جلسات امروز', value: value(data.current.meetings.todayCount) },
        { key: 'dashboard.current.meetings.upcoming', label: 'جلسات هفت روز آینده', value: value(data.current.meetings.upcomingSevenDaysCount) },
        { key: 'dashboard.current.meetings.pastScheduled', label: 'جلسات گذشته تعیین‌تکلیف‌نشده', value: value(data.current.meetings.pastScheduledCount), ...actionable(data.current.meetings.pastScheduledCount, true) },
      ]} />
      <Metrics title="عملکرد دوره" items={[
        { key: 'dashboard.period.opportunities.created', label: 'فرصت‌های ایجادشده', value: value(data.periodPerformance.opportunities.createdCount), contextLabel: periodLabel },
        { key: 'dashboard.period.opportunities.won', label: 'فرصت‌های موفق', value: value(data.periodPerformance.opportunities.wonCount) },
        { key: 'dashboard.period.opportunities.lost', label: 'فرصت‌های ازدست‌رفته', value: value(data.periodPerformance.opportunities.lostCount) },
        { key: 'dashboard.period.opportunities.wonValue', label: 'ارزش فرصت‌های موفق', value: value(data.periodPerformance.opportunities.wonEstimatedValueIrr, true) },
        { key: 'dashboard.period.opportunities.winRate', label: 'نرخ برد', value: winRateAvailable ? formatPercent(data.periodPerformance.opportunities.winRate) : undefined, unavailable: !winRateAvailable, unavailableText: 'داده کافی برای محاسبه وجود ندارد' },
        { key: 'dashboard.period.tasks.completed', label: 'کارهای تکمیل‌شده', value: value(data.periodPerformance.tasks.completedCount) },
        { key: 'dashboard.period.tasks.onTimeRate', label: 'نرخ انجام به‌موقع کارها', value: taskRateAvailable ? formatPercent(data.periodPerformance.tasks.onTimeCompletionRate) : undefined, unavailable: !taskRateAvailable, unavailableText: 'داده کافی برای محاسبه وجود ندارد' },
        { key: 'dashboard.period.meetings.completed', label: 'جلسات برگزارشده', value: value(data.periodPerformance.meetings.completedCount) },
        { key: 'dashboard.period.meetings.executionRate', label: 'نرخ برگزاری جلسات', value: meetingRateAvailable ? formatPercent(data.periodPerformance.meetings.executionRate) : undefined, unavailable: !meetingRateAvailable, unavailableText: 'داده کافی برای محاسبه وجود ندارد' },
      ]} />
      <Metrics title="پیش‌بینی ۹۰ روزه" items={[
        { key: 'dashboard.forecast.count', label: 'تعداد فرصت‌های Forecast', value: value(data.forecast.opportunityCount), contextLabel: 'افق ۹۰ روزه' },
        { key: 'dashboard.forecast.estimated', label: 'ارزش اسمی Forecast', value: value(data.forecast.estimatedValueIrr, true) },
        { key: 'dashboard.forecast.weighted', label: 'ارزش وزنی Forecast', value: value(data.forecast.weightedValueIrr, true) },
        { key: 'dashboard.forecast.overdue', label: 'فرصت‌های دارای تاریخ بستن گذشته', value: value(data.forecast.overdueCloseCount), ...actionable(data.forecast.overdueCloseCount, true) },
        { key: 'dashboard.forecast.noDate', label: 'فرصت‌های بدون تاریخ بستن', value: value(data.forecast.withoutCloseDateCount), ...actionable(data.forecast.withoutCloseDateCount) },
      ]} />
      {data.finance ? <Metrics title="مالی و وصول" items={[
        { key: 'dashboard.finance.outstanding', label: 'مانده وصول‌نشده', value: formatIrrPrice(data.finance.outstandingAmountIrr) },
        { key: 'dashboard.finance.overdue', label: 'مطالبات سررسید گذشته', value: formatIrrPrice(data.finance.overdueAmountIrr), ...actionable(data.finance.overdueAmountIrr, true) },
        { key: 'dashboard.finance.collected', label: 'وصول‌شده در دوره', value: formatIrrPrice(data.finance.collectedInPeriodAmountIrr) },
        { key: 'dashboard.finance.overdueCount', label: 'تعداد مطالبات سررسید گذشته', value: formatCount(data.finance.overduePaymentCount), ...actionable(data.finance.overduePaymentCount) },
      ]} /> : <Alert severity="info">خلاصه مالی در این نسخه پاسخ backend موجود نیست.</Alert>}
      {data.catalog ? <Metrics title="قیمت‌گذاری و کاتالوگ" items={[
        { key: 'dashboard.catalog.active', label: 'محصولات فعال', value: formatCount(data.catalog.activeProductCount), contextLabel: 'کاتالوگ سراسری' },
        { key: 'dashboard.catalog.usd', label: 'محصولات دلاری', value: formatCount(data.catalog.usdProductCount) },
        { key: 'dashboard.catalog.irr', label: 'محصولات ریالی', value: formatCount(data.catalog.irrProductCount) },
        { key: 'dashboard.catalog.exchangeRate', label: 'نرخ فعلی دلار', value: data.catalog.currentExchangeRate == null ? undefined : `هر ۱ دلار = ${formatIrrPrice(data.catalog.currentExchangeRate)}`, unavailable: data.catalog.currentExchangeRate == null, secondaryText: data.catalog.currentExchangeRateValidFrom ? `فعال از ${formatJalaliDateTime(data.catalog.currentExchangeRateValidFrom)}` : undefined },
        { key: 'dashboard.catalog.stale', label: 'محصولات دلاری با نرخ قدیمی', value: formatCount(data.catalog.staleUsdProductCount), ...actionable(data.catalog.staleUsdProductCount) },
      ]} /> : <Alert severity="info">خلاصه قیمت‌گذاری در این نسخه پاسخ backend موجود نیست.</Alert>}
      {data.salesChannels ? <Metrics title="کانال فروش فرصت‌های موفق دوره" items={[
        { key: 'dashboard.channel.inPerson', label: 'فروش حضوری', value: formatIrrPrice(data.salesChannels.wonInPersonAmountIrr), contextLabel: 'فرصت‌های موفق دوره' },
        { key: 'dashboard.channel.digikala', label: 'فروش دیجی‌کالا', value: formatIrrPrice(data.salesChannels.wonDigikalaAmountIrr) },
        { key: 'dashboard.channel.other', label: 'فروش سایر', value: formatIrrPrice(data.salesChannels.wonOtherAmountIrr) },
        { key: 'dashboard.channel.legacy', label: 'فروش با کانال نامشخص قدیمی', value: formatIrrPrice(data.salesChannels.wonLegacyUnknownAmountIrr) },
      ]} /> : <Alert severity="info">خلاصه کانال‌های فروش در این نسخه پاسخ backend موجود نیست.</Alert>}
      {data.dataQuality ? <><Metrics title="کیفیت داده‌های سازمان" items={[
        { key: 'dashboard.quality.organization.score', label: 'امتیاز کلی', value: data.dataQuality.overallScore == null ? undefined : formatPercent(data.dataQuality.overallScore), unavailable: data.dataQuality.overallScore == null },
        { key: 'dashboard.quality.organization.critical', label: 'موارد بحرانی', value: formatCount(data.dataQuality.criticalIssueCount), ...actionable(data.dataQuality.criticalIssueCount, true) },
        { key: 'dashboard.quality.organization.high', label: 'موارد با اولویت بالا', value: formatCount(data.dataQuality.highIssueCount), ...actionable(data.dataQuality.highIssueCount) },
        { key: 'dashboard.quality.organization.total', label: 'کل موارد نقص', value: formatCount(data.dataQuality.totalIssueOccurrences) },
      ]} /><Button component={RouterLink} to="/reports?tab=data-quality">مشاهده گزارش کیفیت داده</Button></> : <Alert severity="info">خلاصه کیفیت داده‌های سازمان در پاسخ backend موجود نیست.</Alert>}
      {canProductView && (data.catalogQuality ? <Metrics title="کیفیت کاتالوگ سراسری" items={[
        { key: 'dashboard.quality.catalog.score', label: 'امتیاز کلی کاتالوگ', value: data.catalogQuality.overallScore == null ? undefined : formatPercent(data.catalogQuality.overallScore), unavailable: data.catalogQuality.overallScore == null },
        { key: 'dashboard.quality.catalog.critical', label: 'موارد بحرانی', value: formatCount(data.catalogQuality.criticalIssueCount), ...actionable(data.catalogQuality.criticalIssueCount, true) },
        { key: 'dashboard.quality.catalog.high', label: 'موارد با اولویت بالا', value: formatCount(data.catalogQuality.highIssueCount), ...actionable(data.catalogQuality.highIssueCount) },
        { key: 'dashboard.quality.catalog.total', label: 'کل موارد نقص', value: formatCount(data.catalogQuality.totalIssueOccurrences) },
      ]} /> : <Alert severity="info">کیفیت کاتالوگ سراسری در پاسخ backend موجود نیست.</Alert>)}
      {data.periodComparison ? <Metrics title="مقایسه با دوره قبل" items={data.periodComparison.metrics.flatMap((metric) => { const meta = comparisonMeta[metric.key]; if (!meta) return []; const display = metric.key.endsWith('_IRR') ? formatIrrPrice : metric.key.includes('RATE') ? formatPercent : formatCount; return [{ key: meta.key, label: meta.label, value: display(metric.currentValue), contextLabel: 'مقایسه با دوره قبل', comparison: { previousValue: display(metric.comparisonValue), percentChange: metric.percentChange == null ? null : formatPercent(metric.percentChange), direction: metric.direction, isImprovement: metric.isImprovement }, tone: metric.isImprovement === true ? 'success' : metric.isImprovement === false ? 'error' : 'default' }]; })} /> : <Alert severity="info">خلاصه مقایسه دوره‌ها در پاسخ backend موجود نیست.</Alert>}
      <Grid container spacing={2}><Grid size={{ xs: 12, lg: 4 }}><AttentionList title="فرصت‌های دارای تاریخ بستن گذشته" rows={data.attention.overdueOpportunities.map((item) => ({ id: item.id, title: item.title, subtitle: `${formatJalaliDateTime(item.expectedCloseDate)} · ${item.stage?.label ?? '—'}`, to: canOpportunity ? `/opportunities/${item.id}` : undefined }))} /></Grid><Grid size={{ xs: 12, lg: 4 }}><AttentionList title="کارهای سررسید گذشته" rows={data.attention.overdueTasks.map((item) => ({ id: item.id, title: item.title, subtitle: `${formatJalaliDateTime(item.dueAt)} · ${item.priority}`, to: canTask ? `/tasks?taskId=${item.id}` : undefined }))} /></Grid><Grid size={{ xs: 12, lg: 4 }}><AttentionList title="جلسات گذشته برنامه‌ریزی‌شده" rows={data.attention.pastScheduledMeetings.map((item) => ({ id: item.id, title: item.title, subtitle: formatJalaliDateTime(item.startAt), to: canMeeting ? `/meetings/${item.id}` : undefined }))} /></Grid></Grid>
    </>}
    {canNotifications && <ReportMetricCard label="اعلان‌های خوانده‌نشده" value={unread.isError ? undefined : formatCount(unread.data?.total)} unavailable={unread.isError} help={getMetricHelp('dashboard.notifications.unread')} />}
    {canOrganization && <Paper sx={{ p: 2 }}><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Box><Typography variant="h6">وضعیت سازمان جاری</Typography><Typography>{organization.data?.name ?? (organization.isLoading ? 'در حال دریافت...' : 'ناموجود')}</Typography></Box>{organization.data && <Chip color={getOrganizationStatusColor(organization.data.status)} label={getOrganizationStatusLabel(organization.data.status)} />}</Stack></Paper>}
    {quickLinks.length > 0 && <Paper sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 1 }}>دسترسی سریع</Typography><Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>{quickLinks.map((link) => <Button key={link.to} component={RouterLink} to={link.to} variant="outlined" size="small" startIcon={<ArrowForwardIcon />}>{link.label}</Button>)}</Stack></Paper>}
  </Stack>;
}
