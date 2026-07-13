import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { can, canAny } from '@/features/auth/utils/permissions';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { ssoService } from '../services/sso.service';
import { useSsoProviders } from '../hooks/useSsoProviders';
import {
  formatSsoDate,
  getSsoProviderDisplayName,
  getSsoProviderStatusColor,
  getSsoProviderStatusLabel,
  getSsoProviderTypeLabel,
  isSsoProviderActive,
  ssoProviderTypeOptions,
} from '../utils/ssoDisplay';
import type { SsoProvider, SsoProviderType } from '../types/sso.types';
import SsoProviderFormDialog from '../components/SsoProviderFormDialog';
import SsoProviderStatusDialog, { type SsoProviderAction } from '../components/SsoProviderStatusDialog';

interface PendingAction {
  provider: SsoProvider;
  action: SsoProviderAction;
}

export default function AdminSsoProvidersPage() {
  const user = useAuthStore((state) => state.user);
  const canView = canAny(user, ['sso-provider:view', 'sso-provider:manage'], ['ADMIN']);
  const canManage = can(user, 'sso-provider:manage', ['ADMIN']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [type, setType] = useState<SsoProviderType | ''>('');
  const [active, setActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [formProvider, setFormProvider] = useState<SsoProvider | null | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const query = useSsoProviders({}, canView);

  const filteredRows = useMemo(() => {
    const term = debouncedSearch.toLocaleLowerCase('fa');
    return (query.data?.data ?? []).filter((provider) => {
      const matchesSearch = !term || [
        provider.name,
        provider.displayName,
        provider.issuer,
        provider.entityId,
        provider.ssoUrl,
        provider.allowedDomains?.join(' '),
      ].some((value) => value?.toLocaleLowerCase('fa').includes(term));
      const matchesType = !type || provider.type === type;
      const activeState = isSsoProviderActive(provider);
      const matchesActive = active === 'all' || (active === 'active' ? activeState : !activeState);
      return matchesSearch && matchesType && matchesActive;
    });
  }, [active, debouncedSearch, query.data?.data, type]);

  const columns = useMemo<GridColDef<SsoProvider>[]>(() => [
    { field: 'name', headerName: 'نام', minWidth: 190, flex: 1, valueGetter: (_value, row) => getSsoProviderDisplayName(row) },
    { field: 'type', headerName: 'نوع', minWidth: 100, valueGetter: (_value, row) => getSsoProviderTypeLabel(row.type) },
    { field: 'issuer', headerName: 'Issuer / Entity ID', minWidth: 230, flex: 1, valueGetter: (_value, row) => row.issuer || row.entityId || '—' },
    { field: 'allowedDomains', headerName: 'دامنه‌ها', minWidth: 180, valueGetter: (_value, row) => row.allowedDomains?.join(', ') || '—' },
    { field: 'autoProvision', headerName: 'کاربر خودکار', minWidth: 120, valueGetter: (_value, row) => row.autoProvision ? 'فعال' : 'غیرفعال' },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 110,
      renderCell: ({ row }) => (
        <Chip size="small" color={getSsoProviderStatusColor(row)} label={getSsoProviderStatusLabel(row)} />
      ),
    },
    { field: 'createdAt', headerName: 'ایجاد', minWidth: 170, valueFormatter: formatSsoDate },
    { field: 'updatedAt', headerName: 'بروزرسانی', minWidth: 170, valueFormatter: formatSsoDate },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 136,
      width: 136,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<SsoProvider>) => {
        const activeProvider = isSsoProviderActive(row);
        return (
          <RowActions
            actions={[
              {
                key: 'edit',
                label: 'ویرایش',
                icon: <EditOutlinedIcon fontSize="small" />,
                disabled: !canManage,
                onClick: () => setFormProvider(row),
              },
              {
                key: 'test',
                label: 'تست ورود',
                icon: <LoginIcon fontSize="small" />,
                disabled: !activeProvider,
                onClick: () => ssoService.startLogin(row),
              },
              {
                key: 'active-toggle',
                label: activeProvider ? 'غیرفعال‌سازی' : 'فعال‌سازی',
                icon: activeProvider ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />,
                color: activeProvider ? 'warning' : 'success',
                disabled: !canManage,
                menuOnly: true,
                onClick: () => setPendingAction({ provider: row, action: activeProvider ? 'deactivate' : 'activate' }),
              },
              {
                key: 'delete',
                label: 'حذف',
                icon: <DeleteOutlineIcon fontSize="small" />,
                color: 'error',
                disabled: !canManage,
                menuOnly: true,
                onClick: () => setPendingAction({ provider: row, action: 'delete' }),
              },
            ]}
          />
        );
      },
    },
  ], [canManage]);

  if (!canView) {
    return <Alert severity="warning">دسترسی مدیریت ورود سازمانی فعال نیست.</Alert>;
  }

  const resetPage = () => setPagination((current) => ({ ...current, page: 0 }));

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box>
          <Typography variant="h4">مدیریت ورود سازمانی</Typography>
          <Typography color="text.secondary">
            مدیریت ارائه‌دهنده‌های OIDC و SAML برای ورود کاربران به سامانه
          </Typography>
        </Box>
        {canManage && <Button variant="contained" onClick={() => setFormProvider(null)}>ایجاد ارائه‌دهنده</Button>}
      </Stack>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
          <TextField fullWidth select label="نوع" value={type} onChange={(event) => { setType(event.target.value as SsoProviderType | ''); resetPage(); }}>
            <MenuItem value="">همه</MenuItem>
            {ssoProviderTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField fullWidth select label="وضعیت" value={active} onChange={(event) => { setActive(event.target.value as 'all' | 'active' | 'inactive'); resetPage(); }}>
            <MenuItem value="all">همه</MenuItem>
            <MenuItem value="active">فعال</MenuItem>
            <MenuItem value="inactive">غیرفعال</MenuItem>
          </TextField>
        </Stack>
      </Paper>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت ارائه‌دهنده‌های ورود سازمانی انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          loading={query.isFetching}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز ارائه‌دهنده ورود سازمانی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 420 }}
        />
      </Paper>
      {formProvider !== undefined && (
        <SsoProviderFormDialog
          key={formProvider?.id ?? 'new'}
          provider={formProvider}
          open
          onClose={() => setFormProvider(undefined)}
        />
      )}
      {pendingAction && (
        <SsoProviderStatusDialog
          provider={pendingAction.provider}
          action={pendingAction.action}
          open
          onClose={() => setPendingAction(null)}
        />
      )}
    </Box>
  );
}
