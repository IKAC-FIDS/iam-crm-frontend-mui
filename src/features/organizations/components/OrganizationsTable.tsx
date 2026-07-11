import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useOrganizations } from '../hooks/useOrganizations';
import {
  formatOrganizationDate,
  getOrganizationLocaleLabel,
  getOrganizationStatusColor,
  getOrganizationStatusLabel,
  getOrganizationTimezoneLabel,
  organizationStatusOptions,
} from '../utils/organizationDisplay';
import type { FindOrganizationsParams, Organization, OrganizationStatus } from '../types/organization.types';
import OrganizationFormDialog from './OrganizationFormDialog';
import OrganizationStatusDialog from './OrganizationStatusDialog';

interface StatusAction {
  organization: Organization;
  action: 'activate' | 'suspend';
}

export default function OrganizationsTable() {
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrganizationStatus | ''>('');
  const [formOrganization, setFormOrganization] = useState<Organization | null | undefined>(undefined);
  const [statusAction, setStatusAction] = useState<StatusAction | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const params: FindOrganizationsParams = {
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: status || undefined,
  };
  const query = useOrganizations(params);
  const resetPage = () => setPagination((current) => ({ ...current, page: 0 }));

  const columns = useMemo<GridColDef<Organization>[]>(() => [
    { field: 'name', headerName: 'نام', minWidth: 220, flex: 1 },
    { field: 'code', headerName: 'کد', minWidth: 150 },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 130,
      renderCell: ({ row }) => (
        <Chip size="small" color={getOrganizationStatusColor(row.status)} label={getOrganizationStatusLabel(row.status)} />
      ),
    },
    { field: 'timezone', headerName: 'منطقه زمانی', minWidth: 150, valueGetter: (_value, row) => getOrganizationTimezoneLabel(row.timezone) },
    { field: 'locale', headerName: 'زبان', minWidth: 140, valueGetter: (_value, row) => getOrganizationLocaleLabel(row.locale) },
    { field: 'createdAt', headerName: 'ایجاد', minWidth: 170, valueFormatter: formatOrganizationDate },
    { field: 'updatedAt', headerName: 'بروزرسانی', minWidth: 170, valueFormatter: formatOrganizationDate },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 260,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<Organization>) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setFormOrganization(row)}>ویرایش</Button>
          <Button
            size="small"
            color="success"
            disabled={row.status === 'ACTIVE'}
            onClick={() => setStatusAction({ organization: row, action: 'activate' })}
          >
            فعال‌سازی
          </Button>
          <Button
            size="small"
            color="warning"
            disabled={row.status === 'SUSPENDED' || row.status === 'ARCHIVED'}
            onClick={() => setStatusAction({ organization: row, action: 'suspend' })}
          >
            تعلیق
          </Button>
        </Stack>
      ),
    },
  ], []);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
          <TextField fullWidth select label="وضعیت" value={status} onChange={(event) => { setStatus(event.target.value as OrganizationStatus | ''); resetPage(); }}>
            <MenuItem value="">همه</MenuItem>
            {organizationStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={() => setFormOrganization(null)}>ایجاد سازمان</Button>
      </Stack>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت سازمان‌ها انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={query.data?.data ?? []}
          columns={columns}
          loading={query.isFetching}
          rowCount={query.data?.meta.total ?? 0}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز سازمانی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 420 }}
        />
      </Paper>
      {formOrganization !== undefined && (
        <OrganizationFormDialog
          key={formOrganization?.id ?? 'new'}
          organization={formOrganization}
          open
          onClose={() => setFormOrganization(undefined)}
        />
      )}
      {statusAction && (
        <OrganizationStatusDialog
          organization={statusAction.organization}
          action={statusAction.action}
          open
          onClose={() => setStatusAction(null)}
        />
      )}
    </Box>
  );
}
