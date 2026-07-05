import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useAdminUsers } from '@/features/admin/users/hooks/useAdminUsers';
import { isUserActive } from '@/features/admin/users/types/adminUser.types';
import { useChangeCompanyOwner } from '../hooks/useCompanies';

export default function ChangeCompanyOwnerDialog({ companyId, currentOwnerId, open, onOpenChange }: { companyId: string; currentOwnerId?: string | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const users = useAdminUsers(open); const mutation = useChangeCompanyOwner(companyId); const [ownerId, setOwnerId] = useState(currentOwnerId ?? '');
  const options = useMemo(() => (users.data ?? []).filter((user) => ['REP', 'MANAGER'].includes(user.role) && isUserActive(user)), [users.data]);
  const submit = async () => { if (!ownerId) return; try { await mutation.mutateAsync({ newOwnerId: ownerId }); toast.success('مالک شرکت با موفقیت تغییر کرد.'); onOpenChange(false); } catch { toast.error('خطا در تغییر مالک شرکت.'); } };
  return <Dialog open={open} onClose={() => !mutation.isPending && onOpenChange(false)} fullWidth maxWidth="xs"><DialogTitle>تخصیص مالک</DialogTitle><DialogContent sx={{ pt: '12px !important' }}>{users.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت کاربران قابل تخصیص.</Alert>}{!users.isLoading && !users.isError && !options.length && <Typography color="text.secondary">کاربر فعال با نقش مدیر یا کارشناس فروش یافت نشد.</Typography>}<FormControl fullWidth disabled={users.isLoading || users.isError}><InputLabel id="owner-user-label">مالک جدید</InputLabel><Select labelId="owner-user-label" label="مالک جدید" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>{options.map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName} {user.team ? `— ${user.team}` : ''}</MenuItem>)}</Select></FormControl></DialogContent><DialogActions><Button onClick={() => onOpenChange(false)} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!ownerId || ownerId === currentOwnerId || mutation.isPending}>ثبت مالک</Button></DialogActions></Dialog>;
}
