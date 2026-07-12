import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { taskPriorityOptions, taskStatusOptions } from '../utils/taskDisplay';
import type { CreateTaskPayload, Task, TaskPriority, TaskStatus } from '../types/task.types';

export default function TaskFormDialog({
  task,
  opportunityId,
  companyId,
  open,
  onClose,
}: {
  task?: Task | null;
  opportunityId?: string;
  companyId?: string;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateTask();
  const update = useUpdateTask();
  const owners = useOwnerOptions(open);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [priority, setPriority] = useState<TaskPriority>((task?.priority as TaskPriority | undefined) ?? 'MEDIUM');
  const [dueAt, setDueAt] = useState(task?.dueAt ?? '');
  const [reminderAt, setReminderAt] = useState(task?.reminderAt ?? '');
  const [assignedToId, setAssignedToId] = useState(task?.assignedToId ?? '');
  const [manualOpportunityId, setManualOpportunityId] = useState(task?.opportunityId ?? opportunityId ?? '');
  const [manualCompanyId, setManualCompanyId] = useState(task?.companyId ?? companyId ?? '');
  const pending = create.isPending || update.isPending;

  const payload = (): CreateTaskPayload => ({
    title: title.trim(),
    description: description.trim() || undefined,
    status: task ? status : undefined,
    priority,
    dueAt: dueAt || undefined,
    reminderAt: reminderAt || undefined,
    assignedToId: assignedToId || undefined,
    opportunityId: manualOpportunityId || undefined,
    companyId: manualCompanyId || undefined,
  });

  const submit = async () => {
    try {
      if (task) await update.mutateAsync({ id: task.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(task ? 'کار بروزرسانی شد.' : 'کار ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره کار انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{task ? 'ویرایش کار' : 'ایجاد کار'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات کار با خطا مواجه شد.</Alert>}
          <TextField required label="عنوان" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          {task && <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>{taskStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>}
          <TextField select label="اولویت" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{taskPriorityOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
          <JalaliDateField label="سررسید" includeTime value={dueAt} onChange={(next) => setDueAt(next ?? '')} />
          <JalaliDateField label="یادآوری" includeTime value={reminderAt} onChange={(next) => setReminderAt(next ?? '')} />
          {owners.isError && <Alert severity="warning">دریافت فهرست کاربران انجام نشد؛ انتخاب مسئول در دسترس نیست.</Alert>}
          <TextField select label="مسئول" value={assignedToId} disabled={owners.isError} onChange={(event) => setAssignedToId(event.target.value)}>
            <MenuItem value="">پیش‌فرض سیستم</MenuItem>
            {(owners.data ?? []).map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName} - {user.email}</MenuItem>)}
          </TextField>
          <TextField label="شناسه فرصت" value={manualOpportunityId} disabled={Boolean(opportunityId)} onChange={(event) => setManualOpportunityId(event.target.value)} helperText={opportunityId ? 'این کار به فرصت جاری متصل می‌شود.' : 'در صورت نیاز شناسه فرصت را وارد کنید.'} />
          <TextField label="شناسه شرکت" value={manualCompanyId} disabled={Boolean(companyId)} onChange={(event) => setManualCompanyId(event.target.value)} helperText={companyId ? 'این کار به شرکت جاری متصل می‌شود.' : 'در صورت نیاز شناسه شرکت را وارد کنید.'} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!title.trim() || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
