import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useMarkPaymentPaid } from '../hooks/usePayments';
import { paymentMethodOptions } from '../utils/paymentDisplay';
import type { OpportunityPayment, PaymentMethod } from '../types/payment.types';

export default function MarkPaymentPaidDialog({ opportunityId, companyId, payment, open, onClose }: { opportunityId: string; companyId?: string; payment: OpportunityPayment; open: boolean; onClose: () => void }) {
  const mutation = useMarkPaymentPaid(opportunityId, companyId);
  const [paidAt, setPaidAt] = useState(payment.paidAt ?? new Date().toISOString());
  const [method, setMethod] = useState<PaymentMethod | ''>(payment.method ?? '');
  const [referenceNumber, setReferenceNumber] = useState(payment.referenceNumber ?? '');
  const [notes, setNotes] = useState(payment.notes ?? '');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: payment.id, payload: { paidAt: paidAt || undefined, method: method || undefined, referenceNumber: referenceNumber.trim() || undefined, notes: notes.trim() || undefined } });
      toast.success('پرداخت به عنوان پرداخت‌شده ثبت شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ثبت پرداخت انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs">
      <DialogTitle>ثبت پرداخت</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <JalaliDateField label="تاریخ پرداخت" value={paidAt} onChange={(next) => setPaidAt(next ?? '')} />
          <TextField select label="روش پرداخت" value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod | '')}><MenuItem value="">نامشخص</MenuItem>{paymentMethodOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
          <TextField label="شماره پیگیری" value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} />
          <TextField label="یادداشت" multiline minRows={2} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={mutation.isPending}>ثبت پرداخت</Button>
      </DialogActions>
    </Dialog>
  );
}
