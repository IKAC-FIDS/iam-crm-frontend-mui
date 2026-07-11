import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useRescheduleTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

function dateTimeLocal(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
}

export default function RescheduleTaskDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const mutation = useRescheduleTask();
  const [dueAt, setDueAt] = useState(dateTimeLocal(task.dueAt));
  const [reminderAt, setReminderAt] = useState(dateTimeLocal(task.reminderAt));
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: task.id, payload: { dueAt: new Date(dueAt).toISOString(), reminderAt: reminderAt ? new Date(reminderAt).toISOString() : undefined } });
      toast.success('زمان‌بندی کار تغییر کرد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'زمان‌بندی کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>زمان‌بندی کار</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField required label="سررسید" type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} /><TextField label="یادآوری" type="datetime-local" value={reminderAt} onChange={(event) => setReminderAt(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!dueAt || mutation.isPending}>ثبت</Button></DialogActions></Dialog>;
}
