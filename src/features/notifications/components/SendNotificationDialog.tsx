import { useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateNotification } from '../hooks/useNotifications';
import {
  notificationEntityTypeOptions,
  notificationPriorityOptions,
  notificationTypeOptions,
} from '../utils/notificationDisplay';
import type {
  CreateNotificationPayload,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
} from '../types/notification.types';

export default function SendNotificationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const users = useOwnerOptions(open);
  const create = useCreateNotification();
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [type, setType] = useState<NotificationType>('SYSTEM');
  const [priority, setPriority] = useState<NotificationPriority>('NORMAL');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [entityType, setEntityType] = useState<NotificationEntityType | ''>('');
  const [entityId, setEntityId] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  const selectedNames = recipientIds
    .map((id) => users.data?.find((user) => user.id === id)?.fullName)
    .filter(Boolean)
    .join('، ');

  const handleRecipients = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setRecipientIds(typeof value === 'string' ? value.split(',') : value);
  };

  const payload = (): CreateNotificationPayload => ({
    recipientIds,
    type,
    priority,
    title: title.trim(),
    body: body.trim() || undefined,
    entityType: entityType || undefined,
    entityId: entityId.trim() || undefined,
    actionUrl: actionUrl.trim() || undefined,
  });

  const submit = async () => {
    try {
      await create.mutateAsync(payload());
      toast.success('اعلان ارسال شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ارسال اعلان انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !create.isPending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>ارسال اعلان</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {users.isError && (
            <Alert severity="warning">
              دریافت فهرست کاربران انجام نشد؛ ارسال دستی اعلان فعلا در دسترس نیست.
            </Alert>
          )}
          <FormControl fullWidth disabled={users.isError || users.isLoading}>
            <InputLabel id="notification-recipients-label">گیرندگان</InputLabel>
            <Select
              labelId="notification-recipients-label"
              multiple
              label="گیرندگان"
              value={recipientIds}
              onChange={handleRecipients}
              renderValue={() => selectedNames || 'انتخاب گیرنده'}
            >
              {(users.data ?? []).map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={recipientIds.includes(user.id)} />
                  <ListItemText primary={user.fullName} secondary={user.email} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField select label="نوع" value={type} onChange={(event) => setType(event.target.value as NotificationType)}>
            {notificationTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField select label="اولویت" value={priority} onChange={(event) => setPriority(event.target.value as NotificationPriority)}>
            {notificationPriorityOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField required label="عنوان" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="متن" multiline minRows={3} value={body} onChange={(event) => setBody(event.target.value)} />
          <TextField select label="نوع موجودیت" value={entityType} onChange={(event) => setEntityType(event.target.value as NotificationEntityType | '')}>
            <MenuItem value="">بدون ارتباط</MenuItem>
            {notificationEntityTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField label="شناسه موجودیت" value={entityId} onChange={(event) => setEntityId(event.target.value)} />
          <TextField label="مسیر اقدام" value={actionUrl} onChange={(event) => setActionUrl(event.target.value)} helperText="مسیرهای داخلی مثل /tasks یا /opportunities/ID امن هستند." />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={create.isPending}>انصراف</Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={users.isError || !recipientIds.length || !title.trim() || create.isPending}
        >
          ارسال
        </Button>
      </DialogActions>
    </Dialog>
  );
}
