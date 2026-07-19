import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
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
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Header from '@/components/dashboard/Header';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { RowActions } from '@/shared/components/RowActions';
import { getApiErrorMessage } from '@/lib/apiResponse';
import type { OwnershipScope } from '@/shared/types/ownership';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { isUserActive } from '@/features/admin/users/types/adminUser.types';
import CreateCompanyDialog from '../components/CreateCompanyDialog';
import ArchiveCompanyDialog from '../components/ArchiveCompanyDialog';
import RestoreCompanyDialog from '../components/RestoreCompanyDialog';
import { useCompanies } from '../hooks/useCompanies';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  COMPANY_PAGE_SIZES,
  COMPANY_PRIORITY_OPTIONS,
  isCompanyPriority,
  isCompanyArchived,
} from '../types/company.types';
import {
  formatDateTime,
  getPriorityLabel,
} from '../utils/companyDisplay';
import type {
  GetCompaniesParams,
  CompanyListItem,
  CompanyPageSize,
  CompanyPriority,
  CompanyArchiveStatus,
} from '../types/company.types';

function displayValue(value?: string | null): string {
  return value?.trim() || '—';
}

const COMPANY_PAGE_SIZE_STORAGE_KEY = 'companies-page-size';

function validPageSize(value: string | null): CompanyPageSize | undefined {
  const parsed = Number(value);
  return COMPANY_PAGE_SIZES.find((size) => size === parsed);
}

function validPage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed - 1 : 0;
}

export default function CompaniesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const canCreateCompany = can(user, 'company:create', ['ADMIN', 'MANAGER']);
  const canArchiveCompany = can(user, 'company:archive', ['ADMIN', 'MANAGER']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(() => ({
    page: validPage(searchParams.get('page')),
    pageSize: validPageSize(searchParams.get('limit')) ?? validPageSize(localStorage.getItem(COMPANY_PAGE_SIZE_STORAGE_KEY)) ?? 10,
  }));
  const [priority, setPriority] = useState<CompanyPriority | ''>('');
  const [ownershipScope, setOwnershipScope] = useState<OwnershipScope>('all');
  const [ownerId, setOwnerId] = useState('');
  const [search, setSearch] = useState('');
  const [archiveStatus, setArchiveStatus] = useState<CompanyArchiveStatus>('ACTIVE');
  const [archiving, setArchiving] = useState<CompanyListItem | null>(null);
  const [restoring, setRestoring] = useState<CompanyListItem | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const ownersQuery = useOwnerOptions(true);
  const ownerOptions = (ownersQuery.data ?? []).filter(isUserActive);

  const updatePagination = (model: GridPaginationModel) => {
    const next = {
      page: model.pageSize !== paginationModel.pageSize ? 0 : model.page,
      pageSize: model.pageSize,
    };
    setPaginationModel(next);
    localStorage.setItem(COMPANY_PAGE_SIZE_STORAGE_KEY, String(next.pageSize));
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      params.set('page', String(next.page + 1));
      params.set('limit', String(next.pageSize));
      return params;
    }, { replace: true });
  };

  useEffect(() => {
    localStorage.setItem(COMPANY_PAGE_SIZE_STORAGE_KEY, String(paginationModel.pageSize));
    setSearchParams((current) => {
      if (current.get('page') === String(paginationModel.page + 1) && current.get('limit') === String(paginationModel.pageSize)) return current;
      const params = new URLSearchParams(current);
      params.set('page', String(paginationModel.page + 1));
      params.set('limit', String(paginationModel.pageSize));
      return params;
    }, { replace: true });
  }, [paginationModel.page, paginationModel.pageSize, setSearchParams]);

  const queryParams = useMemo<GetCompaniesParams>(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize as CompanyPageSize,
      ...(priority && { priority }),
      ownershipScope,
      ...(ownerId && ownershipScope === 'all' && { ownerId }),
      ...(debouncedSearch && { search: debouncedSearch }),
      archiveStatus,
    }),
    [archiveStatus, debouncedSearch, ownerId, ownershipScope, paginationModel, priority],
  );

  const { data, error, isError, isFetching } = useCompanies(queryParams);

  const resetToFirstPage = () => {
    updatePagination({ ...paginationModel, page: 0 });
  };

  const columns = useMemo<GridColDef<CompanyListItem>[]>(
    () => [
      { field: 'legalName', headerName: 'نام حقوقی', minWidth: 180, flex: 1 },
      { field: 'brandName', headerName: 'نام برند', minWidth: 140, flex: 0.8 },
      { field: 'industry', headerName: 'صنعت', minWidth: 130, flex: 0.7 },
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
        minWidth: 112,
        width: 112,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }: GridRenderCellParams<CompanyListItem>) => (
          <RowActions
            actions={[
              {
                key: 'view',
                label: 'مشاهده جزئیات',
                icon: <VisibilityOutlinedIcon fontSize="small" />,
                onClick: () => navigate(`/companies/${row.id}`, { state: { backTo: `/companies${location.search}`, backLabel: 'بازگشت به شرکت‌ها' } }),
              },
              {
                key: 'archive-toggle',
                label: isCompanyArchived(row) ? 'بازیابی' : 'بایگانی',
                icon: isCompanyArchived(row) ? <RestoreOutlinedIcon fontSize="small" /> : <ArchiveOutlinedIcon fontSize="small" />,
                color: isCompanyArchived(row) ? 'success' : 'warning',
                visible: canArchiveCompany,
                onClick: () => (isCompanyArchived(row) ? setRestoring(row) : setArchiving(row)),
              },
            ]}
          />
        ),
      },
    ],
    [canArchiveCompany, location.search, navigate],
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
            <InputLabel id="company-ownership-scope-label">نمایش</InputLabel>
            <Select
              labelId="company-ownership-scope-label"
              label="نمایش"
              value={ownershipScope}
              onChange={(event) => {
                const nextScope = event.target.value as OwnershipScope;
                setOwnershipScope(nextScope);
                if (nextScope !== 'all') setOwnerId('');
                resetToFirstPage();
              }}
            >
              <MenuItem value="all">همه شرکت‌ها</MenuItem>
              <MenuItem value="mine">شرکت‌های من</MenuItem>
              {user?.team && <MenuItem value="team">تیم من</MenuItem>}
              <MenuItem value="unassigned">بدون مالک</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={ownersQuery.isLoading || ownersQuery.isError}>
            <InputLabel id="company-owner-filter-label">مالک</InputLabel>
            <Select
              labelId="company-owner-filter-label"
              label="مالک"
              value={ownershipScope === 'unassigned' ? 'unassigned' : ownerId}
              onChange={(event) => {
                const value = event.target.value;
                if (value === 'unassigned') {
                  setOwnerId('');
                  setOwnershipScope('unassigned');
                } else {
                  setOwnerId(value);
                  if (value) setOwnershipScope('all');
                  else if (ownershipScope === 'unassigned') setOwnershipScope('all');
                }
                resetToFirstPage();
              }}
              renderValue={(value) => value === '' ? 'همه مالکان' : value === 'unassigned' ? 'بدون مالک' : ownerOptions.find((owner) => owner.id === value)?.fullName ?? value}
            >
              <MenuItem value="">همه مالکان</MenuItem>
              <MenuItem value="unassigned">بدون مالک</MenuItem>
              {ownerOptions.map((owner) => (
                <MenuItem key={owner.id} value={owner.id}>
                  <ListItemText
                    primary={owner.fullName}
                    secondary={[owner.email, owner.teamName ?? owner.team, owner.roleName].filter(Boolean).join(' — ') || undefined}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {ownersQuery.isError && <Alert severity="warning" sx={{ mt: 2 }}>دریافت فهرست مالکان انجام نشد؛ سایر فیلترهای شرکت‌ها همچنان قابل استفاده هستند.</Alert>}
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error, 'خطا در دریافت اطلاعات شرکت‌ها.')}
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
          onPaginationModelChange={updatePagination}
          pageSizeOptions={[...COMPANY_PAGE_SIZES]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'شرکتی با این فیلترها یافت نشد.', paginationRowsPerPage: 'تعداد ردیف در صفحه:' }}
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
