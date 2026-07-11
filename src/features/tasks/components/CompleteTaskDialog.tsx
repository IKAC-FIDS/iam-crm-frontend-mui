import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCompleteTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

export default function CompleteTaskDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const mutation = useCompleteTask();
  const [completionNote, setCompletionNote] = useState('');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: task.id, payload: { completionNote: completionNote.trim() || undefined } });
      toast.success('کار تکمیل شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'تکمیل کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>تکمیل کار</DialogTitle><DialogContent sx={{ pt: 2 }}><TextField fullWidth label="یادداشت تکمیل" multiline minRows={2} value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} /></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={mutation.isPending}>تکمیل</Button></DialogActions></Dialog>;
}
