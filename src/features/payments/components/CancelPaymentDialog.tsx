import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCancelPayment } from '../hooks/usePayments';
import type { OpportunityPayment } from '../types/payment.types';

export default function CancelPaymentDialog({ opportunityId, companyId, payment, open, onClose }: { opportunityId: string; companyId?: string; payment: OpportunityPayment; open: boolean; onClose: () => void }) {
  const mutation = useCancelPayment(opportunityId, companyId);
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: payment.id });
      toast.success('پرداخت لغو شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'لغو پرداخت انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !mutation.isPending && onClose()}>
      <DialogTitle>لغو پرداخت</DialogTitle>
      <DialogContent>آیا از لغو این پرداخت مطمئن هستید؟</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button>
        <Button color="warning" variant="contained" onClick={submit} disabled={mutation.isPending}>لغو پرداخت</Button>
      </DialogActions>
    </Dialog>
  );
}
