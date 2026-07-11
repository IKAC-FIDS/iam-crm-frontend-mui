import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useAssignTask } from '../hooks/useTasks';
import type { Task } from '../types/task.types';

export default function AssignTaskDialog({ task, open, onClose }: { task: Task; open: boolean; onClose: () => void }) {
  const owners = useOwnerOptions(open);
  const mutation = useAssignTask();
  const [assignedToId, setAssignedToId] = useState(task.assignedToId ?? '');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: task.id, payload: { assignedToId } });
      toast.success('کار ارجاع شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ارجاع کار انجام نشد.'));
    }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>ارجاع کار</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{owners.isError && <Alert severity="error">دریافت فهرست کاربران انجام نشد.</Alert>}<TextField select label="مسئول" value={assignedToId} disabled={owners.isError} onChange={(event) => setAssignedToId(event.target.value)}>{(owners.data ?? []).map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName} - {user.email}</MenuItem>)}</TextField></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!assignedToId || mutation.isPending}>ارجاع</Button></DialogActions></Dialog>;
}
