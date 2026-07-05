import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { usePeople } from '@/features/people/hooks/usePeople';
import ActivityForm from './ActivityForm';
import { useCreateActivity } from '../hooks/useActivities';
import type { CreateActivityPayload } from '../types/activity.types';

interface ActivityFormDialogProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody {
  message?: string;
}

export default function ActivityFormDialog({
  companyId,
  open,
  onClose,
}: ActivityFormDialogProps) {
  const createActivity = useCreateActivity(companyId);
  const peopleQuery = usePeople({ companyId, page: 1, limit: 100 });

  const handleClose = () => {
    if (createActivity.isPending) return;
    createActivity.reset();
    onClose();
  };

  const handleSubmit = async (values: CreateActivityPayload) => {
    try {
      await createActivity.mutateAsync(values);
      toast.success('فعالیت با موفقیت ثبت شد.');
      createActivity.reset();
      onClose();
    } catch {
      toast.error('خطا در ثبت فعالیت.');
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(createActivity.error)
    ? createActivity.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>ثبت فعالیت</DialogTitle>
      <DialogContent>
        <ActivityForm
          companyId={companyId}
          people={peopleQuery.data?.data}
          isPeopleLoading={peopleQuery.isLoading}
          isSubmitting={createActivity.isPending}
          errorMessage={createActivity.isError
            ? apiMessage || 'خطا در ثبت فعالیت.'
            : peopleQuery.isError
              ? 'خطا در دریافت افراد شرکت؛ ثبت فعالیت بدون شخص مرتبط همچنان ممکن است.'
              : undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
