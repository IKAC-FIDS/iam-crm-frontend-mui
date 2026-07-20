import { Alert, Autocomplete, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { JalaliDateRangePicker } from '@/shared/components/JalaliDateField';
import { CompanyMultiAutocomplete } from '@/components/companies/CompanyAutocomplete';
import type { CompanyOption } from '@/features/companies/types/company.types';
import type { ReportFilterOption, ReportFilterOptions, ReportFilters } from '../types/report.types';

interface Props {
  draft: ReportFilters;
  selectedCompanies: CompanyOption[];
  options?: ReportFilterOptions;
  isLoading: boolean;
  isError: boolean;
  isApplying: boolean;
  onChange: (filters: ReportFilters) => void;
  onCompaniesChange: (companies: CompanyOption[]) => void;
  onApply: () => void;
  onReset: () => void;
}

const fields: Array<{ key: keyof ReportFilters; optionKey: keyof ReportFilterOptions; label: string }> = [
  { key: 'userIds', optionKey: 'users', label: 'کاربران' },
  { key: 'teams', optionKey: 'teams', label: 'تیم‌ها' },
  { key: 'ownerIds', optionKey: 'owners', label: 'مالکان' },
  { key: 'stages', optionKey: 'pipelineStages', label: 'مراحل پایپ‌لاین' },
  { key: 'priorities', optionKey: 'priorities', label: 'اولویت‌ها' },
  { key: 'industries', optionKey: 'industries', label: 'صنایع' },
  { key: 'leadSources', optionKey: 'leadSources', label: 'منابع جذب' },
  { key: 'activityTypes', optionKey: 'activityTypes', label: 'نوع فعالیت' },
];

export default function ReportFilterPanel({ draft, selectedCompanies, options, isLoading, isError, isApplying, onChange, onCompaniesChange, onApply, onReset }: Props) {
  const selected = (key: keyof ReportFilters, available: ReportFilterOption[]) => {
    const values = draft[key];
    return available.filter((item) => Array.isArray(values) && values.includes(item.value));
  };
  const appliedCount = Object.entries(draft).filter(([key, value]) => key !== 'ownershipScope' ? Boolean(Array.isArray(value) ? value.length : value) : value && value !== 'all').length;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">فیلترهای پیشرفته گزارش ({appliedCount.toLocaleString('fa-IR')} فیلتر فعال)</Typography>
        {isError && <Alert severity="error">خطا در دریافت گزینه‌های فیلتر. دوباره تلاش کنید.</Alert>}
        <Typography variant="subtitle2">بازه تاریخ</Typography>
        <Alert severity="info">خلاصه پایپ‌لاین و عملکرد مالکان بر اساس تاریخ ایجاد فرصت؛ نرخ تبدیل بر اساس تاریخ تغییر مرحله؛ مدت حضور بر اساس تاریخ خروج از مرحله؛ فعالیت‌ها بر اساس تاریخ انجام فعالیت محاسبه می‌شوند.</Alert>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}><JalaliDateRangePicker fullWidth label="بازه تاریخ" startValue={draft.startDate} endValue={draft.endDate} onChange={(range) => onChange({ ...draft, startDate: range.start, endDate: range.end })} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField select fullWidth label="محدوده مالکیت" value={draft.ownershipScope ?? 'all'} onChange={(event) => onChange({ ...draft, ownershipScope: event.target.value as ReportFilters['ownershipScope'] })}><MenuItem value="all">همه</MenuItem><MenuItem value="mine">متعلق به من</MenuItem><MenuItem value="team">تیم من</MenuItem><MenuItem value="unassigned">بدون مالک</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 8 }}><CompanyMultiAutocomplete value={selectedCompanies} onChange={onCompaniesChange} label="شرکت‌ها" helperText="جستجو و بارگذاری شرکت‌ها از سرور انجام می‌شود." /></Grid>
          {fields.map(({ key, optionKey, label }) => {
            const available = options?.[optionKey] ?? [];
            return <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}><Autocomplete multiple options={available} value={selected(key, available)} loading={isLoading} disabled={isError} disableCloseOnSelect getOptionLabel={(item) => item.team ? `${item.label} — ${item.team}` : item.label} isOptionEqualToValue={(item, value) => item.value === value.value} onChange={(_, value) => onChange({ ...draft, [key]: value.map((item) => item.value) })} renderInput={(params) => <TextField {...params} label={label} placeholder={available.length ? 'انتخاب کنید' : 'گزینه‌ای موجود نیست'} />} /></Grid>;
          })}
        </Grid>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onReset} disabled={isApplying}>پاک‌کردن فیلترها</Button>
          <Button variant="contained" onClick={onApply} disabled={isLoading || isError || isApplying || Boolean(draft.startDate && draft.endDate && draft.startDate > draft.endDate)}>اعمال فیلترها</Button>
        </Stack>
        {draft.startDate && draft.endDate && draft.startDate > draft.endDate && <Alert severity="warning">تاریخ شروع نباید بعد از تاریخ پایان باشد.</Alert>}
      </Stack>
    </Paper>
  );
}
