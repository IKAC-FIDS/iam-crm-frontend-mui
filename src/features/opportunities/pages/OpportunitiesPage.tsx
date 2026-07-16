import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { RowActions } from '@/shared/components/RowActions';
import { getApiErrorMessage } from '@/lib/apiResponse';
import type { OwnershipScope } from '@/shared/types/ownership';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { COMPANY_PRIORITY_OPTIONS, type Priority } from '@/features/companies/types/company.types';
import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '@/features/catalogs/types/catalog.types';
import { useRuntimePipelineStages } from '@/features/pipelineConfig/hooks/usePipelineConfig';
import ChangeOpportunityOwnerDialog from '../components/ChangeOpportunityOwnerDialog';
import ChangeOpportunityStageDialog from '../components/ChangeOpportunityStageDialog';
import OpportunityFormDialog from '../components/OpportunityFormDialog';
import { useArchiveOpportunity, useOpportunities, useRestoreOpportunity } from '../hooks/useOpportunities';
import type { Opportunity } from '../types/opportunity.types';

type ArchiveFilter = 'ACTIVE' | 'ALL' | 'ARCHIVED';

export default function OpportunitiesPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const allowed = can(user, 'opportunity:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [stageId, setStageId] = useState('');
  const [sourceOptionId, setSourceOptionId] = useState('');
  const [archive, setArchive] = useState<ArchiveFilter>('ACTIVE');
  const [ownershipScope, setOwnershipScope] = useState<OwnershipScope>('all');
  const [form, setForm] = useState<Opportunity | null | undefined>(undefined);
  const [stage, setStage] = useState<Opportunity | null>(null);
  const [owner, setOwner] = useState<Opportunity | null>(null);
  const debounced = useDebouncedValue(search.trim(), 400);
  const stages = useRuntimePipelineStages(allowed);
  const sourceOptionsQuery = useCatalog('lookupOptions', allowed, { group: 'opportunity-sources' });
  const sourceOptions = (sourceOptionsQuery.data ?? []).filter(isCatalogItemActive);
  const query = useOpportunities({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search: debounced || undefined,
    priority: priority || undefined,
    stageId: stageId || undefined,
    sourceOptionId: sourceOptionId || undefined,
    ownershipScope,
    includeArchived: archive === 'ALL' ? true : undefined,
    archivedOnly: archive === 'ARCHIVED' ? true : undefined,
  }, allowed);
  const archiveMutation = useArchiveOpportunity();
  const restoreMutation = useRestoreOpportunity();

  if (!allowed) return <Alert severity="warning">دسترسی مشاهده فرصت‌ها فعال نیست.</Alert>;

  const archiveToggle = async (item: Opportunity) => {
    try {
      if (item.archivedAt) await restoreMutation.mutateAsync(item.id);
      else await archiveMutation.mutateAsync({ id: item.id });
      toast.success(item.archivedAt ? 'فرصت بازیابی شد.' : 'فرصت بایگانی شد.');
    } catch {
      toast.error('عملیات بایگانی فرصت انجام نشد.');
    }
  };

  const openDetails = (item: Opportunity) => navigate(`/opportunities/${item.id}`, {
    state: { backTo: '/opportunities', backLabel: 'بازگشت به فرصت‌ها' },
  });

  const columns: GridColDef<Opportunity>[] = [
    { field: 'title', headerName: 'عنوان فرصت', minWidth: 220, flex: 1 },
    { field: 'company', headerName: 'شرکت', minWidth: 180, valueGetter: (_value, row) => row.company?.brandName || row.company?.legalName || '—' },
    { field: 'stage', headerName: 'مرحله فروش', minWidth: 140, valueGetter: (_value, row) => row.stage?.label ?? '—' },
    { field: 'owner', headerName: 'مسئول فرصت', minWidth: 150, valueGetter: (_value, row) => row.owner?.fullName ?? '—' },
    { field: 'priority', headerName: 'اولویت', minWidth: 110, valueFormatter: (value) => getPriorityLabel(value) },
    { field: 'estimatedValue', headerName: 'ارزش تخمینی فرصت', minWidth: 160, valueFormatter: (value) => value == null ? '—' : Number(value).toLocaleString('fa-IR') },
    { field: 'expectedCloseDate', headerName: 'تاریخ پیش‌بینی‌شده بستن فرصت', minWidth: 220, valueFormatter: (value) => formatDateTime(value) },
    { field: 'source', headerName: 'منبع ایجاد فرصت', minWidth: 160, valueGetter: (_value, row) => row.sourceOption?.label || row.opportunitySource || row.source || '—' },
    { field: 'primaryContact', headerName: 'مخاطب اصلی', minWidth: 150, valueGetter: (_value, row) => row.primaryContact?.fullName ?? '—' },
    { field: 'archivedAt', headerName: 'وضعیت', minWidth: 110, renderCell: ({ row }) => <Chip size="small" color={row.archivedAt ? 'default' : 'success'} label={row.archivedAt ? 'بایگانی' : 'فعال'} /> },
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
      renderCell: ({ row }: GridRenderCellParams<Opportunity>) => (
        <RowActions
          actions={[
            {
              key: 'view',
              label: 'مشاهده جزئیات',
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              onClick: () => openDetails(row),
            },
            {
              key: 'edit',
              label: 'ویرایش',
              icon: <EditOutlinedIcon fontSize="small" />,
              disabled: !can(user, 'opportunity:update') || Boolean(row.archivedAt),
              onClick: () => setForm(row),
            },
            {
              key: 'stage',
              label: 'مرحله فروش',
              icon: <TrendingUpOutlinedIcon fontSize="small" />,
              disabled: !can(user, 'opportunity:change-stage') || Boolean(row.archivedAt),
              menuOnly: true,
              onClick: () => setStage(row),
            },
            {
              key: 'owner',
              label: 'مسئول فرصت',
              icon: <ManageAccountsOutlinedIcon fontSize="small" />,
              disabled: !can(user, 'opportunity:change-owner') || Boolean(row.archivedAt),
              menuOnly: true,
              onClick: () => setOwner(row),
            },
            {
              key: 'archive-toggle',
              label: row.archivedAt ? 'بازیابی' : 'بایگانی',
              icon: row.archivedAt ? <RestoreOutlinedIcon fontSize="small" /> : <ArchiveOutlinedIcon fontSize="small" />,
              color: row.archivedAt ? 'success' : 'warning',
              disabled: !can(user, row.archivedAt ? 'opportunity:restore' : 'opportunity:archive'),
              menuOnly: true,
              onClick: () => archiveToggle(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>فرصت‌ها</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>فهرست سراسری فرصت‌های فروش و مسیر دسترسی به جزئیات هر فرصت.</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }} />
          <FormControl fullWidth><InputLabel>نمایش</InputLabel><Select label="نمایش" value={ownershipScope} onChange={(event) => { setOwnershipScope(event.target.value as OwnershipScope); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="all">همه</MenuItem><MenuItem value="mine">فقط مال من</MenuItem>{user?.team && <MenuItem value="team">تیم من</MenuItem>}<MenuItem value="unassigned">بدون مالک</MenuItem></Select></FormControl>
          <FormControl fullWidth><InputLabel>مرحله فروش</InputLabel><Select label="مرحله فروش" value={stageId} onChange={(event) => { setStageId(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه</MenuItem>{(stages.data ?? []).map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
          <FormControl fullWidth><InputLabel>اولویت</InputLabel><Select label="اولویت" value={priority} onChange={(event) => { setPriority(event.target.value as Priority | ''); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه</MenuItem>{COMPANY_PRIORITY_OPTIONS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select></FormControl>
          <FormControl fullWidth disabled={sourceOptionsQuery.isError}><InputLabel>منبع ایجاد فرصت</InputLabel><Select label="منبع ایجاد فرصت" value={sourceOptionId} onChange={(event) => { setSourceOptionId(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه منابع</MenuItem>{sourceOptions.map((item) => <MenuItem key={item.id} value={item.id}>{getCatalogItemLabel(item)}</MenuItem>)}</Select></FormControl>
          <FormControl fullWidth><InputLabel>بایگانی</InputLabel><Select label="بایگانی" value={archive} onChange={(event) => { setArchive(event.target.value as ArchiveFilter); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="ACTIVE">فعال</MenuItem><MenuItem value="ALL">همه</MenuItem><MenuItem value="ARCHIVED">بایگانی</MenuItem></Select></FormControl>
        </Stack>
      </Paper>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>{getApiErrorMessage(query.error, 'دریافت فرصت‌ها انجام نشد.')}</Alert>}
      {stages.isError && <Alert severity="warning" sx={{ mb: 2 }}>دریافت مراحل پایپ‌لاین انجام نشد.</Alert>}
      {sourceOptionsQuery.isError && <Alert severity="warning" sx={{ mb: 2 }}>دریافت منابع ایجاد فرصت انجام نشد.</Alert>}
      <Paper>
        <DataGrid autoHeight rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[5, 10, 20, 50]} disableRowSelectionOnClick localeText={{ noRowsLabel: 'فرصتی مطابق فیلترها یافت نشد.' }} />
      </Paper>
      {form !== undefined && <OpportunityFormDialog companyId={form?.companyId ?? ''} opportunity={form} open onClose={() => setForm(undefined)} />}
      {stage && <ChangeOpportunityStageDialog opportunity={stage} open onClose={() => setStage(null)} />}
      {owner && <ChangeOpportunityOwnerDialog opportunity={owner} open onClose={() => setOwner(null)} />}
    </Box>
  );
}
