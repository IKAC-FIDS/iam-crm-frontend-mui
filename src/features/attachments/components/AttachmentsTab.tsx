import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useAttachments, useDownloadAttachment } from '../hooks/useAttachments';
import { formatFileSize, getAttachmentEntityLabel, getMimeTypeLabel } from '../utils/attachmentDisplay';
import type { AttachmentEntityType, FileAttachment } from '../types/attachment.types';
import AttachmentUploadDialog from './AttachmentUploadDialog';
import DeleteAttachmentDialog from './DeleteAttachmentDialog';

function uploaderName(row: FileAttachment): string {
  return row.uploadedBy?.fullName || row.uploadedBy?.email || row.uploadedById || '—';
}

export default function AttachmentsTab({
  entityType,
  entityId,
  title,
  emptyMessage,
}: {
  entityType: AttachmentEntityType;
  entityId: string;
  title?: string;
  emptyMessage?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'attachment:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'attachment:manage', ['ADMIN', 'MANAGER', 'REP']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const query = useAttachments({ entityType, entityId, page: pagination.page + 1, limit: pagination.pageSize }, canView);
  const download = useDownloadAttachment();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<FileAttachment | null>(null);

  const downloadAttachment = useCallback(async (item: FileAttachment) => {
    try {
      await download.mutateAsync({ id: item.id, originalFileName: item.originalFileName });
      toast.success('دانلود پیوست آغاز شد.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'دانلود پیوست انجام نشد.'));
    }
  }, [download]);

  const columns = useMemo<GridColDef<FileAttachment>[]>(() => [
    { field: 'originalFileName', headerName: 'نام فایل', minWidth: 220, flex: 1 },
    { field: 'mimeType', headerName: 'نوع', minWidth: 120, valueFormatter: getMimeTypeLabel },
    { field: 'sizeBytes', headerName: 'حجم', minWidth: 110, valueFormatter: formatFileSize },
    { field: 'description', headerName: 'توضیحات', minWidth: 180, flex: 0.8, valueFormatter: (value) => value || '—' },
    { field: 'uploadedBy', headerName: 'بارگذار', minWidth: 150, valueGetter: (_value, row) => uploaderName(row) },
    { field: 'createdAt', headerName: 'تاریخ بارگذاری', minWidth: 170, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 170,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<FileAttachment>) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" disabled={!canView || download.isPending} onClick={() => downloadAttachment(row)}>دانلود</Button>
          <Button size="small" color="error" disabled={!canManage} onClick={() => setDeleting(row)}>حذف</Button>
        </Stack>
      ),
    },
  ], [canManage, canView, download.isPending, downloadAttachment]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده پیوست‌ها فعال نیست.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title ?? `پیوست‌های ${getAttachmentEntityLabel(entityType)}`}</Typography>
        {canManage && <Button variant="contained" onClick={() => setUploadOpen(true)}>بارگذاری پیوست</Button>}
      </Stack>
      {query.isError && <Alert severity="error">دریافت پیوست‌ها انجام نشد.</Alert>}
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
          localeText={{ noRowsLabel: emptyMessage ?? 'هنوز پیوستی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 340 }}
        />
      </Paper>
      {uploadOpen && <AttachmentUploadDialog entityType={entityType} entityId={entityId} open onClose={() => setUploadOpen(false)} />}
      {deleting && <DeleteAttachmentDialog key={deleting.id} attachment={deleting} entityType={entityType} entityId={entityId} open onClose={() => setDeleting(null)} />}
    </Stack>
  );
}
