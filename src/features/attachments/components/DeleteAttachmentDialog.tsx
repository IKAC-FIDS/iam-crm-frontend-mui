import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useDeleteAttachment } from '../hooks/useAttachments';
import type { AttachmentEntityType, FileAttachment } from '../types/attachment.types';

export default function DeleteAttachmentDialog({
  attachment,
  entityType,
  entityId,
  open,
  onClose,
}: {
  attachment: FileAttachment;
  entityType: AttachmentEntityType;
  entityId: string;
  open: boolean;
  onClose: () => void;
}) {
  const remove = useDeleteAttachment(entityType, entityId);
  const submit = async () => {
    try {
      await remove.mutateAsync(attachment.id);
      toast.success('پیوست حذف شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف پیوست انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !remove.isPending && onClose()}>
      <DialogTitle>حذف پیوست</DialogTitle>
      <DialogContent>آیا از حذف «{attachment.originalFileName}» مطمئن هستید؟</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={remove.isPending}>انصراف</Button>
        <Button color="error" variant="contained" onClick={submit} disabled={remove.isPending}>حذف</Button>
      </DialogActions>
    </Dialog>
  );
}
