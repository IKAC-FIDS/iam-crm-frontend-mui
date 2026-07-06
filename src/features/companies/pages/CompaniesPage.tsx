import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import Header from '@/components/dashboard/Header';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import CreateCompanyDialog from '../components/CreateCompanyDialog';
import ArchiveCompanyDialog from '../components/ArchiveCompanyDialog';
import RestoreCompanyDialog from '../components/RestoreCompanyDialog';
import { useCompanies } from '../hooks/useCompanies';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  COMPANY_PAGE_SIZES,
  COMPANY_PRIORITY_OPTIONS,
  COMPANY_STAGE_OPTIONS,
  isCompanyPriority,
  isCompanyStage,
  isCompanyArchived,
} from '../types/company.types';
import {
  formatDateTime,
  getPriorityLabel,
  getStageLabel,
} from '../utils/companyDisplay';
import type {
  GetCompaniesParams,
  CompanyListItem,
  CompanyPageSize,
  CompanyPriority,
  CompanyStage,
  CompanyArchiveStatus,
} from '../types/company.types';

type OwnerFilter = 'ALL' | 'WITHOUT_OWNER' | 'SPECIFIC_OWNER';

function displayValue(value?: string | null): string {
  return value?.trim() || '—';
}

export default function CompaniesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const canCreateCompany = can(user, 'company:create', ['ADMIN', 'MANAGER']);
  const canArchiveCompany = can(user, 'company:archive', ['ADMIN', 'MANAGER']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [stage, setStage] = useState<CompanyStage | ''>('');
  const [priority, setPriority] = useState<CompanyPriority | ''>('');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('ALL');
  const [ownerId] = useState('');
  const [search, setSearch] = useState('');
  const [archiveStatus, setArchiveStatus] = useState<CompanyArchiveStatus>('ACTIVE');
  const [archiving, setArchiving] = useState<CompanyListItem | null>(null);
  const [restoring, setRestoring] = useState<CompanyListItem | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const queryParams = useMemo<GetCompaniesParams>(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize as CompanyPageSize,
      ...(stage && { stage }),
      ...(priority && { priority }),
      ...(ownerFilter === 'WITHOUT_OWNER' && { withoutOwner: true }),
      ...(ownerFilter === 'SPECIFIC_OWNER' && ownerId && { ownerId }),
      ...(debouncedSearch && { search: debouncedSearch }),
      archiveStatus,
    }),
    [archiveStatus, debouncedSearch, ownerFilter, ownerId, paginationModel, priority, stage],
  );

  const { data, isError, isFetching } = useCompanies(queryParams);

  const resetToFirstPage = () => {
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const columns = useMemo<GridColDef<CompanyListItem>[]>(
    () => [
      { field: 'legalName', headerName: 'نام حقوقی', minWidth: 180, flex: 1 },
      { field: 'brandName', headerName: 'نام برند', minWidth: 140, flex: 0.8 },
      { field: 'industry', headerName: 'صنعت', minWidth: 130, flex: 0.7 },
      {
        field: 'stage',
        headerName: 'مرحله',
        minWidth: 170,
        flex: 0.9,
        renderCell: ({ value }: GridRenderCellParams<CompanyListItem, string | null>) => (
          <Chip size="small" label={getStageLabel(value)} variant="outlined" color="primary" />
        ),
      },
      {
        field: 'priority',
        headerName: 'اولویت',
        minWidth: 110,
        renderCell: ({ value }: GridRenderCellParams<CompanyListItem, string | null>) => (
          <Chip size="small" label={getPriorityLabel(value)} variant="outlined" color="secondary" />
        ),
      },
      {
        field: 'owner',
        headerName: 'مالک',
        minWidth: 150,
        flex: 0.7,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<CompanyListItem>) => displayValue(row.owner?.fullName),
      },
      { field: 'headOfficeCity', headerName: 'شهر دفتر مرکزی', minWidth: 150 },
      { field: 'archiveState', headerName: 'وضعیت', minWidth: 110, valueGetter: (_value, row) => isCompanyArchived(row) ? 'بایگانی‌شده' : 'فعال' },
      {
        field: 'updatedAt',
        headerName: 'آخرین بروزرسانی',
        minWidth: 180,
        renderCell: ({ value }: GridRenderCellParams<CompanyListItem, string | null>) => formatDateTime(value),
      },
      {
        field: 'actions',
        headerName: 'عملیات',
        minWidth: 250,
        sortable: false,
        filterable: false,
        renderCell: ({ row }: GridRenderCellParams<CompanyListItem>) => (
          <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
            <Button size="small" onClick={() => navigate(`/companies/${row.id}`)}>
              مشاهده جزئیات
            </Button>
            {canArchiveCompany && (isCompanyArchived(row)
              ? <Button size="small" color="success" onClick={() => setRestoring(row)}>بازیابی</Button>
              : <Button size="small" color="warning" onClick={() => setArchiving(row)}>بایگانی</Button>)}
          </Stack>
        ),
      },
    ],
    [canArchiveCompany, navigate],
  );

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Header />

      {canCreateCompany && (
        <Stack direction="row" sx={{ mb: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
            افزودن شرکت
          </Button>
        </Stack>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          فیلتر شرکت‌ها
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="جستجو"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetToFirstPage();
            }}
            placeholder="نام حقوقی، برند یا صنعت"
          />

          <FormControl fullWidth>
            <InputLabel id="company-stage-label">مرحله</InputLabel>
            <Select
              labelId="company-stage-label"
              label="مرحله"
              value={stage}
              onChange={(event) => {
                const value = event.target.value;
                setStage(value && isCompanyStage(value) ? value : '');
                resetToFirstPage();
              }}
            >
              <MenuItem value="">همه مراحل</MenuItem>
              {COMPANY_STAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="company-archive-filter-label">وضعیت بایگانی</InputLabel>
            <Select labelId="company-archive-filter-label" label="وضعیت بایگانی" value={archiveStatus} onChange={(event) => { setArchiveStatus(event.target.value as CompanyArchiveStatus); resetToFirstPage(); }}>
              <MenuItem value="ACTIVE">فعال</MenuItem><MenuItem value="ARCHIVED">بایگانی‌شده</MenuItem><MenuItem value="ALL">همه</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="company-priority-label">اولویت</InputLabel>
            <Select
              labelId="company-priority-label"
              label="اولویت"
              value={priority}
              onChange={(event) => {
                const value = event.target.value;
                setPriority(value && isCompanyPriority(value) ? value : '');
                resetToFirstPage();
              }}
            >
              <MenuItem value="">همه اولویت‌ها</MenuItem>
              {COMPANY_PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="company-owner-label">مالک</InputLabel>
            <Select
              labelId="company-owner-label"
              label="مالک"
              value={ownerFilter}
              onChange={(event) => {
                setOwnerFilter(event.target.value as OwnerFilter);
                resetToFirstPage();
              }}
            >
              <MenuItem value="ALL">همه مالکان</MenuItem>
              <MenuItem value="WITHOUT_OWNER">بدون مالک</MenuItem>
              <MenuItem value="SPECIFIC_OWNER" disabled>
                مالک مشخص (به‌زودی)
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت اطلاعات شرکت‌ها.
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          autoHeight
          rows={data?.data ?? []}
          columns={columns}
          loading={isFetching}
          rowCount={data?.meta.total ?? 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[...COMPANY_PAGE_SIZES]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز شرکتی ثبت نشده است.' }}
          sx={{
            border: 0,
            minHeight: 420,
            '& .MuiDataGrid-cell': { alignItems: 'center' },
          }}
        />
      </Paper>

      {canCreateCompany && (
        <CreateCompanyDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}
      {archiving && <ArchiveCompanyDialog key={archiving.id} companyId={archiving.id} companyName={archiving.legalName} open onClose={() => setArchiving(null)} />}
      {restoring && <RestoreCompanyDialog key={restoring.id} companyId={restoring.id} companyName={restoring.legalName} open onClose={() => setRestoring(null)} />}
    </Box>
  );
}
