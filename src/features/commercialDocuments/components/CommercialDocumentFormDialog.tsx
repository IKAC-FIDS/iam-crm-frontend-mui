import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { formatFileSize, MAX_ATTACHMENT_SIZE_BYTES } from '@/features/attachments/utils/attachmentDisplay';
import { useCreateCommercialDocument, useUpdateCommercialDocument } from '../hooks/useCommercialDocuments';
import { commercialDocumentStatusOptions, commercialDocumentTypeOptions, safeExternalUrl } from '../utils/commercialDocumentDisplay';
import type {
  CommercialDocument,
  CommercialDocumentStatus,
  CommercialDocumentType,
  CreateCommercialDocumentPayload,
} from '../types/commercialDocument.types';

const ACCEPTED_DOCUMENT_TYPES = '.pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx';
const acceptedExtensions = new Set(ACCEPTED_DOCUMENT_TYPES.split(','));
const invalidCommercialDocumentFallback = 'اطلاعات سند یا فایل انتخاب‌شده معتبر نیست.';

function isFileSizeAllowed(file: File | null): boolean {
  return !file || file.size <= MAX_ATTACHMENT_SIZE_BYTES;
}

function isAcceptedFile(file: File): boolean {
  const extension = file.name.includes('.') ? `.${file.name.split('.').pop()?.toLowerCase()}` : '';
  return acceptedExtensions.has(extension);
}

function getSubmitErrorMessage(error: unknown, fallback: string): string {
  const message = getApiErrorMessage(error, '');
  const isGenericAxiosMessage = axios.isAxiosError(error) && message === error.message;
  return message && !isGenericAxiosMessage ? message : fallback;
}

export default function CommercialDocumentFormDialog({
  opportunityId,
  companyId,
  document,
  open,
  onClose,
}: {
  opportunityId: string;
  companyId?: string;
  document: CommercialDocument | null;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateCommercialDocument(opportunityId, companyId);
  const update = useUpdateCommercialDocument(opportunityId, companyId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [type, setType] = useState<CommercialDocumentType>(document?.type ?? 'PROPOSAL');
  const [status, setStatus] = useState<CommercialDocumentStatus>(document?.status ?? 'DRAFT');
  const [number, setNumber] = useState(document?.number ?? '');
  const [version, setVersion] = useState(String(document?.version ?? 1));
  const [title, setTitle] = useState(document?.title ?? '');
  const [description, setDescription] = useState(document?.description ?? '');
  const [amount, setAmount] = useState(String(document?.amount ?? ''));
  const [currency, setCurrency] = useState(document?.currency ?? 'IRR');
  const [validUntil, setValidUntil] = useState(document?.validUntil ?? '');
  const [issuedAt, setIssuedAt] = useState(document?.issuedAt ?? '');
  const [externalUrl, setExternalUrl] = useState(document?.externalUrl ?? document?.fileUrl ?? '');
  const [externalRef, setExternalRef] = useState(document?.externalRef ?? '');
  const [notes, setNotes] = useState(document?.notes ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const pending = create.isPending || update.isPending;

  const clearFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectFile = (nextFile: File | null) => {
    setFileError('');
    if (!nextFile) {
      setFile(null);
      return;
    }
    if (!isAcceptedFile(nextFile)) {
      setFile(null);
      setFileError('فایل انتخاب‌شده معتبر نیست.');
      return;
    }
    if (!isFileSizeAllowed(nextFile)) {
      setFile(null);
      setFileError('حجم فایل بیش از حد مجاز است.');
      return;
    }
    setFile(nextFile);
  };

  const payload = (): CreateCommercialDocumentPayload => ({
    type,
    status,
    number: number.trim() || undefined,
    version: Number(version) || 1,
    title: title.trim(),
    description: description.trim() || undefined,
    amount: amount.trim() || undefined,
    currency: currency.trim() || 'IRR',
    validUntil: validUntil || undefined,
    issuedAt: issuedAt || undefined,
    fileUrl: externalUrl.trim() || undefined,
    file: file ?? undefined,
    externalRef: externalRef.trim() || undefined,
    notes: notes.trim() || undefined,
  });

  const submit = async () => {
    const trimmedExternalUrl = externalUrl.trim();
    if (trimmedExternalUrl && !safeExternalUrl(trimmedExternalUrl)) {
      toast.error('لینک خارجی فایل معتبر نیست.');
      return;
    }
    if (!document && !file && !trimmedExternalUrl) {
      setFileError('برای سند جدید فایل سند را انتخاب کنید یا لینک خارجی معتبر وارد کنید.');
      return;
    }
    if (!isFileSizeAllowed(file)) {
      setFileError('حجم فایل بیش از حد مجاز است.');
      return;
    }

    try {
      if (document) await update.mutateAsync({ id: document.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(document ? 'سند تجاری بروزرسانی شد.' : 'سند تجاری ایجاد شد.');
      onClose();
    } catch (error) {
      const isBadRequest = axios.isAxiosError(error) && error.response?.status === 400;
      const fallback = isBadRequest
        ? invalidCommercialDocumentFallback
        : file
          ? 'خطا در بارگذاری فایل سند'
          : 'ذخیره سند تجاری انجام نشد.';
      toast.error(getSubmitErrorMessage(error, fallback));
    }
  };

  const valid = Boolean(title.trim()) && Number.isFinite(Number(version)) && Number(version) >= 1 && !fileError;

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{document ? 'ویرایش سند تجاری' : 'افزودن سند تجاری'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && (
            <Alert severity="error">{file ? 'خطا در بارگذاری فایل سند' : 'عملیات سند تجاری با خطا مواجه شد.'}</Alert>
          )}
          <FormControl fullWidth><InputLabel>نوع سند</InputLabel><TextField select label="نوع سند" value={type} onChange={(event) => setType(event.target.value as CommercialDocumentType)}>{commercialDocumentTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField></FormControl>
          <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as CommercialDocumentStatus)}>{commercialDocumentStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
          <TextField label="شماره" value={number} onChange={(event) => setNumber(event.target.value)} />
          <TextField required label="نسخه" type="number" value={version} onChange={(event) => setVersion(event.target.value)} />
          <TextField required label="عنوان" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          <TextField label="مبلغ" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <TextField label="ارز" value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          <JalaliDateField label="اعتبار تا" value={validUntil} onChange={(next) => setValidUntil(next ?? '')} />
          <JalaliDateField label="تاریخ صدور" value={issuedAt} onChange={(next) => setIssuedAt(next ?? '')} />
          <Stack spacing={1}>
            <Typography variant="subtitle2">فایل سند</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
              <Button variant="outlined" component="label" disabled={pending}>
                انتخاب فایل
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES}
                  onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
                />
              </Button>
              <Typography color={file ? 'text.primary' : 'text.secondary'} sx={{ flex: 1, overflowWrap: 'anywhere' }}>
                {file ? `${file.name} - ${formatFileSize(file.size)}` : 'فایلی انتخاب نشده است.'}
              </Typography>
              {file && (
                <Tooltip title="حذف فایل انتخاب‌شده">
                  <IconButton aria-label="حذف فایل انتخاب‌شده" onClick={clearFile} disabled={pending}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              فرمت‌های مجاز: PDF، تصویر، Word و Excel. حداکثر حجم: {formatFileSize(MAX_ATTACHMENT_SIZE_BYTES)}.
            </Typography>
            {fileError && <Alert severity="warning">{fileError}</Alert>}
          </Stack>
          <TextField label="لینک خارجی فایل، اختیاری" value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} />
          <TextField label="شناسه خارجی" value={externalRef} onChange={(event) => setExternalRef(event.target.value)} />
          <TextField label="یادداشت" multiline minRows={2} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
