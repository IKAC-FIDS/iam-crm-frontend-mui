import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useRescheduleTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

export default function RescheduleTaskDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const mutation = useRescheduleTask();
  const [dueAt, setDueAt] = useState(task.dueAt ?? '');
  const [reminderAt, setReminderAt] = useState(task.reminderAt ?? '');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: task.id, payload: { dueAt, reminderAt: reminderAt || undefined } });
      toast.success('زمان‌بندی کار تغییر کرد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'زمان‌بندی کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>زمان‌بندی کار</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><JalaliDateField required label="سررسید" includeTime value={dueAt} onChange={(next) => setDueAt(next ?? '')} /><JalaliDateField label="یادآوری" includeTime value={reminderAt} onChange={(next) => setReminderAt(next ?? '')} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!dueAt || mutation.isPending}>ثبت</Button></DialogActions></Dialog>;
}
