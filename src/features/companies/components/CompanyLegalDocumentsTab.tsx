import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { getApiErrorMessage, isForbiddenError } from '@/lib/apiResponse';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { RowActions } from '@/shared/components/RowActions';
import { useDownloadAttachment } from '@/features/attachments/hooks/useAttachments';
import { formatFileSize, getAttachmentDownloadErrorMessage } from '@/features/attachments/utils/attachmentDisplay';
import {
  useCompanyLegalDocuments,
  useDeleteCompanyLegalDocument,
  useUploadCompanyLegalDocument,
} from '../hooks/useCompanies';
import {
  COMPANY_LEGAL_DOCUMENT_TYPE_OPTIONS,
  type CompanyLegalDocument,
  type CompanyLegalDocumentType,
} from '../types/company.types';
import { formatDate, formatDateTime, getLegalDocumentTypeLabel } from '../utils/companyDisplay';

const acceptedLegalDocumentTypes = '.pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx';

function uploadErrorMessage(error: unknown): string {
  if (isForbiddenError(error)) return 'شما مجوز بارگذاری سند حقوقی شرکت را ندارید.';
  return getApiErrorMessage(error, 'خطا در بارگذاری سند');
}

function legalDocumentFileName(document: CompanyLegalDocument): string {
  return (
    document.attachment?.originalFileName ||
    document.attachment?.originalName ||
    document.attachment?.fileName ||
    document.fileAttachment?.originalFileName ||
    document.fileAttachment?.originalName ||
    document.fileAttachment?.fileName ||
    document.title
  );
}

function legalDocumentAttachmentId(document: CompanyLegalDocument): string | undefined {
  return document.attachmentId || document.fileAttachmentId || document.attachment?.id || document.fileAttachment?.id || undefined;
}

function LegalDocumentUploadDialog({
  companyId,
  open,
  onClose,
}: {
  companyId: string;
  open: boolean;
  onClose: () => void;
}) {
  const upload = useUploadCompanyLegalDocument(companyId);
  const [type, setType] = useState<CompanyLegalDocumentType>('OFFICIAL_GAZETTE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const valid = Boolean(title.trim()) && Boolean(file);

  const resetAndClose = () => {
    setType('OFFICIAL_GAZETTE');
    setTitle('');
    setDescription('');
    setDocumentDate('');
    setFile(null);
    onClose();
  };

  const submit = async () => {
    if (!file || !title.trim()) return;
    try {
      const document = await upload.mutateAsync({
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        documentDate: documentDate || undefined,
        file,
      });
      if (document) {
        toast.success('سند با موفقیت بارگذاری شد');
      } else {
        toast.warning('بارگذاری انجام شد، اما رکورد سند در پاسخ API نبود؛ فهرست اسناد دوباره دریافت شد.');
      }
      resetAndClose();
    } catch (error) {
      toast.error(uploadErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onClose={() => !upload.isPending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>بارگذاری سند حقوقی</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {upload.isError && <Alert severity="error">{uploadErrorMessage(upload.error)}</Alert>}
          <FormControl fullWidth>
            <InputLabel id="company-legal-document-type-label">نوع سند</InputLabel>
            <Select
              labelId="company-legal-document-type-label"
              label="نوع سند"
              value={type}
              onChange={(event) => setType(event.target.value as CompanyLegalDocumentType)}
            >
              {COMPANY_LEGAL_DOCUMENT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField required label="عنوان سند" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          <JalaliDateField label="تاریخ سند" value={documentDate} onChange={(value) => setDocumentDate(value ?? '')} />
          <Button variant="outlined" component="label" disabled={upload.isPending}>
            انتخاب فایل
            <input hidden type="file" accept={acceptedLegalDocumentTypes} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </Button>
          <Typography color={file ? 'text.primary' : 'text.secondary'} sx={{ overflowWrap: 'anywhere' }}>
            {file ? `${file.name} - ${formatFileSize(file.size)}` : 'فایلی انتخاب نشده است.'}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={upload.isPending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || upload.isPending}>بارگذاری</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CompanyLegalDocumentsTab({ companyId }: { companyId: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'company:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'company:update', ['ADMIN', 'MANAGER', 'REP']);
  const query = useCompanyLegalDocuments(companyId, canView);
  const remove = useDeleteCompanyLegalDocument(companyId);
  const download = useDownloadAttachment();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<CompanyLegalDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const columns = useMemo<GridColDef<CompanyLegalDocument>[]>(() => [
    { field: 'title', headerName: 'عنوان سند', minWidth: 180, flex: 1 },
    { field: 'type', headerName: 'نوع سند', minWidth: 150, valueFormatter: getLegalDocumentTypeLabel },
    { field: 'fileName', headerName: 'فایل', minWidth: 180, flex: 0.8, valueGetter: (_value, row) => legalDocumentFileName(row) },
    { field: 'documentDate', headerName: 'تاریخ سند', minWidth: 140, valueFormatter: formatDate },
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
      renderCell: ({ row }: GridRenderCellParams<CompanyLegalDocument>) => {
        const attachmentId = legalDocumentAttachmentId(row);
        return (
          <RowActions
            maxInline={2}
            actions={[
              {
                key: 'download',
                label: 'دانلود',
                icon: <DownloadOutlinedIcon fontSize="small" />,
                visible: Boolean(attachmentId),
                loading: download.isPending && downloadingId === row.id,
                disabled: !attachmentId || (download.isPending && downloadingId === row.id),
                onClick: async () => {
                  if (!attachmentId) return;
                  setDownloadingId(row.id);
                  try {
                    await download.mutateAsync({ id: attachmentId, originalFileName: legalDocumentFileName(row) });
                    toast.success('دانلود سند آغاز شد.');
                  } catch (error) {
                    toast.error(getAttachmentDownloadErrorMessage(error));
                  } finally {
                    setDownloadingId(null);
                  }
                },
              },
              {
                key: 'delete',
                label: 'حذف',
                icon: <DeleteOutlineIcon fontSize="small" />,
                color: 'error',
                visible: canManage,
                disabled: remove.isPending,
                onClick: () => setDeleting(row),
              },
            ]}
          />
        );
      },
    },
  ], [canManage, download, downloadingId, remove.isPending]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده اسناد حقوقی شرکت فعال نیست.</Alert>;

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('سند حقوقی شرکت حذف شد.');
      setDeleting(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف سند حقوقی شرکت انجام نشد.'));
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Typography variant="h6">اسناد حقوقی شرکت</Typography>
        {canManage && <Button variant="contained" onClick={() => setUploadOpen(true)}>بارگذاری سند حقوقی</Button>}
      </Stack>
      {query.isError && <Alert severity="error">دریافت اسناد حقوقی شرکت انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={query.data ?? []}
          columns={columns}
          loading={query.isFetching}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز سند حقوقی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 320 }}
        />
      </Paper>
      {uploadOpen && <LegalDocumentUploadDialog companyId={companyId} open onClose={() => setUploadOpen(false)} />}
      {deleting && (
        <Dialog open onClose={() => !remove.isPending && setDeleting(null)} fullWidth maxWidth="xs">
          <DialogTitle>حذف سند حقوقی</DialogTitle>
          <DialogContent>
            <Typography>
              آیا از حذف سند «{deleting.title}» مطمئن هستید؟
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button>
            <Tooltip title="این عملیات قابل بازگشت نیست">
              <span>
                <Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button>
              </span>
            </Tooltip>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
