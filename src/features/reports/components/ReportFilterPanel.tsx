import { Alert, Autocomplete, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { toEndOfDayIso } from '@/shared/utils/jalaliDate';
import type { ReportFilterOption, ReportFilterOptions, ReportFilters } from '../types/report.types';

interface Props {
  draft: ReportFilters;
  options?: ReportFilterOptions;
  isLoading: boolean;
  isError: boolean;
  isApplying: boolean;
  onChange: (filters: ReportFilters) => void;
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

export default function ReportFilterPanel({ draft, options, isLoading, isError, isApplying, onChange, onApply, onReset }: Props) {
  const selected = (key: keyof ReportFilters, available: ReportFilterOption[]) => {
    const values = draft[key];
    return available.filter((item) => Array.isArray(values) && values.includes(item.value));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">فیلترهای پیشرفته گزارش</Typography>
        {isError && <Alert severity="error">خطا در دریافت گزینه‌های فیلتر. دوباره تلاش کنید.</Alert>}
        <Typography variant="subtitle2">بازه تاریخ</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}><JalaliDateField fullWidth label="از تاریخ" value={draft.startDate ?? ''} onChange={(next) => onChange({ ...draft, startDate: next })} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><JalaliDateField fullWidth label="تا تاریخ" value={draft.endDate ?? ''} onChange={(next) => onChange({ ...draft, endDate: toEndOfDayIso(next) })} /></Grid>
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
