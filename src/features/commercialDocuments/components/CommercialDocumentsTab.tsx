import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { formatMoney } from '@/features/opportunityLineItems/utils/money';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useCommercialDocuments, useDeleteCommercialDocument } from '../hooks/useCommercialDocuments';
import { commercialDocumentStatusOptions, commercialDocumentTypeOptions, getCommercialDocumentStatusLabel, getCommercialDocumentTypeLabel, safeExternalUrl } from '../utils/commercialDocumentDisplay';
import type { CommercialDocument, CommercialDocumentListParams, CommercialDocumentStatus, CommercialDocumentType } from '../types/commercialDocument.types';
import ChangeCommercialDocumentStatusDialog from './ChangeCommercialDocumentStatusDialog';
import CommercialDocumentFormDialog from './CommercialDocumentFormDialog';

export default function CommercialDocumentsTab({ opportunityId, companyId }: { opportunityId: string; companyId?: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'commercial-document:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'commercial-document:manage', ['ADMIN', 'MANAGER', 'REP']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [type, setType] = useState<CommercialDocumentType | ''>('');
  const [status, setStatus] = useState<CommercialDocumentStatus | ''>('');
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const params: CommercialDocumentListParams = { page: pagination.page + 1, limit: pagination.pageSize, search: debouncedSearch || undefined, type, status };
  const query = useCommercialDocuments(opportunityId, params, canView);
  const remove = useDeleteCommercialDocument(opportunityId, companyId);
  const [editing, setEditing] = useState<CommercialDocument | null | undefined>(undefined);
  const [changing, setChanging] = useState<CommercialDocument | null>(null);
  const [deleting, setDeleting] = useState<CommercialDocument | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('سند تجاری حذف شد.');
      setDeleting(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف سند تجاری انجام نشد.'));
    }
  };

  const columns = useMemo<GridColDef<CommercialDocument>[]>(() => [
    { field: 'type', headerName: 'نوع', minWidth: 110, valueFormatter: (value) => getCommercialDocumentTypeLabel(value) },
    { field: 'status', headerName: 'وضعیت', minWidth: 120, valueFormatter: (value) => getCommercialDocumentStatusLabel(value) },
    { field: 'number', headerName: 'شماره', minWidth: 130, valueFormatter: (value) => value || '—' },
    { field: 'version', headerName: 'نسخه', minWidth: 80, valueFormatter: (value) => value ?? '—' },
    { field: 'title', headerName: 'عنوان', minWidth: 200, flex: 1 },
    { field: 'amount', headerName: 'مبلغ', minWidth: 150, valueFormatter: (value, row) => formatMoney(value, row.currency) },
    { field: 'validUntil', headerName: 'اعتبار تا', minWidth: 140, valueFormatter: formatDateTime },
    { field: 'issuedAt', headerName: 'صدور', minWidth: 140, valueFormatter: formatDateTime },
    { field: 'sentAt', headerName: 'ارسال/امضا', minWidth: 160, valueGetter: (_value, row) => formatDateTime(row.signedAt ?? row.sentAt) },
    { field: 'createdAt', headerName: 'ایجاد', minWidth: 150, valueFormatter: formatDateTime },
    { field: 'fileUrl', headerName: 'فایل', minWidth: 90, renderCell: ({ row }) => safeExternalUrl(row.fileUrl) ? <Link href={safeExternalUrl(row.fileUrl) ?? undefined} target="_blank" rel="noopener noreferrer">باز کردن</Link> : '—' },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 250,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<CommercialDocument>) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" disabled={!canManage} onClick={() => setEditing(row)}>ویرایش</Button>
          <Button size="small" disabled={!canManage} onClick={() => setChanging(row)}>وضعیت</Button>
          <Button size="small" color="error" disabled={!canManage || remove.isPending} onClick={() => setDeleting(row)}>حذف</Button>
        </Stack>
      ),
    },
  ], [canManage, remove.isPending]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده اسناد تجاری فعال نیست.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }} />
        <TextField fullWidth select label="نوع" value={type} onChange={(event) => { setType(event.target.value as CommercialDocumentType | ''); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه</MenuItem>{commercialDocumentTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
        <TextField fullWidth select label="وضعیت" value={status} onChange={(event) => { setStatus(event.target.value as CommercialDocumentStatus | ''); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه</MenuItem>{commercialDocumentStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">اسناد تجاری</Typography>
        {canManage && <Button variant="contained" onClick={() => setEditing(null)}>افزودن سند</Button>}
      </Stack>
      {query.isError && <Alert severity="error">دریافت اسناد تجاری انجام نشد.</Alert>}
      <Paper>
        <DataGrid autoHeight rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[5, 10, 20, 50]} disableRowSelectionOnClick localeText={{ noRowsLabel: 'هنوز سند تجاری برای این فرصت ثبت نشده است.' }} sx={{ border: 0, minHeight: 360 }} />
      </Paper>
      {editing !== undefined && <CommercialDocumentFormDialog key={editing?.id ?? 'new'} opportunityId={opportunityId} companyId={companyId} document={editing} open onClose={() => setEditing(undefined)} />}
      {changing && <ChangeCommercialDocumentStatusDialog key={changing.id} opportunityId={opportunityId} companyId={companyId} document={changing} open onClose={() => setChanging(null)} />}
      <Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}><DialogTitle>حذف سند تجاری</DialogTitle><DialogContent>آیا از حذف «{deleting?.title ?? ''}» مطمئن هستید؟</DialogContent><DialogActions><Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog>
    </Stack>
  );
}
