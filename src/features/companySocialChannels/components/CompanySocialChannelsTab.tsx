import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Paper, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { can } from '@/features/auth/utils/permissions';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import CompanySocialChannelFormDialog from './CompanySocialChannelFormDialog';
import { useCompanySocialChannels, useDeleteCompanySocialChannel } from '../hooks/useCompanySocialChannels';
import type { CompanySocialChannel } from '../types/companySocialChannel.types';
import { canOpenSocialHandle, formatSocialHandle, getCompanySocialPlatformLabel } from '../utils/companySocialChannelDisplay';

export default function CompanySocialChannelsTab({ companyId }: { companyId: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'social-channel:view', ['ADMIN', 'MANAGER', 'REP']);
  const canManage = can(user, 'social-channel:manage', ['ADMIN', 'MANAGER', 'REP']);
  const canDelete = can(user, 'social-channel:delete', ['ADMIN', 'MANAGER']);
  const channelsQuery = useCompanySocialChannels(companyId);
  const deleteChannel = useDeleteCompanySocialChannel(companyId);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<CompanySocialChannel | null>(null);
  const [deleting, setDeleting] = useState<CompanySocialChannel | null>(null);

  const columns = useMemo<GridColDef<CompanySocialChannel>[]>(() => [
    { field: 'platform', headerName: 'پلتفرم', minWidth: 130, flex: 0.5, valueFormatter: (value) => getCompanySocialPlatformLabel(value) },
    {
      field: 'handle', headerName: 'آدرس / هندل', minWidth: 240, flex: 1,
      renderCell: ({ row }: GridRenderCellParams<CompanySocialChannel>) => canOpenSocialHandle(row.platform, row.handle)
        ? <Link href={row.handle} target="_blank" rel="noreferrer" underline="hover">{formatSocialHandle(row.platform, row.handle)}</Link>
        : formatSocialHandle(row.platform, row.handle),
    },
    { field: 'updatedAt', headerName: 'آخرین بروزرسانی', minWidth: 190, valueFormatter: (value) => formatDateTime(value) },
    {
      field: 'actions', headerName: 'عملیات', minWidth: 136, width: 136, align: 'center', headerAlign: 'center', sortable: false, filterable: false, disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<CompanySocialChannel>) => (
        <RowActions
          actions={[
            {
              key: 'open',
              label: 'باز کردن',
              icon: <OpenInNewOutlinedIcon fontSize="small" />,
              visible: canOpenSocialHandle(row.platform, row.handle),
              href: row.handle,
              target: '_blank',
              rel: 'noreferrer',
              onClick: () => undefined,
            },
            {
              key: 'edit',
              label: 'ویرایش',
              icon: <EditOutlinedIcon fontSize="small" />,
              visible: canManage,
              onClick: () => {
                setSelected(row);
                setMode('edit');
                setFormOpen(true);
              },
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              visible: canDelete,
              menuOnly: true,
              onClick: () => setDeleting(row),
            },
          ]}
        />
      ),
    },
  ], [canDelete, canManage]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده کانال‌های اجتماعی برای این حساب فعال نیست.</Alert>;

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteChannel.mutateAsync(deleting.id);
      toast.success('کانال اجتماعی با موفقیت حذف شد.');
      setDeleting(null);
    } catch {
      toast.error('خطا در حذف کانال اجتماعی.');
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">کانال‌های اجتماعی شرکت</Typography>
        {canManage && <Button variant="contained" onClick={() => { setSelected(null); setMode('create'); setFormOpen(true); }}>افزودن کانال اجتماعی</Button>}
      </Stack>
      {channelsQuery.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت کانال‌های اجتماعی شرکت.</Alert>}
      {channelsQuery.isFetching && <Typography color="text.secondary" sx={{ mb: 1 }}>در حال دریافت کانال‌های اجتماعی...</Typography>}
      <Paper sx={{ overflow: 'hidden' }}>
        <DataGrid autoHeight rows={channelsQuery.data ?? []} columns={columns} loading={channelsQuery.isFetching} hideFooter disableRowSelectionOnClick localeText={{ noRowsLabel: 'هنوز کانال اجتماعی برای این شرکت ثبت نشده است.' }} sx={{ border: 0, minHeight: 320 }} />
      </Paper>
      {canManage && <CompanySocialChannelFormDialog mode={mode} companyId={companyId} channel={selected} open={formOpen} onClose={() => setFormOpen(false)} />}
      <Dialog open={Boolean(deleting)} onClose={() => { if (!deleteChannel.isPending) setDeleting(null); }} fullWidth maxWidth="xs">
        <DialogTitle>حذف کانال اجتماعی</DialogTitle>
        <DialogContent><Typography>آیا از حذف این کانال اجتماعی مطمئن هستید؟</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleting(null)} disabled={deleteChannel.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteChannel.isPending}>{deleteChannel.isPending ? 'در حال حذف...' : 'حذف'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
