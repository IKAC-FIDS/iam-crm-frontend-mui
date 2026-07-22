import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { RowActions } from '@/shared/components/RowActions';
import { useAttachments, useDownloadAttachment } from '../hooks/useAttachments';
import {
  formatFileSize,
  getAttachmentDisplayFileName,
  getAttachmentDownloadErrorMessage,
  getAttachmentEntityLabel,
  getMimeTypeLabel,
  getSafeAttachmentExternalUrl,
} from '../utils/attachmentDisplay';
import type { AttachmentEntityType, FileAttachment } from '../types/attachment.types';
import AttachmentUploadDialog from './AttachmentUploadDialog';
import DeleteAttachmentDialog from './DeleteAttachmentDialog';

function uploaderName(row: FileAttachment): string {
  return row.uploadedBy?.fullName || row.uploadedBy?.email || row.uploadedById || '—';
}

function hasStoredFile(row: FileAttachment): boolean {
  return Boolean(row.originalFileName || row.objectKey || row.storagePath);
}

export default function AttachmentsTab({
  entityType,
  entityId,
  title,
  emptyMessage,
  uploadButtonLabel,
  uploadDialogTitle,
  descriptionLabel,
}: {
  entityType: AttachmentEntityType;
  entityId: string;
  title?: string;
  emptyMessage?: string;
  uploadButtonLabel?: string;
  uploadDialogTitle?: string;
  descriptionLabel?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'attachment:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'attachment:manage', ['ADMIN', 'MANAGER', 'REP']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const query = useAttachments({ entityType, entityId, page: pagination.page + 1, limit: pagination.pageSize }, canView);
  const download = useDownloadAttachment();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<FileAttachment | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadAttachment = useCallback(async (item: FileAttachment) => {
    const fileName = getAttachmentDisplayFileName(item);
    setDownloadingId(item.id);
    try {
      await download.mutateAsync({ id: item.id, originalFileName: fileName });
      toast.success('دانلود پیوست آغاز شد.');
    } catch (error) {
      toast.error(getAttachmentDownloadErrorMessage(error));
    } finally {
      setDownloadingId(null);
    }
  }, [download]);

  const columns = useMemo<GridColDef<FileAttachment>[]>(() => [
    { field: 'originalFileName', headerName: 'نام فایل', minWidth: 220, flex: 1, valueGetter: (_value, row) => getAttachmentDisplayFileName(row) },
    { field: 'mimeType', headerName: 'نوع', minWidth: 120, valueFormatter: getMimeTypeLabel },
    { field: 'sizeBytes', headerName: 'حجم', minWidth: 110, valueFormatter: formatFileSize },
    { field: 'description', headerName: 'توضیحات', minWidth: 180, flex: 0.8, valueFormatter: (value) => value || '—' },
    { field: 'uploadedBy', headerName: 'بارگذار', minWidth: 150, valueGetter: (_value, row) => uploaderName(row) },
    { field: 'createdAt', headerName: 'تاریخ بارگذاری', minWidth: 170, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 104,
      width: 104,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<FileAttachment>) => (
        <RowActions
          maxInline={2}
          actions={[
            {
              key: 'download',
              label: 'دانلود',
              icon: <DownloadOutlinedIcon fontSize="small" />,
              disabled: !canView || (download.isPending && downloadingId === row.id),
              loading: download.isPending && downloadingId === row.id,
              visible: hasStoredFile(row),
              onClick: () => downloadAttachment(row),
            },
            {
              key: 'external',
              label: 'باز کردن لینک',
              icon: <OpenInNewOutlinedIcon fontSize="small" />,
              href: getSafeAttachmentExternalUrl(row) ?? undefined,
              target: '_blank',
              rel: 'noopener noreferrer',
              visible: !hasStoredFile(row) && Boolean(getSafeAttachmentExternalUrl(row)),
              onClick: () => undefined,
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              disabled: !canManage,
              onClick: () => setDeleting(row),
            },
          ]}
        />
      ),
    },
  ], [canManage, canView, download.isPending, downloadingId, downloadAttachment]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده پیوست‌ها فعال نیست.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title ?? `پیوست‌های ${getAttachmentEntityLabel(entityType)}`}</Typography>
        {canManage && <Button variant="contained" onClick={() => setUploadOpen(true)} disabled={uploadOpen}>{uploadButtonLabel ?? 'بارگذاری پیوست'}</Button>}
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
      {uploadOpen && <AttachmentUploadDialog entityType={entityType} entityId={entityId} open onClose={() => setUploadOpen(false)} uploadDialogTitle={uploadDialogTitle} descriptionLabel={descriptionLabel} />}
      {deleting && <DeleteAttachmentDialog key={deleting.id} attachment={deleting} entityType={entityType} entityId={entityId} open onClose={() => setDeleting(null)} />}
    </Stack>
  );
}
