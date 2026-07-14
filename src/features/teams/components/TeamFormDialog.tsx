import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { isUserActive, USER_ROLE_LABELS } from '@/features/admin/users/types/adminUser.types';
import type { AdminUser } from '@/features/admin/users/types/adminUser.types';
import { isForbiddenError } from '@/lib/apiResponse';
import { useCreateTeam, useUpdateTeam } from '../hooks/useTeams';
import type { Team } from '../types/team.types';

const schema = z.object({
  name: z.string().trim().min(1, 'نام تیم الزامی است.'),
  code: z.string().trim().optional(),
  managerId: z.string().optional(),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;
const forbiddenMessage = 'شما مجوز ایجاد یا ویرایش تیم را ندارید.';

function userLabel(user: AdminUser): string {
  return `${user.fullName} — ${USER_ROLE_LABELS[user.role] ?? user.role}`;
}

function isManagerCandidate(user: AdminUser): boolean {
  return isUserActive(user) && (user.role === 'ADMIN' || user.role === 'MANAGER');
}

export default function TeamFormDialog({
  team,
  open,
  onClose,
}: {
  team: Team | null;
  open: boolean;
  onClose: () => void;
}) {
  const managersQuery = useOwnerOptions(open);
  const create = useCreateTeam();
  const update = useUpdateTeam();
  const pending = create.isPending || update.isPending;
  const managerOptions = (managersQuery.data ?? []).filter(isManagerCandidate);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', code: '', managerId: '', description: '', isActive: true },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: team?.name ?? '',
      code: team?.code ?? '',
      managerId: team?.managerId ?? team?.manager?.id ?? '',
      description: team?.description ?? '',
      isActive: team ? team.isActive ?? team.active ?? team.status !== 'INACTIVE' : true,
    });
  }, [open, reset, team]);

  const close = () => {
    if (!pending) onClose();
  };

  const submit = async (data: FormData) => {
    const payload = {
      name: data.name.trim(),
      code: data.code?.trim() || undefined,
      managerId: data.managerId || undefined,
      description: data.description?.trim() || undefined,
      isActive: data.isActive,
    };
    try {
      if (team) {
        await update.mutateAsync({ id: team.id, payload });
        toast.success('تیم با موفقیت بروزرسانی شد.');
      } else {
        await create.mutateAsync(payload);
        toast.success('تیم با موفقیت ایجاد شد.');
      }
      onClose();
    } catch (error) {
      toast.error(isForbiddenError(error) ? forbiddenMessage : team ? 'خطا در بروزرسانی تیم.' : 'خطا در ایجاد تیم.');
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>{team ? 'ویرایش تیم' : 'افزودن تیم'}</DialogTitle>
      <DialogContent>
        <Stack component="form" id="team-form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && (
            <Alert severity={isForbiddenError(create.error ?? update.error) ? 'warning' : 'error'}>
              {isForbiddenError(create.error ?? update.error) ? forbiddenMessage : 'عملیات تیم با خطا مواجه شد.'}
            </Alert>
          )}
          <TextField
            label="نام تیم"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField label="کد تیم" error={Boolean(errors.code)} helperText={errors.code?.message} {...register('code')} />
          <Controller
            name="managerId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth disabled={managersQuery.isLoading || managersQuery.isError}>
                <InputLabel id="team-manager-label">مدیر تیم</InputLabel>
                <Select {...field} labelId="team-manager-label" label="مدیر تیم">
                  <MenuItem value="">بدون مدیر</MenuItem>
                  {managerOptions.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {userLabel(user)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {managersQuery.isError && <Alert severity="warning">خطا در دریافت کاربران قابل انتخاب برای مدیریت تیم.</Alert>}
          <TextField label="توضیحات" multiline minRows={3} {...register('description')} />
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="فعال"
                control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={pending}>انصراف</Button>
        <Button type="submit" form="team-form" variant="contained" disabled={pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
