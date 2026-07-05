import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useUpdateUserRole } from '../hooks/useAdminUsers';
import { USER_ROLES, USER_ROLE_LABELS } from '../types/adminUser.types';
import type { AdminUser, UserRole } from '../types/adminUser.types';
export default function EditUserRoleDialog({ user, open, onClose }: { user: AdminUser | null; open: boolean; onClose: () => void }) {
  const mutation = useUpdateUserRole(user?.id ?? ''); const [role, setRole] = useState<UserRole>(user?.role ?? 'REP'); const [team, setTeam] = useState(user?.team ?? '');
  const submit = async () => { if (['MANAGER', 'REP'].includes(role) && !team.trim()) { toast.error('تیم برای این نقش الزامی است.'); return; } try { await mutation.mutateAsync({ role, team: team.trim() || undefined }); toast.success('نقش کاربر با موفقیت بروزرسانی شد.'); onClose(); } catch { toast.error('خطا در بروزرسانی نقش کاربر.'); } };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"><DialogTitle>ویرایش نقش</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><FormControl><InputLabel id="edit-role">نقش</InputLabel><Select labelId="edit-role" label="نقش" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>{USER_ROLES.map((item) => <MenuItem key={item} value={item}>{USER_ROLE_LABELS[item]}</MenuItem>)}</Select></FormControl><TextField label="تیم" value={team} onChange={(e) => setTeam(e.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={mutation.isPending}>ذخیره تغییرات</Button></DialogActions></Dialog>;
}
