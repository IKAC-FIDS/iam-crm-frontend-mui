import { Alert, Button, Chip, Grid, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import type { QuotaSummaryMetric } from '@/api/generated/models';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useAuthStore } from '@/store/authStore';
import { useCurrentQuota } from '../hooks/useCurrentQuota';

const metricLabels: Record<string, string> = {
  ACTIVE_USERS: 'کاربران فعال',
  COMPANIES: 'شرکت‌ها',
  OPPORTUNITIES: 'فرصت‌ها',
  FILES: 'فایل‌ها',
  STORAGE_BYTES: 'فضای ذخیره‌سازی (بایت)',
  API_CALLS: 'فراخوانی‌های API',
  WORKFLOW_RUNS: 'اجرای گردش‌کار',
  WEBHOOK_DELIVERIES: 'ارسال Webhook',
  EMAIL_SENDS: 'ارسال ایمیل',
  AI_REQUESTS: 'درخواست‌های هوش مصنوعی',
};

const stateLabels: Record<string, string> = {
  ENFORCED: 'فعال',
  UNLIMITED: 'نامحدود',
  DISABLED: 'غیرفعال',
  UNCONFIGURED: 'تعریف‌نشده',
  LEGACY_COMPATIBILITY: 'سازگاری قدیمی',
  INACTIVE_ORGANIZATION: 'سازمان غیرفعال',
  INACTIVE_SUBSCRIPTION: 'اشتراک غیرفعال',
};

function formatInteger(value?: string | null): string {
  if (!value || !/^-?\d+$/.test(value)) return '—';
  try {
    return new Intl.NumberFormat('fa-IR').format(BigInt(value));
  } catch {
    return value;
  }
}

function progress(item: QuotaSummaryMetric): number | null {
  if (!item.current || !item.hardLimit || !/^\d+$/.test(item.current) || !/^\d+$/.test(item.hardLimit)) return null;
  const limit = BigInt(item.hardLimit);
  if (limit <= 0n) return null;
  const perThousand = (BigInt(item.current) * 1000n) / limit;
  return Math.min(100, Number(perThousand) / 10);
}

function QuotaCard({ item }: { item: QuotaSummaryMetric }) {
  const percentage = progress(item);
  const unlimited = item.state === 'UNLIMITED' || item.hardLimit == null;
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{metricLabels[item.metric ?? ''] ?? item.metric ?? 'سهمیه'}</Typography>
          <Chip size="small" label={stateLabels[item.state ?? ''] ?? item.state ?? 'نامشخص'} />
        </Stack>
        <Typography variant="h5" dir="ltr" sx={{ textAlign: 'right' }}>
          {formatInteger(item.current)} / {unlimited ? 'نامحدود' : formatInteger(item.hardLimit)}
        </Typography>
        {percentage !== null && <LinearProgress variant="determinate" value={percentage} aria-label={`درصد مصرف ${metricLabels[item.metric ?? ''] ?? item.metric}`} />}
        {item.softLimit && <Typography variant="body2" color="text.secondary">حد هشدار: {formatInteger(item.softLimit)}</Typography>}
      </Stack>
    </Paper>
  );
}

export default function CurrentQuotaPage() {
  const organizationId = useAuthStore((state) => state.user?.organizationId ?? null);
  const query = useCurrentQuota();
  if (!organizationId) return <Alert severity="info">برای مشاهده مصرف، ابتدا باید یک سازمان فعال انتخاب شده باشد.</Alert>;
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">مصرف و سهمیه</Typography>
        <Typography color="text.secondary">خلاصهٔ مصرف فعلی سازمان و محدودیت‌های مؤثر اعلام‌شده توسط سرور.</Typography>
      </div>
      {query.isLoading && <Grid container spacing={2}>{[0, 1, 2].map((item) => <Grid key={item} size={{ xs: 12, md: 4 }}><Skeleton variant="rounded" height={150} /></Grid>)}</Grid>}
      {query.isError && <Alert severity="error" action={<Button onClick={() => query.refetch()}>تلاش مجدد</Button>}>{getApiErrorMessage(query.error, 'دریافت اطلاعات مصرف و سهمیه انجام نشد.')}</Alert>}
      {query.data && !query.data.metrics.length && <Alert severity="info">برای این سازمان سهمیه‌ای گزارش نشده است.</Alert>}
      {query.data?.metrics.length ? <Grid container spacing={2}>{query.data.metrics.map((item) => <Grid key={item.metric} size={{ xs: 12, sm: 6, lg: 4 }}><QuotaCard item={item} /></Grid>)}</Grid> : null}
    </Stack>
  );
}
