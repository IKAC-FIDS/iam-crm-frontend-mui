import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useUploadAttachment } from '../hooks/useAttachments';
import { ALLOWED_ATTACHMENT_MIME_HINT, formatFileSize, MAX_ATTACHMENT_SIZE_BYTES } from '../utils/attachmentDisplay';
import type { AttachmentEntityType } from '../types/attachment.types';

export default function AttachmentUploadDialog({
  entityType,
  entityId,
  open,
  onClose,
  uploadDialogTitle,
  descriptionLabel,
}: {
  entityType: AttachmentEntityType;
  entityId: string;
  open: boolean;
  onClose: () => void;
  uploadDialogTitle?: string;
  descriptionLabel?: string;
}) {
  const upload = useUploadAttachment(entityType, entityId);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const sizeWarning = file && file.size > MAX_ATTACHMENT_SIZE_BYTES;

  const submit = async () => {
    if (!file) return;
    try {
      await upload.mutateAsync({ entityType, entityId, file, description: description.trim() || undefined });
      toast.success('پیوست با موفقیت بارگذاری شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'بارگذاری پیوست انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !upload.isPending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{uploadDialogTitle ?? 'بارگذاری پیوست'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {upload.isError && <Alert severity="error">بارگذاری پیوست با خطا مواجه شد.</Alert>}
          <Button variant="outlined" component="label">
            انتخاب فایل
            <input hidden type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </Button>
          <Typography color={file ? 'text.primary' : 'text.secondary'}>
            {file ? `${file.name} - ${formatFileSize(file.size)}` : 'فایلی انتخاب نشده است.'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            نوع‌های رایج مجاز: {ALLOWED_ATTACHMENT_MIME_HINT}. حداکثر پیشنهادی: {formatFileSize(MAX_ATTACHMENT_SIZE_BYTES)}.
          </Typography>
          {sizeWarning && <Alert severity="warning">حجم فایل از سقف شناخته‌شده بیشتر است؛ backend نتیجه نهایی را تعیین می‌کند.</Alert>}
          <TextField label={descriptionLabel ?? 'توضیحات'} multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={upload.isPending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!file || upload.isPending}>بارگذاری</Button>
      </DialogActions>
    </Dialog>
  );
}
