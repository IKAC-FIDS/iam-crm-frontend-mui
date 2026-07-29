import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Autocomplete, Button, Checkbox, Chip, FormControlLabel, Grid, MenuItem,
  Paper, Skeleton, Stack, TextField, Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Header from '@/components/dashboard/Header';
import { CompanyAutocomplete } from '@/components/companies/CompanyAutocomplete';
import { useAuthStore } from '@/store/authStore';
import { can } from '@/features/auth/utils/permissions';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { formatJalaliDateTime, parseJalaliInputToIso, toEndOfDayIso } from '@/shared/utils/jalaliDate';
import { RowActions } from '@/shared/components/RowActions';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { isUserActive } from '@/features/admin/users/types/adminUser.types';
import { usePeopleDirectory } from '@/features/people/hooks/usePeople';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import type { CompanyOption } from '@/features/companies/types/company.types';
import type { DirectoryPerson } from '@/features/people/types/person.types';
import { useActivities } from '../hooks/useActivities';
import { ACTIVITY_TYPE_OPTIONS, getActivityTypeLabel, type Activity, type ActivityStatus, type ActivityType } from '../types/activity.types';

const statusLabels: Record<ActivityStatus, string> = { RECORDED: 'ثبت‌شده', COMPLETED: 'تکمیل‌شده' };
const display = (value?: string | null) => value?.trim() || '—';

export default function ActivitiesPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'activity:view', ['ADMIN', 'MANAGER', 'REP']);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState<ActivityType | ''>('');
  const [status, setStatus] = useState<ActivityStatus | ''>('');
  const [ownerId, setOwnerId] = useState('');
  const [team, setTeam] = useState('');
  const [company, setCompany] = useState<CompanyOption | null>(null);
  const [person, setPerson] = useState<DirectoryPerson | null>(null);
  const [personSearch, setPersonSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [mine, setMine] = useState(false);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const debouncedPersonSearch = useDebouncedValue(personSearch.trim(), 400);
  const owners = useOwnerOptions(allowed);
  const ownerOptions = (owners.data ?? []).filter(isUserActive);
  const teams = Array.from(new Set(ownerOptions.map((item) => item.teamName ?? item.team).filter((item): item is string => Boolean(item))));
  const people = usePeopleDirectory({ page: 1, limit: 20, ...(debouncedPersonSearch && { search: debouncedPersonSearch }) }, allowed);
  const parsedFrom = parseJalaliInputToIso(dateFrom);
  const parsedTo = parseJalaliInputToIso(dateTo);
  const invalidDates = Boolean((dateFrom && !parsedFrom) || (dateTo && !parsedTo) || (parsedFrom && parsedTo && parsedFrom > parsedTo));
  const query = useActivities({
    page: pagination.page + 1, limit: pagination.pageSize as 10 | 20 | 50 | 100,
    ...(debouncedSearch && { search: debouncedSearch }), ...(activityType && { activityType }),
    ...(status && { status }), ...(!mine && ownerId && { ownerId }), ...(team && { team }),
    ...(company && { companyId: company.id }), ...(person && { personId: person.id }),
    ...(parsedFrom && { dateFrom: parsedFrom }), ...(parsedTo && { dateTo: toEndOfDayIso(parsedTo) }),
    ...(mine && { mine: true }), sortBy: 'activityDate', sortOrder: 'desc',
  }, allowed && !invalidDates);
  const resetPage = () => setPagination((value) => ({ ...value, page: 0 }));
  const columns = useMemo<GridColDef<Activity>[]>(() => [
    { field: 'type', headerName: 'نوع', minWidth: 130, renderCell: ({ value }) => <Chip size="small" variant="outlined" label={getActivityTypeLabel(value as ActivityType)} /> },
    { field: 'title', headerName: 'عنوان', minWidth: 190, flex: 1, valueGetter: (_value, row) => row.title || row.outcome || getActivityTypeLabel(row.type) },
    { field: 'person', headerName: 'شخص', minWidth: 150, valueGetter: (_value, row) => display(row.person?.fullName) },
    { field: 'company', headerName: 'شرکت', minWidth: 170, valueGetter: (_value, row) => display(row.company?.brandName || row.company?.legalName) },
    { field: 'createdBy', headerName: 'ایجادکننده', minWidth: 150, valueGetter: (_value, row) => display(row.createdBy?.fullName || row.user?.fullName) },
    { field: 'status', headerName: 'وضعیت', minWidth: 120, renderCell: ({ value }) => <Chip size="small" color={value === 'COMPLETED' ? 'success' : 'default'} label={statusLabels[value as ActivityStatus] ?? display(value)} /> },
    { field: 'activityDate', headerName: 'تاریخ فعالیت', minWidth: 170, valueGetter: (_value, row) => formatJalaliDateTime(row.activityDate ?? row.occurredAt) },
    { field: 'createdAt', headerName: 'تاریخ ایجاد', minWidth: 170, valueGetter: (_value, row) => formatJalaliDateTime(row.createdAt) },
    { field: 'actions', headerName: 'عملیات', width: 90, sortable: false, filterable: false, renderCell: ({ row }) => <RowActions actions={[{ key: 'company', label: 'مشاهده شرکت', icon: <VisibilityOutlinedIcon />, visible: Boolean(row.companyId || row.company?.id), onClick: () => navigate(`/companies/${row.companyId || row.company?.id}`) }]} /> },
  ], [navigate]);

  if (!allowed) return <><Header /><Alert severity="warning" sx={{ m: 3 }}>شما مجوز مشاهده فعالیت‌ها را ندارید.</Alert></>;
  return <><Header /><Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
    <Typography variant="h4">فعالیت‌ها</Typography>
    <Paper sx={{ p: 2 }}><Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="جستجو" placeholder="عنوان، شخص، شرکت یا توضیحات" value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField select fullWidth label="نوع فعالیت" value={activityType} onChange={(e) => { setActivityType(e.target.value as ActivityType | ''); resetPage(); }}><MenuItem value="">همه</MenuItem>{ACTIVITY_TYPE_OPTIONS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField select fullWidth label="وضعیت" value={status} onChange={(e) => { setStatus(e.target.value as ActivityStatus | ''); resetPage(); }}><MenuItem value="">همه</MenuItem>{Object.entries(statusLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField select fullWidth label="مالک" value={ownerId} disabled={mine || owners.isError} onChange={(e) => { setOwnerId(e.target.value); resetPage(); }}><MenuItem value="">همه مالکان</MenuItem>{ownerOptions.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField select fullWidth label="تیم" value={team} onChange={(e) => { setTeam(e.target.value); resetPage(); }}><MenuItem value="">همه تیم‌ها</MenuItem>{teams.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField></Grid>
      <Grid size={{ xs: 12, md: 4 }}><CompanyAutocomplete label="شرکت" value={company} onChange={(value) => { setCompany(value); resetPage(); }} /></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Autocomplete options={people.data?.data ?? []} value={person} loading={people.isLoading} filterOptions={(items) => items} getOptionLabel={(item) => item.fullName} isOptionEqualToValue={(a, b) => a.id === b.id} onInputChange={(_, value, reason) => reason === 'input' && setPersonSearch(value)} onChange={(_, value) => { setPerson(value); resetPage(); }} renderInput={(params) => <TextField {...params} label="شخص" error={people.isError} helperText={people.isError ? 'دریافت فهرست افراد ناموفق بود.' : undefined} />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth label="از تاریخ" placeholder="۱۴۰۵/۰۱/۰۱" value={dateFrom} error={Boolean(dateFrom && !parsedFrom)} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} /></Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth label="تا تاریخ" placeholder="۱۴۰۵/۱۲/۲۹" value={dateTo} error={Boolean(dateTo && !parsedTo)} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} /></Grid>
      <Grid size={{ xs: 12 }}><Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}><FormControlLabel control={<Checkbox checked={mine} onChange={(e) => { setMine(e.target.checked); resetPage(); }} />} label="فعالیت‌های من" /><Button onClick={() => { setSearch(''); setActivityType(''); setStatus(''); setOwnerId(''); setTeam(''); setCompany(null); setPerson(null); setDateFrom(''); setDateTo(''); setMine(false); resetPage(); }}>پاک کردن فیلترها</Button></Stack></Grid>
    </Grid></Paper>
    {invalidDates && <Alert severity="warning">بازه تاریخ معتبر نیست.</Alert>}
    {query.isError && <Alert severity="error" action={<Button onClick={() => query.refetch()}>تلاش مجدد</Button>}>{getApiErrorMessage(query.error, 'خطا در دریافت فعالیت‌ها')}</Alert>}
    {query.isLoading ? <Paper sx={{ p: 2 }}><Skeleton height={52} /><Skeleton height={320} /></Paper> : <Paper sx={{ height: 620 }}><DataGrid rows={query.data?.data ?? []} columns={columns} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[10, 20, 50, 100]} loading={query.isFetching} disableRowSelectionOnClick localeText={{ noRowsLabel: 'هیچ فعالیتی ثبت نشده است.' }} /></Paper>}
  </Stack></>;
}
