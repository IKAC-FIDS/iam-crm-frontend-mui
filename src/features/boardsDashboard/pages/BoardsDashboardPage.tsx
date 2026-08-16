import { useMemo, useState } from 'react';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

import ChartCard from '../components/ChartCard';
import ExecutiveKpiCard from '../components/ExecutiveKpiCard';
import ManagementAttention from '../components/ManagementAttention';
import { useBoardsDashboard } from '../hooks/useBoardsDashboard';
import type { BoardsDashboardFilters } from '../types/boardsDashboard.types';
import {
  agingLabel,
  formatPersianDate,
  formatPersianMonth,
  industryLabel,
  salesChannelLabel,
  sourceLabel,
  toBillions,
  toNumber,
} from '../utils/boardsDashboardFormatters';

type TrendMode = 'COUNT' | 'IRR';

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function presetRange(days: number): BoardsDashboardFilters {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { startDate: dateOnly(start), endDate: dateOnly(end) };
}

export default function BoardsDashboardPage() {
  const [filters, setFilters] = useState<BoardsDashboardFilters>({});
  const [trendMode, setTrendMode] = useState<TrendMode>('COUNT');
  const query = useBoardsDashboard(filters);
  const data = query.data;

  const kpis = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'ارزش پایپ‌لاین فعال', metric: data.executive.activePipeline.valueIrr },
      { label: 'پایپ‌لاین موزون', metric: data.executive.activePipeline.weightedValueIrr },
      { label: 'فروش موفق دوره', metric: data.executive.periodSales.wonValueIrr },
      { label: 'نرخ موفقیت', metric: data.executive.periodSales.winRate },
      { label: 'پیش‌بینی موزون فروش', metric: data.executive.forecast.weightedValueIrr },
      { label: 'وصول دوره', metric: data.executive.finance.collectedAmountIrr },
      { label: 'مطالبات معوق', metric: data.executive.finance.overdueAmountIrr },
      { label: 'نرخ وصول', metric: data.executive.finance.collectionRate },
    ];
  }, [data]);

  if (query.isLoading && !data) {
    return (
      <Box sx={{ minHeight: 420, display: 'grid', placeItems: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress />
          <Typography color="text.secondary">در حال آماده‌سازی داشبورد مدیریتی...</Typography>
        </Stack>
      </Box>
    );
  }

  if (query.isError || !data) {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" onClick={() => void query.refetch()}>تلاش مجدد</Button>}
      >
        دریافت اطلاعات داشبورد مدیریتی با خطا مواجه شد.
      </Alert>
    );
  }

  const monthlyLabels = data.monthlyTrend.map((item) => formatPersianMonth(item.periodStart));
  const sourcePie = data.sourceDistribution.slice(0, 8).map((item, index) => ({
    id: index,
    value: item.opportunityCount,
    label: sourceLabel(item.source),
  }));
  const channelPie = data.commercial.salesChannels
    .filter((item) => toNumber(item.netValueIrr) > 0)
    .map((item, index) => ({
      id: index,
      value: toBillions(item.netValueIrr),
      label: salesChannelLabel(item.salesChannel),
    }));

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', lg: 'center' },
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            داشبورد مدیریتی
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            نمای کلان فروش، وصول، عملکرد و نقاط نیازمند توجه مدیریت
          </Typography>
          <Typography variant="caption" color="text.secondary">
            دوره گزارش: {formatPersianDate(data.period.startDate)} تا {formatPersianDate(data.period.endDate)}
          </Typography>
        </Box>

        <Stack spacing={1.25} sx={{ alignItems: { xs: "stretch", lg: "flex-end" } }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Button size="small" variant="outlined" onClick={() => setFilters(presetRange(30))}>۳۰ روز</Button>
            <Button size="small" variant="outlined" onClick={() => setFilters(presetRange(90))}>۹۰ روز</Button>
            <Button size="small" variant="outlined" onClick={() => setFilters(presetRange(180))}>۱۸۰ روز</Button>
            <Button size="small" variant="outlined" onClick={() => setFilters({})}>پیش‌فرض</Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<RefreshRounded />}
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              بروزرسانی
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TextField
              type="date"
              size="small"
              value={filters.startDate ?? ''}
              onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value || undefined }))}
              slotProps={{ htmlInput: { 'aria-label': 'تاریخ شروع' } }}
            />
            <Typography variant="body2" color="text.secondary">تا</Typography>
            <TextField
              type="date"
              size="small"
              value={filters.endDate ?? ''}
              onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value || undefined }))}
              slotProps={{ htmlInput: { 'aria-label': 'تاریخ پایان' } }}
            />
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {kpis.map((item) => (
          <ExecutiveKpiCard key={item.label} label={item.label} metric={item.metric} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '5fr 7fr' },
          gap: 2,
        }}
      >
        <ChartCard title="قیف فروش فعال" subtitle="ارزش موزون فرصت‌ها در مراحل فعلی">
          {data.funnel.length ? (
            <BarChart
              height={300}
              layout="horizontal"
              yAxis={[{ scaleType: 'band', data: data.funnel.map((item) => item.label) }]}
              series={[{
                data: data.funnel.map((item) => toBillions(item.weightedValueIrr)),
                label: 'میلیارد ریال',
              }]}
            />
          ) : (
            <Alert severity="info">داده‌ای برای قیف فروش موجود نیست.</Alert>
          )}
        </ChartCard>

        <ChartCard
          title="روند ۱۲ ماهه فرصت‌ها"
          subtitle={trendMode === 'COUNT' ? 'تعداد فرصت‌های ایجادشده، موفق و از‌دست‌رفته' : 'ارزش فرصت‌ها به میلیارد ریال'}
        >
          <Stack sx={{ mb: 1, alignItems: "flex-end" }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={trendMode}
              onChange={(_, value: TrendMode | null) => value && setTrendMode(value)}
            >
              <ToggleButton value="COUNT">تعداد</ToggleButton>
              <ToggleButton value="IRR">ارزش</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <BarChart
            height={260}
            xAxis={[{ scaleType: 'band', data: monthlyLabels }]}
            series={[
              {
                data: data.monthlyTrend.map((item) => trendMode === 'COUNT' ? item.createdCount : toBillions(item.createdValueIrr)),
                label: 'ایجادشده',
              },
              {
                data: data.monthlyTrend.map((item) => trendMode === 'COUNT' ? item.wonCount : toBillions(item.wonValueIrr)),
                label: 'موفق',
              },
              {
                data: data.monthlyTrend.map((item) => trendMode === 'COUNT' ? item.lostCount : toBillions(item.lostValueIrr)),
                label: 'از دست‌رفته',
              },
            ]}
          />
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <ChartCard title="نرخ موفقیت" subtitle="درصد فرصت‌های موفق از فرصت‌های بسته‌شده" minHeight={330}>
          <Box sx={{ display: 'grid', placeItems: 'center' }}>
            <Gauge
              width={220}
              height={220}
              value={Math.max(0, Math.min(100, toNumber(data.executive.periodSales.winRate.value)))}
              valueMin={0}
              valueMax={100}
              text={({ value }) => `${Number(value ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`}
            />
          </Box>
        </ChartCard>

        <ChartCard title="منبع فرصت‌ها" subtitle="ترکیب فرصت‌های فعال بر اساس Source" minHeight={330}>
          {sourcePie.length ? (
            <PieChart
              height={240}
              series={[{ data: sourcePie, innerRadius: 45, outerRadius: 90, paddingAngle: 2 }]}
            />
          ) : <Alert severity="info">داده‌ای موجود نیست.</Alert>}
        </ChartCard>

        <ChartCard title="ترکیب صنایع" subtitle="پایپ‌لاین موزون بر اساس صنعت" minHeight={330}>
          <BarChart
            height={240}
            layout="horizontal"
            yAxis={[{
              scaleType: 'band',
              data: data.industryDistribution.slice(0, 7).map((item) => industryLabel(item.industry)),
            }]}
            series={[{
              data: data.industryDistribution.slice(0, 7).map((item) => toBillions(item.weightedValueIrr)),
              label: 'میلیارد ریال',
            }]}
          />
        </ChartCard>

        <ChartCard title="کانال فروش" subtitle="سهم ارزش فروش بر اساس کانال" minHeight={330}>
          {channelPie.length ? (
            <PieChart
              height={240}
              series={[{ data: channelPie, innerRadius: 45, outerRadius: 90, paddingAngle: 2 }]}
            />
          ) : <Alert severity="info">داده‌ای موجود نیست.</Alert>}
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' },
          gap: 2,
        }}
      >
        <ChartCard title="وصول و مطالبات" subtitle="مقایسه وضعیت مالی جاری به میلیارد ریال">
          <BarChart
            height={290}
            xAxis={[{ scaleType: 'band', data: ['وصول دوره', 'مطالبات باز', 'مطالبات معوق'] }]}
            series={[{
              data: [
                toBillions(data.finance.periodFlow.collectedAmountIrr),
                toBillions(data.finance.current.outstandingAmountIrr),
                toBillions(data.finance.current.overdueAmountIrr),
              ],
              label: 'میلیارد ریال',
            }]}
          />
        </ChartCard>

        <ChartCard title="روند وصول" subtitle="وصول، ایجاد مطالبات و سررسید به میلیارد ریال">
          <LineChart
            height={290}
            xAxis={[{
              scaleType: 'point',
              data: data.finance.trend.map((item) => formatPersianMonth(item.periodStart)),
            }]}
            series={[
              { data: data.finance.trend.map((item) => toBillions(item.collectedAmountIrr)), label: 'وصول' },
              { data: data.finance.trend.map((item) => toBillions(item.createdReceivableAmountIrr)), label: 'مطالبات ایجادشده' },
              { data: data.finance.trend.map((item) => toBillions(item.dueAmountIrr)), label: 'سررسید' },
            ]}
          />
        </ChartCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' },
          gap: 2,
        }}
      >
        <ChartCard title="سن مطالبات" subtitle="Aging مطالبات به میلیارد ریال">
          <BarChart
            height={290}
            xAxis={[{ scaleType: 'band', data: data.finance.aging.map((item) => agingLabel(item.key)) }]}
            series={[{
              data: data.finance.aging.map((item) => toBillions(item.amountIrr)),
              label: 'میلیارد ریال',
            }]}
          />
        </ChartCard>

        <ChartCard title="عملکرد تیم فروش" subtitle="۸ مالک برتر بر اساس پایپ‌لاین موزون">
          <BarChart
            height={290}
            layout="horizontal"
            yAxis={[{
              scaleType: 'band',
              data: data.ownerPerformance.slice(0, 8).map((item) => item.ownerName),
            }]}
            series={[{
              data: data.ownerPerformance.slice(0, 8).map((item) => toBillions(item.weightedValueIrr)),
              label: 'میلیارد ریال',
            }]}
          />
        </ChartCard>
      </Box>

      <ChartCard title="شاخص‌های اجرایی" subtitle="چهار شاخص کلیدی عملکرد" minHeight={320}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1,
          }}
        >
          {data.gauges.map((gauge) => (
            <Box key={gauge.key} sx={{ textAlign: 'center' }}>
              <Gauge
                width={210}
                height={180}
                value={Math.max(0, Math.min(100, toNumber(gauge.value)))}
                valueMin={0}
                valueMax={100}
                text={({ value }) => `${Number(value ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`}
              />
              <Typography variant="body2" sx={{ mt: -1, fontWeight: 700 }}>
                {gauge.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </ChartCard>

      <Divider />

      <Box>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 800 }}>
          نیازمند توجه مدیریت
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          مواردی که می‌توانند به تصمیم یا پیگیری مدیریتی نیاز داشته باشند
        </Typography>
        <ManagementAttention attention={data.attention} />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "end" }}>
        آخرین تولید گزارش: {formatPersianDate(data.generatedAt)} · نسخه قرارداد API: {data.responseVersion}
      </Typography>
    </Stack>
  );
}
