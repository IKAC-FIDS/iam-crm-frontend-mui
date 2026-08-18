import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { formatIrrPrice } from '@/features/opportunityLineItems/utils/money';
import ReportMetricCard from '@/features/reports/components/ReportMetricCard';
import type {
  DashboardSummary,
  NumericValue,
} from '@/features/reports/types/report.types';
import { formatCount } from '@/features/reports/utils/reportDisplay';

type TrendMode = 'count' | 'value';

export interface ManagementDashboardFields {
  portfolio: {
    total: {
      count: number;
      estimatedValueIrr: NumericValue;
    };

    active: {
      count: number;
      estimatedValueIrr: NumericValue;
      percentage: NumericValue;
    };

    won: {
      count: number;
      estimatedValueIrr: NumericValue;
      percentage: NumericValue;
    };

    lost: {
      count: number;
      estimatedValueIrr: NumericValue;
      percentage: NumericValue;
    };
  };

  opportunityTrend12m: Array<{
    periodStart: string;
    periodEnd: string;

    createdCount: number;
    wonCount: number;
    lostCount: number;

    createdValueIrr: NumericValue;
    wonValueIrr: NumericValue;
    lostValueIrr: NumericValue;
  }>;
}

export type ManagementDashboardSummary = DashboardSummary &
  ManagementDashboardFields;

interface SalesManagementOverviewProps {
  data: ManagementDashboardSummary;
  periodLabel?: string;
}

const BILLION_IRR = 1_000_000_000;

function asNumber(value: NumericValue | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function percentLabel(value: NumericValue | null | undefined): string {
  return `${asNumber(value).toLocaleString('fa-IR')}٪`;
}

function monthLabel(date: string): string {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export default function SalesManagementOverview({
  data,
  periodLabel,
}: SalesManagementOverviewProps) {
  const theme = useTheme();
  const [trendMode, setTrendMode] = useState<TrendMode>('count');

  const totalStatusCount =
    data.portfolio.active.count +
    data.portfolio.won.count +
    data.portfolio.lost.count;

  const statusData = useMemo(
    () => [
      {
        id: 'ACTIVE',
        value: data.portfolio.active.count,
        label: `فعال — ${percentLabel(data.portfolio.active.percentage)}`,
      },
      {
        id: 'WON',
        value: data.portfolio.won.count,
        label: `موفق — ${percentLabel(data.portfolio.won.percentage)}`,
      },
      {
        id: 'LOST',
        value: data.portfolio.lost.count,
        label: `از دست‌رفته — ${percentLabel(data.portfolio.lost.percentage)}`,
      },
    ],
    [data.portfolio],
  );

  const trendDataset = useMemo(
    () =>
      data.opportunityTrend12m.map((item) => ({
        month: monthLabel(item.periodStart),

        created:
          trendMode === 'count'
            ? item.createdCount
            : asNumber(item.createdValueIrr) / BILLION_IRR,

        won:
          trendMode === 'count'
            ? item.wonCount
            : asNumber(item.wonValueIrr) / BILLION_IRR,

        lost:
          trendMode === 'count'
            ? item.lostCount
            : asNumber(item.lostValueIrr) / BILLION_IRR,
      })),
    [data.opportunityTrend12m, trendMode],
  );

  const chartValueFormatter = (value: number | null): string => {
    const normalized = Number(value ?? 0);

    if (trendMode === 'count') {
      return formatCount(normalized);
    }

    return `${normalized.toLocaleString('fa-IR', {
      maximumFractionDigits: 1,
    })} میلیارد ریال`;
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          نمای کلان فروش
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReportMetricCard
              label="کل ارزش فرصت‌ها"
              value={formatIrrPrice(data.portfolio.total.estimatedValueIrr)}
              contextLabel="فعال + موفق + از دست‌رفته"
              secondaryText={`${formatCount(data.portfolio.total.count)} فرصت`}
              help={{
                title: 'کل ارزش فرصت‌ها',
                description:
                  'مجموع ارزش برآوردی همه فرصت‌های غیرآرشیوی شامل فرصت‌های فعال، موفق و از دست‌رفته.',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReportMetricCard
              label="ارزش پایپ‌لاین فعال"
              value={formatIrrPrice(
                data.current.activeOpportunities.estimatedValueIrr,
              )}
              contextLabel="فقط فرصت‌های فعال"
              secondaryText={`${formatCount(
                data.current.activeOpportunities.count,
              )} فرصت فعال`}
              help={{
                title: 'ارزش پایپ‌لاین فعال',
                description:
                  'مجموع ارزش فرصت‌هایی که هنوز در یکی از مراحل نهایی موفق یا از دست‌رفته قرار نگرفته‌اند.',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReportMetricCard
              label="فروش موفق کل"
              value={formatIrrPrice(data.portfolio.won.estimatedValueIrr)}
              contextLabel="از ابتدا تا زمان جاری"
              secondaryText={`${formatCount(
                data.portfolio.won.count,
              )} فرصت موفق`}
              help={{
                title: 'فروش موفق کل',
                description:
                  'مجموع ارزش برآوردی تمام فرصت‌های غیرآرشیوی که در وضعیت موفق (WON) قرار دارند.',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <ReportMetricCard
              label="فروش موفق دوره"
              value={formatIrrPrice(
                data.periodPerformance.opportunities.wonEstimatedValueIrr,
              )}
              contextLabel={periodLabel}
              secondaryText={`${formatCount(
                data.periodPerformance.opportunities.wonCount,
              )} فرصت موفق در دوره`}
              help={{
                title: 'فروش موفق دوره',
                description:
                  'مجموع ارزش فرصت‌هایی که تاریخ موفق‌شدن آن‌ها داخل بازه گزارش انتخاب‌شده قرار دارد.',
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                mb: 2,
                justifyContent: 'space-between',
                alignItems: { sm: 'center' },
              }}
            >
              <Box>
                <Typography variant="h6">روند ۱۲ ماهه فرصت‌ها</Typography>

                <Typography variant="body2" color="text.secondary">
                  فرصت‌های ایجادشده، موفق و از دست‌رفته
                </Typography>
              </Box>

              <ToggleButtonGroup
                exclusive
                size="small"
                value={trendMode}
                onChange={(_, next: TrendMode | null) => {
                  if (next) {
                    setTrendMode(next);
                  }
                }}
                aria-label="نوع نمایش روند فرصت‌ها"
              >
                <ToggleButton value="count">تعداد</ToggleButton>
                <ToggleButton value="value">ارزش</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <BarChart
              dataset={trendDataset}
              xAxis={[
                {
                  dataKey: 'month',
                  scaleType: 'band',
                  tickLabelStyle: { fontSize: 11 },
                },
              ]}
              yAxis={[
                {
                  label:
                    trendMode === 'count' ? 'تعداد فرصت' : 'میلیارد ریال',
                },
              ]}
              series={[
                {
                  dataKey: 'created',
                  label: 'ایجادشده',
                  valueFormatter: chartValueFormatter,
                },
                {
                  dataKey: 'won',
                  label: 'موفق',
                  valueFormatter: chartValueFormatter,
                },
                {
                  dataKey: 'lost',
                  label: 'از دست‌رفته',
                  valueFormatter: chartValueFormatter,
                },
              ]}
              height={340}
              margin={{
                left: 70,
                right: 20,
                top: 30,
                bottom: 50,
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6">ترکیب وضعیت فرصت‌ها</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              سهم فرصت‌های فعال، موفق و از دست‌رفته از کل فرصت‌ها
            </Typography>

            {totalStatusCount > 0 ? (
              <PieChart
                colors={[
                  theme.palette.primary.main,
                  theme.palette.success.main,
                  theme.palette.error.main,
                ]}
                series={[
                  {
                    data: statusData,
                    innerRadius: 62,
                    outerRadius: 105,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    arcLabelMinAngle: 22,
                    arcLabel: (item) =>
                      `${Math.round(
                        (item.value / totalStatusCount) * 100,
                      )}٪`,
                  },
                ]}
                height={300}
              />
            ) : (
              <Stack
                sx={{
                  height: 300,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  هنوز فرصتی ثبت نشده است.
                </Typography>
              </Stack>
            )}

            <Grid container spacing={1}>
              <Grid size={4}>
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography variant="h6">
                    {percentLabel(data.portfolio.active.percentage)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    فعال
                  </Typography>

                  <Typography variant="caption">
                    {formatCount(data.portfolio.active.count)}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={4}>
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography variant="h6">
                    {percentLabel(data.portfolio.won.percentage)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    موفق
                  </Typography>

                  <Typography variant="caption">
                    {formatCount(data.portfolio.won.count)}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={4}>
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography variant="h6">
                    {percentLabel(data.portfolio.lost.percentage)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    از دست‌رفته
                  </Typography>

                  <Typography variant="caption">
                    {formatCount(data.portfolio.lost.count)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
