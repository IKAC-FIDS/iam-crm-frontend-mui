import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useDeleteNotification } from '../hooks/useNotifications';
import type { Notification } from '../types/notification.types';

export default function DeleteNotificationDialog({
  notification,
  open,
  onClose,
}: {
  notification: Notification;
  open: boolean;
  onClose: () => void;
}) {
  const mutation = useDeleteNotification();

  const submit = async () => {
    try {
      await mutation.mutateAsync(notification);
      toast.success('اعلان حذف شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف اعلان انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !mutation.isPending && onClose()}>
      <DialogTitle>حذف اعلان</DialogTitle>
      <DialogContent>آیا از حذف «{notification.title}» مطمئن هستید؟</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button>
        <Button color="error" variant="contained" onClick={submit} disabled={mutation.isPending}>حذف</Button>
      </DialogActions>
    </Dialog>
  );
}
