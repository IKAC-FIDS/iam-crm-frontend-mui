import { Alert, Autocomplete, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { JalaliDateRangePicker } from '@/shared/components/JalaliDateField';
import { CompanyMultiAutocomplete } from '@/components/companies/CompanyAutocomplete';
import type { CompanyOption } from '@/features/companies/types/company.types';
import type { ReportFilterOption, ReportFilterOptions, ReportFilters } from '../types/report.types';
import ReportProductMultiAutocomplete from './ReportProductMultiAutocomplete';
import { salesChannelLabel } from '@/features/opportunityLineItems/utils/salesChannel';

interface Props { draft: ReportFilters; selectedCompanies: CompanyOption[]; options?: ReportFilterOptions; isLoading: boolean; isError: boolean; isApplying: boolean; onChange: (filters: ReportFilters) => void; onCompaniesChange: (companies: CompanyOption[]) => void; onApply: () => void; onReset: () => void; }
const fields: Array<{ key: keyof ReportFilters; optionKey: keyof ReportFilterOptions; label: string }> = [
  { key: 'userIds', optionKey: 'users', label: 'کاربران' }, { key: 'teams', optionKey: 'teams', label: 'تیم‌ها' }, { key: 'ownerIds', optionKey: 'owners', label: 'مالکان' }, { key: 'stages', optionKey: 'pipelineStages', label: 'مراحل پایپ‌لاین' }, { key: 'priorities', optionKey: 'priorities', label: 'اولویت‌ها' }, { key: 'industries', optionKey: 'industries', label: 'صنایع' }, { key: 'leadSources', optionKey: 'leadSources', label: 'منابع جذب' }, { key: 'activityTypes', optionKey: 'activityTypes', label: 'نوع فعالیت' },
];
const meetingStatuses: ReportFilterOption[] = [{ value: 'SCHEDULED', label: 'برنامه‌ریزی‌شده' }, { value: 'COMPLETED', label: 'برگزارشده' }, { value: 'CANCELLED', label: 'لغوشده' }];
const meetingModes: ReportFilterOption[] = [{ value: 'IN_PERSON', label: 'حضوری' }, { value: 'ONLINE', label: 'آنلاین' }, { value: 'PHONE', label: 'تلفنی' }];
const taskStatuses: ReportFilterOption[] = [{ value: 'TODO', label: 'برای انجام' }, { value: 'IN_PROGRESS', label: 'در حال انجام' }, { value: 'DONE', label: 'انجام‌شده' }, { value: 'CANCELLED', label: 'لغوشده' }];
const salesChannels: ReportFilterOption[] = ['LEGACY_UNKNOWN', 'IN_PERSON', 'DIGIKALA', 'OTHER'].map((value) => ({ value, label: salesChannelLabel(value) }));

export default function ReportFilterPanel({ draft, selectedCompanies, options, isLoading, isError, isApplying, onChange, onCompaniesChange, onApply, onReset }: Props) {
  const chosen = (key: keyof ReportFilters, available: ReportFilterOption[]) => { const values = draft[key] as readonly string[] | undefined; return available.filter((item) => Array.isArray(values) && values.includes(item.value)); };
  const count = Object.entries(draft).filter(([key, value]) => key === 'ownershipScope' ? value && value !== 'all' : Array.isArray(value) ? value.length : value).length;
  const multi = (key: keyof ReportFilters, label: string, available: ReportFilterOption[], loading = false, disabled = false) => <Autocomplete multiple options={available} value={chosen(key, available)} loading={loading} disabled={disabled} disableCloseOnSelect getOptionLabel={(item) => item.team ? `${item.label} — ${item.team}` : item.label} isOptionEqualToValue={(a, b) => a.value === b.value} onChange={(_, value) => onChange({ ...draft, [key]: value.map((x) => x.value) })} renderInput={(params) => <TextField {...params} label={label} placeholder={available.length ? 'انتخاب کنید' : 'گزینه‌ای موجود نیست'} />} />;
  return <Paper sx={{ p: 2 }}><Stack spacing={2}><Typography variant="h6">فیلترهای پیشرفته گزارش ({count.toLocaleString('fa-IR')} فیلتر فعال)</Typography>
    {isError && <Alert severity="error">دریافت بخشی از گزینه‌های فیلتر انجام نشد؛ فیلترهای ثابت همچنان قابل استفاده‌اند.</Alert>}
    <Alert severity="info">مبنای تاریخ در هر گزارش متفاوت است و در ابتدای همان بخش توضیح داده می‌شود.</Alert>
    <Grid container spacing={2}><Grid size={{ xs: 12 }}><JalaliDateRangePicker fullWidth label="بازه تاریخ" startValue={draft.startDate} endValue={draft.endDate} onChange={(r) => onChange({ ...draft, startDate: r.start, endDate: r.end })} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField select fullWidth label="محدوده مالکیت" value={draft.ownershipScope ?? 'all'} onChange={(e) => onChange({ ...draft, ownershipScope: e.target.value as ReportFilters['ownershipScope'] })}><MenuItem value="all">همه</MenuItem><MenuItem value="mine">متعلق به من</MenuItem><MenuItem value="team">تیم من</MenuItem><MenuItem value="unassigned">بدون مالک</MenuItem></TextField></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 8 }}><CompanyMultiAutocomplete value={selectedCompanies} onChange={onCompaniesChange} label="شرکت‌ها" helperText="جست‌وجو و صفحه‌بندی گزینه‌ها در سرور انجام می‌شود." /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 8 }}><ReportProductMultiAutocomplete value={draft.productIds ?? []} onChange={(productIds) => onChange({ ...draft, productIds })} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth label="دسته‌های محصول (با ویرگول)" value={(draft.categories ?? []).join(',')} onChange={(e) => onChange({ ...draft, categories: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>{multi('salesChannels', 'کانال‌های فروش', salesChannels)}</Grid>
      {fields.map(({ key, optionKey, label }) => <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>{multi(key, label, options?.[optionKey] ?? [], isLoading, isError)}</Grid>)}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>{multi('meetingStatuses', 'وضعیت جلسه', meetingStatuses)}</Grid><Grid size={{ xs: 12, sm: 6, md: 4 }}>{multi('meetingModes', 'نحوه برگزاری جلسه', meetingModes)}</Grid><Grid size={{ xs: 12, sm: 6, md: 4 }}>{multi('taskStatuses', 'وضعیت کار', taskStatuses)}</Grid>
    </Grid><Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}><Button onClick={onReset} disabled={isApplying}>پاک‌کردن فیلترها</Button><Button variant="contained" onClick={onApply} disabled={isApplying || Boolean(draft.startDate && draft.endDate && draft.startDate > draft.endDate)}>اعمال فیلترها</Button></Stack>
    {draft.startDate && draft.endDate && draft.startDate > draft.endDate && <Alert severity="warning">تاریخ شروع نباید بعد از تاریخ پایان باشد.</Alert>}
  </Stack></Paper>;
}
