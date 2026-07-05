import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useCreateUser } from '../hooks/useAdminUsers';
import { USER_ROLES, USER_ROLE_LABELS } from '../types/adminUser.types';

const schema = z.object({ fullName: z.string().trim().min(1, 'نام کامل الزامی است.'), email: z.string().trim().email('ایمیل معتبر نیست.'), password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد.'), role: z.enum(USER_ROLES), team: z.string() }).refine((v) => !['MANAGER', 'REP'].includes(v.role) || Boolean(v.team.trim()), { path: ['team'], message: 'تیم برای این نقش الزامی است.' });
type FormData = z.infer<typeof schema>;
export default function AdminUserFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mutation = useCreateUser();
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { fullName: '', email: '', password: '', role: 'REP', team: '' } });
  const close = () => { if (!mutation.isPending) { mutation.reset(); reset(); onClose(); } };
  const submit = async (data: FormData) => { try { await mutation.mutateAsync({ ...data, fullName: data.fullName.trim(), email: data.email.trim(), team: data.team.trim() || undefined }); toast.success('کاربر با موفقیت ایجاد شد.'); reset(); onClose(); } catch { toast.error('خطا در ایجاد کاربر.'); } };
  return <Dialog open={open} onClose={close} fullWidth maxWidth="sm"><DialogTitle>افزودن کاربر</DialogTitle><DialogContent><Stack component="form" id="create-user-form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>{mutation.isError && <Alert severity="error">خطا در ایجاد کاربر.</Alert>}<TextField label="نام کامل" error={Boolean(errors.fullName)} helperText={errors.fullName?.message} {...register('fullName')} /><TextField label="ایمیل" type="email" error={Boolean(errors.email)} helperText={errors.email?.message} {...register('email')} /><TextField label="رمز عبور" type="password" error={Boolean(errors.password)} helperText={errors.password?.message} {...register('password')} /><Controller name="role" control={control} render={({ field }) => <FormControl><InputLabel id="create-role">نقش</InputLabel><Select {...field} labelId="create-role" label="نقش">{USER_ROLES.map((role) => <MenuItem key={role} value={role}>{USER_ROLE_LABELS[role]}</MenuItem>)}</Select></FormControl>} /><TextField label="تیم" error={Boolean(errors.team)} helperText={errors.team?.message} {...register('team')} /></Stack></DialogContent><DialogActions><Button onClick={close} disabled={mutation.isPending}>انصراف</Button><Button type="submit" form="create-user-form" variant="contained" disabled={mutation.isPending}>ثبت کاربر</Button></DialogActions></Dialog>;
}
