import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useChangeTaskStatus } from '../hooks/useTasks';
import { taskStatusOptions } from '../utils/taskDisplay';
import type { Task, TaskStatus } from '../types/task.types';

export default function ChangeTaskStatusDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const mutation = useChangeTaskStatus();
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [note, setNote] = useState('');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: task.id, payload: { status, note: note.trim() || undefined } });
      toast.success('وضعیت کار تغییر کرد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'تغییر وضعیت کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>تغییر وضعیت کار</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>{taskStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField><TextField label="یادداشت" multiline minRows={2} value={note} onChange={(event) => setNote(event.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={mutation.isPending}>ثبت</Button></DialogActions></Dialog>;
}
