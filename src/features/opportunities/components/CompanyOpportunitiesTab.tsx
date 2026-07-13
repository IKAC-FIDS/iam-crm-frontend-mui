import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { can } from '@/features/auth/utils/permissions';
import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { useArchiveOpportunity, useCompanyOpportunities, useRestoreOpportunity } from '../hooks/useOpportunities';
import type { Opportunity } from '../types/opportunity.types';
import ChangeOpportunityOwnerDialog from './ChangeOpportunityOwnerDialog';
import ChangeOpportunityStageDialog from './ChangeOpportunityStageDialog';
import OpportunityFormDialog from './OpportunityFormDialog';

export default function CompanyOpportunitiesTab({ companyId }: { companyId: string }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const allowed = can(user, 'opportunity:view');
  const [page, setPage] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [form, setForm] = useState<Opportunity | null | undefined>(undefined);
  const [stage, setStage] = useState<Opportunity | null>(null);
  const [owner, setOwner] = useState<Opportunity | null>(null);
  const query = useCompanyOpportunities(companyId, { page: page.page + 1, limit: page.pageSize, includeArchived: true }, allowed);
  const archive = useArchiveOpportunity(companyId);
  const restore = useRestoreOpportunity(companyId);

  if (!allowed) return <Alert severity="warning">دسترسی مشاهده فرصت‌ها فعال نیست.</Alert>;

  const archiveToggle = async (item: Opportunity) => {
    try {
      if (item.archivedAt) await restore.mutateAsync(item.id);
      else await archive.mutateAsync({ id: item.id });
      toast.success(item.archivedAt ? 'فرصت بازیابی شد.' : 'فرصت بایگانی شد.');
    } catch {
      toast.error('عملیات بایگانی فرصت انجام نشد.');
    }
  };

  const columns: GridColDef<Opportunity>[] = [
    { field: 'title', headerName: 'عنوان فرصت', minWidth: 220, flex: 1 },
    { field: 'stage', headerName: 'مرحله فروش', minWidth: 150, valueGetter: (_value, row) => row.stage?.label ?? '—' },
    { field: 'owner', headerName: 'مسئول فرصت', minWidth: 160, valueGetter: (_value, row) => row.owner?.fullName ?? '—' },
    { field: 'priority', headerName: 'اولویت', minWidth: 120, valueFormatter: (value) => getPriorityLabel(value) },
    { field: 'estimatedValue', headerName: 'ارزش تخمینی فرصت', minWidth: 160, valueFormatter: (value) => value == null ? '—' : Number(value).toLocaleString('fa-IR') },
    { field: 'expectedCloseDate', headerName: 'تاریخ پیش‌بینی‌شده بستن فرصت', minWidth: 220, valueFormatter: (value) => formatDateTime(value) },
    { field: 'source', headerName: 'منبع ایجاد فرصت', minWidth: 160, valueGetter: (_value, row) => row.sourceOption?.label || row.opportunitySource || row.source || '—' },
    { field: 'primaryContact', headerName: 'مخاطب اصلی', minWidth: 150, valueGetter: (_value, row) => row.primaryContact?.fullName ?? '—' },
    { field: 'archivedAt', headerName: 'وضعیت', minWidth: 120, renderCell: ({ row }) => <Chip size="small" color={row.archivedAt ? 'default' : 'success'} label={row.archivedAt ? 'بایگانی' : 'فعال'} /> },
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
              onClick: () => navigate(`/opportunities/${row.id}`, { state: { backTo: `/companies/${companyId}`, backLabel: 'بازگشت به شرکت' } }),
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
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">فرصت‌های شرکت</Typography>
        {can(user, 'opportunity:create') && <Button variant="contained" onClick={() => setForm(null)}>ایجاد فرصت</Button>}
      </Stack>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت فرصت‌ها انجام نشد.</Alert>}
      <Paper>
        <DataGrid autoHeight rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={page} onPaginationModelChange={setPage} pageSizeOptions={[5, 10, 20]} disableRowSelectionOnClick />
      </Paper>
      {form !== undefined && <OpportunityFormDialog companyId={companyId} opportunity={form} open onClose={() => setForm(undefined)} />}
      {stage && <ChangeOpportunityStageDialog opportunity={stage} open onClose={() => setStage(null)} />}
      {owner && <ChangeOpportunityOwnerDialog opportunity={owner} open onClose={() => setOwner(null)} />}
    </>
  );
}
