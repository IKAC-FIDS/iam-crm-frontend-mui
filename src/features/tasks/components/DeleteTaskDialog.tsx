import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useDeleteTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

export default function DeleteTaskDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const mutation = useDeleteTask();
  const submit = async () => {
    try {
      await mutation.mutateAsync(task);
      toast.success('کار حذف شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()}><DialogTitle>حذف کار</DialogTitle><DialogContent>آیا از حذف «{task.title}» مطمئن هستید؟</DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={submit} disabled={mutation.isPending}>حذف</Button></DialogActions></Dialog>;
}
