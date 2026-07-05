import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import Header from '@/components/dashboard/Header';
import CreateCompanyDialog from '../components/CreateCompanyDialog';
import { useCompanies } from '../hooks/useCompanies';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  COMPANY_PAGE_SIZES,
  COMPANY_PRIORITIES,
  COMPANY_STAGES,
  companyPriorityLabels,
  companyStageLabels,
  isCompanyPriority,
  isCompanyStage,
} from '../types/company.types';
import type {
  CompaniesQueryParams,
  Company,
  CompanyPageSize,
  CompanyPriority,
  CompanyStage,
} from '../types/company.types';

type OwnerFilter = 'ALL' | 'WITHOUT_OWNER' | 'SPECIFIC_OWNER';

interface ApiErrorBody {
  message?: string;
}

function displayValue(value?: string | null): string {
  return value?.trim() || '—';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getErrorMessage(error: Error | null): string {
  const apiError = error as AxiosError<ApiErrorBody> | null;
  return apiError?.response?.data?.message || 'دریافت فهرست شرکت‌ها با خطا مواجه شد.';
}

export default function CompaniesPage() {
  const navigate = useNavigate();
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
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const queryParams = useMemo<CompaniesQueryParams>(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize as CompanyPageSize,
      ...(stage && { stage }),
      ...(priority && { priority }),
      ...(ownerFilter === 'WITHOUT_OWNER' && { withoutOwner: true }),
      ...(ownerFilter === 'SPECIFIC_OWNER' && ownerId && { ownerId }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }),
    [debouncedSearch, ownerFilter, ownerId, paginationModel, priority, stage],
  );

  const { data, error, isError, isFetching } = useCompanies(queryParams);

  const resetToFirstPage = () => {
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const columns = useMemo<GridColDef<Company>[]>(
    () => [
      { field: 'legalName', headerName: 'نام حقوقی', minWidth: 180, flex: 1 },
      { field: 'brandName', headerName: 'نام برند', minWidth: 140, flex: 0.8 },
      { field: 'industry', headerName: 'صنعت', minWidth: 130, flex: 0.7 },
      {
        field: 'stage',
        headerName: 'مرحله',
        minWidth: 170,
        flex: 0.9,
        renderCell: ({ value }: GridRenderCellParams<Company, string | null>) =>
          value && isCompanyStage(value) ? companyStageLabels[value] : displayValue(value),
      },
      {
        field: 'priority',
        headerName: 'اولویت',
        minWidth: 110,
        renderCell: ({ value }: GridRenderCellParams<Company, string | null>) =>
          value && isCompanyPriority(value) ? companyPriorityLabels[value] : displayValue(value),
      },
      {
        field: 'owner',
        headerName: 'مالک',
        minWidth: 150,
        flex: 0.7,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<Company>) => displayValue(row.owner?.fullName),
      },
      { field: 'headOfficeCity', headerName: 'شهر دفتر مرکزی', minWidth: 150 },
      {
        field: 'updatedAt',
        headerName: 'آخرین بروزرسانی',
        minWidth: 180,
        renderCell: ({ value }: GridRenderCellParams<Company, string | null>) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: 'عملیات',
        minWidth: 250,
        sortable: false,
        filterable: false,
        renderCell: ({ row }: GridRenderCellParams<Company>) => (
          <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
            <Button size="small" onClick={() => navigate(`/companies/${row.id}`)}>
              مشاهده جزئیات
            </Button>
            <Tooltip title="حذف شرکت در نسخه بعدی فعال می‌شود">
              <span>
                <Button size="small" color="error" disabled>
                  حذف
                </Button>
              </span>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [navigate],
  );

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Header />

      <Stack direction="row" sx={{ mb: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          افزودن شرکت
        </Button>
      </Stack>

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
              {COMPANY_STAGES.map((value) => (
                <MenuItem key={value} value={value}>
                  {companyStageLabels[value]}
                </MenuItem>
              ))}
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
              {COMPANY_PRIORITIES.map((value) => (
                <MenuItem key={value} value={value}>
                  {companyPriorityLabels[value]}
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
          {getErrorMessage(error)}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          autoHeight
          rows={data?.items ?? []}
          columns={columns}
          loading={isFetching}
          rowCount={data?.total ?? 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[...COMPANY_PAGE_SIZES]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'شرکتی یافت نشد' }}
          sx={{
            border: 0,
            minHeight: 420,
            '& .MuiDataGrid-cell': { alignItems: 'center' },
          }}
        />
      </Paper>

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Box>
  );
}
