import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import CompanyBranchFormDialog from './CompanyBranchFormDialog';
import { useCompanyBranches, useDeleteCompanyBranch } from '../hooks/useCompanyBranches';
import type { CompanyBranch } from '../types/companyBranch.types';

function display(value?: string | null): string {
  return value?.trim() || '—';
}

export default function CompanyBranchesTab({ companyId }: { companyId: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'branch:view', ['ADMIN', 'MANAGER', 'REP']);
  const canManage = can(user, 'branch:manage', ['ADMIN', 'MANAGER', 'REP']);
  const canDelete = can(user, 'branch:delete', ['ADMIN', 'MANAGER']);
  const branchesQuery = useCompanyBranches(companyId);
  const deleteBranch = useDeleteCompanyBranch(companyId);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedBranch, setSelectedBranch] = useState<CompanyBranch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<CompanyBranch | null>(null);

  const columns = useMemo<GridColDef<CompanyBranch>[]>(() => [
    { field: 'name', headerName: 'نام شعبه', minWidth: 160, flex: 0.8, valueFormatter: (value) => display(value) },
    { field: 'city', headerName: 'شهر', minWidth: 120, flex: 0.6, valueFormatter: (value) => display(value) },
    { field: 'address', headerName: 'آدرس', minWidth: 220, flex: 1.2, valueFormatter: (value) => display(value) },
    { field: 'phone', headerName: 'تلفن', minWidth: 140, flex: 0.7, valueFormatter: (value) => display(value) },
    { field: 'updatedAt', headerName: 'آخرین بروزرسانی', minWidth: 190, valueFormatter: (value) => formatDateTime(value) },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams<CompanyBranch>) => (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
          {canManage && <Button size="small" onClick={() => { setSelectedBranch(row); setFormMode('edit'); setFormOpen(true); }}>ویرایش</Button>}
          {canDelete && <Button size="small" color="error" onClick={() => setDeletingBranch(row)}>حذف</Button>}
        </Stack>
      ),
    },
  ], [canDelete, canManage]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده شعب برای این حساب فعال نیست.</Alert>;

  const confirmDelete = async () => {
    if (!deletingBranch) return;
    try {
      await deleteBranch.mutateAsync(deletingBranch.id);
      toast.success('شعبه با موفقیت حذف شد.');
      setDeletingBranch(null);
    } catch {
      toast.error('خطا در حذف شعبه.');
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">شعب شرکت</Typography>
        {canManage && <Button variant="contained" onClick={() => { setSelectedBranch(null); setFormMode('create'); setFormOpen(true); }}>افزودن شعبه</Button>}
      </Stack>

      {branchesQuery.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت شعب شرکت.</Alert>}
      {branchesQuery.isFetching && <Typography color="text.secondary" sx={{ mb: 1 }}>در حال دریافت شعب...</Typography>}

      <Paper sx={{ overflow: 'hidden' }}>
        <DataGrid
          autoHeight
          rows={branchesQuery.data ?? []}
          columns={columns}
          loading={branchesQuery.isFetching}
          hideFooter
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز شعبه‌ای برای این شرکت ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 320 }}
        />
      </Paper>

      {canManage && (
        <CompanyBranchFormDialog
          mode={formMode}
          companyId={companyId}
          branch={selectedBranch}
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      )}

      <Dialog open={Boolean(deletingBranch)} onClose={() => deleteBranch.isPending || setDeletingBranch(null)} fullWidth maxWidth="xs">
        <DialogTitle>حذف شعبه</DialogTitle>
        <DialogContent><Typography>آیا از حذف این شعبه مطمئن هستید؟</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingBranch(null)} disabled={deleteBranch.isPending}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteBranch.isPending}>
            {deleteBranch.isPending ? 'در حال حذف...' : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
