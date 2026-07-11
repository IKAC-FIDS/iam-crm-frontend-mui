import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateCommercialDocument, useUpdateCommercialDocument } from '../hooks/useCommercialDocuments';
import { commercialDocumentStatusOptions, commercialDocumentTypeOptions } from '../utils/commercialDocumentDisplay';
import type { CommercialDocument, CommercialDocumentStatus, CommercialDocumentType, CreateCommercialDocumentPayload } from '../types/commercialDocument.types';

const dateValue = (value?: string | null) => value ? value.slice(0, 10) : '';
const isoDate = (value: string) => value ? new Date(value).toISOString() : undefined;

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
  const [type, setType] = useState<CommercialDocumentType>(document?.type ?? 'PROPOSAL');
  const [status, setStatus] = useState<CommercialDocumentStatus>(document?.status ?? 'DRAFT');
  const [number, setNumber] = useState(document?.number ?? '');
  const [version, setVersion] = useState(String(document?.version ?? 1));
  const [title, setTitle] = useState(document?.title ?? '');
  const [description, setDescription] = useState(document?.description ?? '');
  const [amount, setAmount] = useState(String(document?.amount ?? ''));
  const [currency, setCurrency] = useState(document?.currency ?? 'IRR');
  const [validUntil, setValidUntil] = useState(dateValue(document?.validUntil));
  const [issuedAt, setIssuedAt] = useState(dateValue(document?.issuedAt));
  const [fileUrl, setFileUrl] = useState(document?.fileUrl ?? '');
  const [externalRef, setExternalRef] = useState(document?.externalRef ?? '');
  const [notes, setNotes] = useState(document?.notes ?? '');
  const pending = create.isPending || update.isPending;

  const payload = (): CreateCommercialDocumentPayload => ({
    type,
    status,
    number: number.trim() || undefined,
    version: Number(version) || 1,
    title: title.trim(),
    description: description.trim() || undefined,
    amount: amount.trim() || undefined,
    currency: currency.trim() || 'IRR',
    validUntil: isoDate(validUntil),
    issuedAt: isoDate(issuedAt),
    fileUrl: fileUrl.trim() || undefined,
    externalRef: externalRef.trim() || undefined,
    notes: notes.trim() || undefined,
  });

  const submit = async () => {
    try {
      if (document) await update.mutateAsync({ id: document.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(document ? 'سند تجاری بروزرسانی شد.' : 'سند تجاری ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره سند تجاری انجام نشد.'));
    }
  };

  const valid = Boolean(title.trim()) && Number.isFinite(Number(version)) && Number(version) >= 1;

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{document ? 'ویرایش سند تجاری' : 'افزودن سند تجاری'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات سند تجاری با خطا مواجه شد.</Alert>}
          <FormControl fullWidth><InputLabel>نوع سند</InputLabel><TextField select label="نوع سند" value={type} onChange={(event) => setType(event.target.value as CommercialDocumentType)}>{commercialDocumentTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField></FormControl>
          <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as CommercialDocumentStatus)}>{commercialDocumentStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
          <TextField label="شماره" value={number} onChange={(event) => setNumber(event.target.value)} />
          <TextField required label="نسخه" type="number" value={version} onChange={(event) => setVersion(event.target.value)} />
          <TextField required label="عنوان" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          <TextField label="مبلغ" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <TextField label="ارز" value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          <TextField label="اعتبار تا" type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="تاریخ صدور" type="date" value={issuedAt} onChange={(event) => setIssuedAt(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="لینک فایل" value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} />
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
