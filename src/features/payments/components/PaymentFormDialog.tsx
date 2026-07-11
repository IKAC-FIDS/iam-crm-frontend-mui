import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useCommercialDocuments } from '@/features/commercialDocuments/hooks/useCommercialDocuments';
import { getCommercialDocumentTypeLabel } from '@/features/commercialDocuments/utils/commercialDocumentDisplay';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreatePayment, useUpdatePayment } from '../hooks/usePayments';
import { paymentMethodOptions } from '../utils/paymentDisplay';
import type { CreateOpportunityPaymentPayload, OpportunityPayment, PaymentMethod } from '../types/payment.types';

const dateValue = (value?: string | null) => value ? value.slice(0, 10) : '';
const isoDate = (value: string) => value ? new Date(value).toISOString() : undefined;

export default function PaymentFormDialog({
  opportunityId,
  companyId,
  payment,
  open,
  onClose,
}: {
  opportunityId: string;
  companyId?: string;
  payment: OpportunityPayment | null;
  open: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const canViewDocuments = can(user, 'commercial-document:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const documents = useCommercialDocuments(opportunityId, { page: 1, limit: 100 }, open && canViewDocuments);
  const create = useCreatePayment(opportunityId, companyId);
  const update = useUpdatePayment(opportunityId, companyId);
  const [commercialDocumentId, setCommercialDocumentId] = useState(payment?.commercialDocumentId ?? '');
  const [amount, setAmount] = useState(String(payment?.amount ?? ''));
  const [currency, setCurrency] = useState(payment?.currency ?? 'IRR');
  const [dueDate, setDueDate] = useState(dateValue(payment?.dueDate));
  const [method, setMethod] = useState<PaymentMethod | ''>(payment?.method ?? '');
  const [referenceNumber, setReferenceNumber] = useState(payment?.referenceNumber ?? '');
  const [description, setDescription] = useState(payment?.description ?? '');
  const [notes, setNotes] = useState(payment?.notes ?? '');
  const pending = create.isPending || update.isPending;

  const documentLabel = (id: string) => {
    const item = documents.data?.data.find((doc) => doc.id === id);
    if (!item) return id;
    return `${getCommercialDocumentTypeLabel(item.type)} ${item.number ? item.number : ''} - ${item.title}`.trim();
  };

  const payload = (): CreateOpportunityPaymentPayload => ({
    commercialDocumentId: commercialDocumentId || undefined,
    amount: amount.trim(),
    currency: currency.trim() || 'IRR',
    dueDate: isoDate(dueDate),
    method: method || undefined,
    referenceNumber: referenceNumber.trim() || undefined,
    description: description.trim() || undefined,
    notes: notes.trim() || undefined,
  });

  const submit = async () => {
    try {
      if (payment) await update.mutateAsync({ id: payment.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(payment ? 'پرداخت بروزرسانی شد.' : 'پرداخت ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره پرداخت انجام نشد.'));
    }
  };

  const valid = Boolean(amount.trim()) && Number(amount) > 0;

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{payment ? 'ویرایش پرداخت' : 'افزودن پرداخت'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات پرداخت با خطا مواجه شد.</Alert>}
          {!canViewDocuments && <Alert severity="info">برای انتخاب سند مرتبط، دسترسی مشاهده اسناد تجاری لازم است.</Alert>}
          {documents.isError && <Alert severity="warning">دریافت اسناد تجاری انجام نشد؛ انتخاب سند مرتبط فعلا در دسترس نیست.</Alert>}
          <TextField select label="سند تجاری مرتبط" value={commercialDocumentId} disabled={!canViewDocuments || documents.isError} onChange={(event) => setCommercialDocumentId(event.target.value)}>
            <MenuItem value="">بدون سند مرتبط</MenuItem>
            {(documents.data?.data ?? []).map((item) => <MenuItem key={item.id} value={item.id}>{documentLabel(item.id)}</MenuItem>)}
          </TextField>
          <TextField required label="مبلغ" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <TextField label="ارز" value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          <TextField label="تاریخ سررسید" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField select label="روش پرداخت" value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod | '')}><MenuItem value="">نامشخص</MenuItem>{paymentMethodOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
          <TextField label="شماره پیگیری" value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} />
          <TextField label="شرح" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
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
