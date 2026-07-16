import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import { can } from '@/features/auth/utils/permissions';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { useCompanies } from '@/features/companies/hooks/useCompanies';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import type { CompanyListItem } from '@/features/companies/types/company.types';
import { useReportFilterOptions } from '@/features/reports/hooks/useReports';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import { getCatalogItemLabel, getLookupLabel, isCatalogItemActive } from '@/features/catalogs/types/catalog.types';
import PersonDetailDrawer from '../components/PersonDetailDrawer';
import { usePeopleDirectory } from '../hooks/usePeople';
import {
  getContactTypeLabel,
  type DirectoryPerson,
  type PeopleDirectoryParams,
} from '../types/person.types';

type BooleanFilter = '' | 'true' | 'false';
const booleanValue = (value: BooleanFilter): boolean | undefined => value === '' ? undefined : value === 'true';

function primaryContactSummary(person: DirectoryPerson): string {
  const contacts = person.contacts ?? [];

  const primary = contacts.find((item) => item.isPrimary && item.value?.trim());

  if (primary) {
    return `${getContactTypeLabel(primary.type)}: ${primary.value}`;
  }

  const fallback = contacts.find((item) => item.value?.trim());

  if (fallback) {
    return `${getContactTypeLabel(fallback.type)}: ${fallback.value}`;
  }

  const legacyValue =
    person.phoneSummary?.trim() ||
    person.emailSummary?.trim();

  return legacyValue || '—';
}

export default function PeopleDirectoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'people:directory:view');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState(''); const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const [companySearch, setCompanySearch] = useState(''); const debouncedCompanySearch = useDebouncedValue(companySearch.trim(), 400);
  const [company, setCompany] = useState<CompanyListItem | null>(null);
  const [ownerId, setOwnerId] = useState(''); const [team, setTeam] = useState(''); const [department, setDepartment] = useState(''); const [jobTitle, setJobTitle] = useState(''); const [personaRole, setPersonaRole] = useState(''); const [seniorityLevel, setSeniorityLevel] = useState('');
  const [primary, setPrimary] = useState<BooleanFilter>(''); const [hasEmail, setHasEmail] = useState<BooleanFilter>(''); const [hasPhone, setHasPhone] = useState<BooleanFilter>('');
  const [openPersonId, setOpenPersonId] = useState('');
  const companyOptions = useCompanies({ page: 1, limit: 20, search: debouncedCompanySearch || undefined });
  const reportOptions = useReportFilterOptions(allowed);
  const departmentsQuery = useCatalog('lookupOptions', allowed, { group: 'departments' });
  const jobTitlesQuery = useCatalog('lookupOptions', allowed, { group: 'job-titles' });
  const personaRolesQuery = useCatalog('lookupOptions', allowed, { group: 'persona-roles' });
  const seniorityLevelsQuery = useCatalog('lookupOptions', allowed, { group: 'seniority-levels' });
  const resetPage = () => setPagination((current) => ({ ...current, page: 0 }));
  const params = useMemo<PeopleDirectoryParams>(() => ({
    page: pagination.page + 1, limit: pagination.pageSize as PeopleDirectoryParams['limit'],
    search: debouncedSearch || undefined, companyId: company?.id, ownerId: ownerId || undefined, team: team || undefined,
    department: department || undefined, jobTitle: jobTitle || undefined, personaRole: personaRole || undefined, seniorityLevel: seniorityLevel || undefined,
    isPrimaryContact: booleanValue(primary), hasEmail: booleanValue(hasEmail), hasPhone: booleanValue(hasPhone),
  }), [company?.id, debouncedSearch, department, hasEmail, hasPhone, jobTitle, ownerId, pagination, personaRole, primary, seniorityLevel, team]);
  const query = usePeopleDirectory(params, allowed);
  const departments = (departmentsQuery.data ?? []).filter(isCatalogItemActive);
  const jobTitles = (jobTitlesQuery.data ?? []).filter(isCatalogItemActive);
  const personaRoles = (personaRolesQuery.data ?? []).filter(isCatalogItemActive);
  const seniorityLevels = (seniorityLevelsQuery.data ?? []).filter(isCatalogItemActive);

  const columns = useMemo<GridColDef<DirectoryPerson>[]>(() => [
    { field: 'fullName', headerName: 'نام', minWidth: 170, flex: 1 },
    { field: 'jobTitle', headerName: 'سمت سازمانی', minWidth: 150, valueGetter: (_value, row) => getLookupLabel(jobTitles, row.jobTitle ?? row.title) },
    { field: 'department', headerName: 'دپارتمان', minWidth: 130, valueGetter: (_value, row) => getLookupLabel(departments, row.department) },
    { field: 'personaRole', headerName: 'نقش پرسونا', minWidth: 170, valueGetter: (_value, row) => getLookupLabel(personaRoles, row.personaRole ?? row.personaTag) },
    { field: 'seniorityLevel', headerName: 'سطح ارشدیت', minWidth: 130, valueGetter: (_value, row) => getLookupLabel(seniorityLevels, row.seniorityLevel) },
    { field: 'isPrimaryContact', headerName: 'مخاطب اصلی', minWidth: 110, renderCell: ({ value }) => <Chip size="small" color={value ? 'success' : 'default'} label={value ? 'بله' : 'خیر'} /> },
    { field: 'company', headerName: 'شرکت', minWidth: 180, flex: 1, valueGetter: (_value, row) => row.company?.legalName ?? '—' },
    { field: 'owner', headerName: 'مالک', minWidth: 150, valueGetter: (_value, row) => row.owner?.fullName ?? row.company?.owner?.fullName ?? '—' },
    {
      field: 'primaryContactSummary',
      headerName: 'راه تماس اصلی',
      minWidth: 240,
      flex: 1,
      valueGetter: (_value, row) => primaryContactSummary(row),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 112,
      width: 112,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<DirectoryPerson>) => (
        <RowActions
          actions={[
            {
              key: 'company',
              label: 'مشاهده شرکت',
              icon: <BusinessOutlinedIcon fontSize="small" />,
              disabled: !row.companyId,
              onClick: () => navigate(`/companies/${row.companyId}`),
            },
            {
              key: 'person',
              label: 'بازکردن شخص',
              icon: <PersonSearchOutlinedIcon fontSize="small" />,
              onClick: () => setOpenPersonId(row.id),
            },
          ]}
        />
      ),
    },
  ], [departments, jobTitles, navigate, personaRoles, seniorityLevels]);

  if (!allowed) return <Alert severity="warning">شما دسترسی مشاهده افراد را ندارید.</Alert>;
  const boolSelect = (id: string, label: string, value: BooleanFilter, onChange: (value: BooleanFilter) => void) => <FormControl fullWidth><InputLabel id={id}>{label}</InputLabel><Select labelId={id} label={label} value={value} onChange={(event) => { onChange(event.target.value as BooleanFilter); resetPage(); }}><MenuItem value="">همه</MenuItem><MenuItem value="true">بله</MenuItem><MenuItem value="false">خیر</MenuItem></Select></FormControl>;

  return <Box sx={{ minWidth: 0 }}><Typography variant="h4" sx={{ mb: 0.5 }}>افراد</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>فهرست یکپارچه افراد شرکت‌ها بر اساس سطح دسترسی شما.</Typography>
    <Paper sx={{ p: 2, mb: 2 }}><Typography variant="h6" sx={{ mb: 2 }}>فیلتر افراد</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
      <TextField label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} placeholder="نام، سمت، ایمیل یا تلفن" />
      <Autocomplete options={company ? [company, ...(companyOptions.data?.data ?? []).filter((item) => item.id !== company.id)] : companyOptions.data?.data ?? []} value={company} loading={companyOptions.isFetching} inputValue={companySearch} onInputChange={(_, value) => setCompanySearch(value)} onChange={(_, value) => { setCompany(value); resetPage(); }} getOptionLabel={(item) => item.legalName} isOptionEqualToValue={(item, value) => item.id === value.id} renderInput={(input) => <TextField {...input} label="شرکت" />} />
      <FormControl fullWidth disabled={reportOptions.isError}><InputLabel id="people-owner">مالک</InputLabel><Select labelId="people-owner" label="مالک" value={ownerId} onChange={(event) => { setOwnerId(event.target.value); resetPage(); }}><MenuItem value="">همه مالکان</MenuItem>{(reportOptions.data?.owners ?? []).map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select></FormControl>
      <FormControl fullWidth disabled={reportOptions.isError}><InputLabel id="people-team">تیم</InputLabel><Select labelId="people-team" label="تیم" value={team} onChange={(event) => { setTeam(event.target.value); resetPage(); }}><MenuItem value="">همه تیم‌ها</MenuItem>{(reportOptions.data?.teams ?? []).map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select></FormControl>
      <FormControl fullWidth disabled={departmentsQuery.isError}><InputLabel id="people-department">دپارتمان</InputLabel><Select labelId="people-department" label="دپارتمان" value={department} onChange={(event) => { setDepartment(event.target.value); resetPage(); }}><MenuItem value="">همه دپارتمان‌ها</MenuItem>{departments.map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}</Select></FormControl>
      <FormControl fullWidth disabled={jobTitlesQuery.isError}><InputLabel id="people-job-title">سمت سازمانی</InputLabel><Select labelId="people-job-title" label="سمت سازمانی" value={jobTitle} onChange={(event) => { setJobTitle(event.target.value); resetPage(); }}><MenuItem value="">همه سمت‌ها</MenuItem>{jobTitles.map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}</Select></FormControl>
      <FormControl fullWidth disabled={personaRolesQuery.isError}><InputLabel id="people-persona-role">نقش پرسونا</InputLabel><Select labelId="people-persona-role" label="نقش پرسونا" value={personaRole} onChange={(event) => { setPersonaRole(event.target.value); resetPage(); }}><MenuItem value="">همه نقش‌های پرسونا</MenuItem>{personaRoles.map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}</Select></FormControl>
      <FormControl fullWidth disabled={seniorityLevelsQuery.isError}><InputLabel id="people-seniority">سطح ارشدیت</InputLabel><Select labelId="people-seniority" label="سطح ارشدیت" value={seniorityLevel} onChange={(event) => { setSeniorityLevel(event.target.value); resetPage(); }}><MenuItem value="">همه سطوح ارشدیت</MenuItem>{seniorityLevels.map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}</Select></FormControl>
      {boolSelect('people-primary', 'مخاطب اصلی', primary, setPrimary)}{boolSelect('people-email', 'دارای ایمیل', hasEmail, setHasEmail)}{boolSelect('people-phone', 'دارای تلفن', hasPhone, setHasPhone)}
    </Box>{(reportOptions.isError || departmentsQuery.isError || jobTitlesQuery.isError || personaRolesQuery.isError || seniorityLevelsQuery.isError || companyOptions.isError) && <Alert severity="warning" sx={{ mt: 2 }}>دریافت بخشی از گزینه‌های فیلتر با خطا مواجه شد.</Alert>}</Paper>
    {query.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت فهرست افراد.</Alert>}
    <Paper sx={{ overflow: 'hidden' }}><DataGrid autoHeight rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[5, 10, 20, 50]} disableRowSelectionOnClick localeText={{ noRowsLabel: 'فردی مطابق فیلترها یافت نشد.' }} sx={{ border: 0, minHeight: 440 }} /></Paper>
    <PersonDetailDrawer personId={openPersonId} open={Boolean(openPersonId)} onClose={() => setOpenPersonId('')} canManageContacts={can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP'])} canManageSocials={can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP'])} canManageHistories={can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP'])} />
  </Box>;
}
