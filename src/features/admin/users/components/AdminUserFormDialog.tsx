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
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useActiveTeams } from '@/features/teams/hooks/useTeams';
import { getTeamDisplayName } from '@/features/teams/types/team.types';
import { useCreateUser } from '../hooks/useAdminUsers';
import { USER_ROLES, USER_ROLE_LABELS } from '../types/adminUser.types';

const schema = z.object({
  fullName: z.string().trim().min(1, 'نام کامل الزامی است.'),
  email: z.string().trim().email('ایمیل معتبر نیست.'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد.'),
  role: z.enum(USER_ROLES),
  teamId: z.string(),
}).refine((value) => !['MANAGER', 'REP'].includes(value.role) || Boolean(value.teamId), {
  path: ['teamId'],
  message: 'تیم برای این نقش الزامی است.',
});

type FormData = z.infer<typeof schema>;

const noTeamsMessage = 'ابتدا تیم‌ها را از بخش مدیریت تیم‌ها تعریف کنید.';

export default function AdminUserFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mutation = useCreateUser();
  const teamsQuery = useActiveTeams(open);
  const hasTeams = Boolean(teamsQuery.data?.length);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '', role: 'REP', teamId: '' },
  });

  const close = () => {
    if (!mutation.isPending) {
      mutation.reset();
      reset();
      onClose();
    }
  };

  const submit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
        teamId: data.teamId || undefined,
      });
      toast.success('کاربر با موفقیت ایجاد شد.');
      reset();
      onClose();
    } catch {
      toast.error('خطا در ایجاد کاربر.');
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>افزودن کاربر</DialogTitle>
      <DialogContent>
        <Stack component="form" id="create-user-form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
          {mutation.isError && <Alert severity="error">خطا در ایجاد کاربر.</Alert>}
          {teamsQuery.isError && <Alert severity="error">خطا در دریافت تیم‌ها.</Alert>}
          <TextField
            label="نام کامل"
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            {...register('fullName')}
          />
          <TextField
            label="ایمیل"
            type="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            slotProps={{ htmlInput: { dir: 'ltr', className: 'ltr' } }}
            {...register('email')}
          />
          <TextField
            label="رمز عبور"
            type="password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            slotProps={{ htmlInput: { dir: 'ltr', className: 'ltr' } }}
            {...register('password')}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="create-role">نقش</InputLabel>
                <Select {...field} labelId="create-role" label="نقش">
                  {USER_ROLES.map((role) => <MenuItem key={role} value={role}>{USER_ROLE_LABELS[role]}</MenuItem>)}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="teamId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.teamId)} disabled={teamsQuery.isLoading || teamsQuery.isError || !hasTeams}>
                <InputLabel id="create-team">تیم</InputLabel>
                <Select {...field} labelId="create-team" label="تیم">
                  <MenuItem value="">بدون تیم</MenuItem>
                  {(teamsQuery.data ?? []).map((team) => (
                    <MenuItem key={team.id} value={team.id}>{getTeamDisplayName(team)}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.teamId?.message ?? (!hasTeams && !teamsQuery.isLoading ? noTeamsMessage : undefined)}</FormHelperText>
              </FormControl>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={mutation.isPending}>انصراف</Button>
        <Button type="submit" form="create-user-form" variant="contained" disabled={mutation.isPending}>ثبت کاربر</Button>
      </DialogActions>
    </Dialog>
  );
}
