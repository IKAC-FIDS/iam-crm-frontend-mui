import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { usePeople } from '@/features/people/hooks/usePeople';
import CallCardForm from './CallCardForm';
import { useUpsertCallCard } from '../hooks/useCallCards';
import type { CallCard, UpsertCallCardPayload } from '../types/callCard.types';

interface Props {
  companyId: string;
  mode: 'create' | 'edit';
  initialValues?: Partial<CallCard>;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody { message?: string }

export default function CallCardFormDialog({ companyId, mode, initialValues, open, onClose }: Props) {
  const mutation = useUpsertCallCard(companyId);
  const peopleQuery = usePeople({ companyId, page: 1, limit: 100 });

  const close = () => {
    if (mutation.isPending) return;
    mutation.reset();
    onClose();
  };

  const submit = async (values: UpsertCallCardPayload) => {
    try {
      await mutation.mutateAsync(values);
      toast.success('کال کارت با موفقیت ذخیره شد.');
      onClose();
    } catch {
      toast.error('خطا در ذخیره کال کارت.');
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error)
    ? mutation.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>{mode === 'create' ? 'ایجاد کال کارت' : 'ویرایش کال کارت'}</DialogTitle>
      <DialogContent>
        <CallCardForm
          mode={mode}
          initialValues={initialValues}
          people={peopleQuery.data?.data}
          isPeopleLoading={peopleQuery.isLoading}
          isSubmitting={mutation.isPending}
          errorMessage={mutation.isError
            ? apiMessage || 'خطا در ذخیره کال کارت.'
            : peopleQuery.isError
              ? 'خطا در دریافت افراد شرکت؛ ذخیره بدون انتخاب مخاطب همچنان ممکن است.'
              : undefined}
          onSubmit={submit}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}
