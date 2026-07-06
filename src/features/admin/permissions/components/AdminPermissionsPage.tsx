import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Checkbox, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { USER_ROLES, USER_ROLE_LABELS } from '../../users/types/adminUser.types';
import type { UserRole } from '../../users/types/adminUser.types';
import { useAssignPermission, useBulkAssignPermissions, useBulkRevokePermissions, useCreatePermission, usePermissionMatrix } from '../hooks/useAdminPermissions';

export default function AdminPermissionsPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'permission:manage', ['ADMIN']);
  const matrix = usePermissionMatrix(allowed);
  const assign = useAssignPermission(); const bulkAssign = useBulkAssignPermissions(); const bulkRevoke = useBulkRevokePermissions(); const create = useCreatePermission();
  const [selected, setSelected] = useState<string[]>([]); const [bulkRole, setBulkRole] = useState<UserRole>('REP'); const [newAction, setNewAction] = useState(''); const [description, setDescription] = useState('');
  const pending = assign.isPending || bulkAssign.isPending || bulkRevoke.isPending || create.isPending;

  if (!allowed) return <Alert severity="warning">شما دسترسی مدیریت مجوزها را ندارید.</Alert>;

  const toggle = async (role: UserRole, action: string, assigned: boolean) => {
    try {
      if (assigned) await bulkRevoke.mutateAsync({ role, actions: [action] });
      else await assign.mutateAsync({ role, action });
      toast.success(assigned ? 'مجوز با موفقیت حذف شد.' : 'مجوز با موفقیت تخصیص داده شد.');
    } catch { toast.error('تغییر وضعیت مجوز با خطا مواجه شد.'); }
  };
  const runBulk = async (kind: 'assign' | 'revoke') => {
    try {
      if (kind === 'assign') await bulkAssign.mutateAsync({ role: bulkRole, actions: selected });
      else await bulkRevoke.mutateAsync({ role: bulkRole, actions: selected });
      toast.success(kind === 'assign' ? 'مجوزها به‌صورت گروهی تخصیص داده شدند.' : 'مجوزها به‌صورت گروهی حذف شدند.');
      setSelected([]);
    } catch { toast.error('عملیات گروهی مجوزها با خطا مواجه شد.'); }
  };
  const createPermission = async () => {
    if (!/^[a-z0-9-]+:[a-z0-9-]+$/i.test(newAction.trim())) { toast.error('کلید مجوز باید مانند resource:action باشد.'); return; }
    try { await create.mutateAsync({ action: newAction.trim(), description: description.trim() || undefined }); toast.success('مجوز ایجاد شد.'); setNewAction(''); setDescription(''); }
    catch { toast.error('خطا در ایجاد مجوز.'); }
  };
  const allSelected = Boolean(matrix.data?.length) && selected.length === matrix.data?.length;

  return <Stack spacing={3}>
    <div><Typography variant="h4">مدیریت مجوزها</Typography><Typography color="text.secondary">ماتریس واقعی دسترسی نقش‌ها و مدیریت تخصیص مجوزها.</Typography></div>
    {matrix.isError && <Alert severity="error">خطا در دریافت ماتریس مجوزها.</Alert>}
    <TableContainer component={Paper} sx={{ minHeight: 240 }}><Table size="small"><TableHead><TableRow><TableCell padding="checkbox"><Checkbox checked={allSelected} indeterminate={selected.length > 0 && !allSelected} disabled={!matrix.data?.length} onChange={(_, checked) => setSelected(checked ? (matrix.data ?? []).map((row) => row.action) : [])} /></TableCell><TableCell>مجوز</TableCell><TableCell>توضیح</TableCell>{USER_ROLES.map((role) => <TableCell key={role} align="center">{USER_ROLE_LABELS[role]}</TableCell>)}</TableRow></TableHead><TableBody>
      {matrix.isLoading && <TableRow><TableCell colSpan={7}>در حال دریافت ماتریس مجوزها...</TableCell></TableRow>}
      {!matrix.isLoading && !matrix.isError && !matrix.data?.length && <TableRow><TableCell colSpan={7}>هیچ مجوزی از Backend دریافت نشد.</TableCell></TableRow>}
      {(matrix.data ?? []).map((row) => <TableRow key={row.action} hover><TableCell padding="checkbox"><Checkbox checked={selected.includes(row.action)} onChange={(_, checked) => setSelected((current) => checked ? [...current, row.action] : current.filter((item) => item !== row.action))} /></TableCell><TableCell sx={{ fontFamily: 'monospace' }}>{row.action}</TableCell><TableCell>{row.description || '—'}</TableCell>{USER_ROLES.map((role) => <TableCell key={role} align="center"><Checkbox checked={row.assignments[role]} disabled={pending} onChange={() => toggle(role, row.action, row.assignments[role])} slotProps={{ input: { 'aria-label': `${row.action} ${role}` } }} /></TableCell>)}</TableRow>)}
    </TableBody></Table></TableContainer>
    <Paper sx={{ p: 2 }}><Stack spacing={2}><Typography variant="h6">عملیات گروهی</Typography><FormControl><InputLabel id="bulk-permission-role">نقش</InputLabel><Select labelId="bulk-permission-role" label="نقش" value={bulkRole} onChange={(event) => setBulkRole(event.target.value as UserRole)}>{USER_ROLES.map((role) => <MenuItem key={role} value={role}>{USER_ROLE_LABELS[role]}</MenuItem>)}</Select></FormControl><Typography color="text.secondary">{selected.length.toLocaleString('fa-IR')} مجوز انتخاب شده</Typography><Stack direction="row" spacing={1}><Button variant="contained" onClick={() => runBulk('assign')} disabled={!selected.length || pending}>تخصیص گروهی</Button><Button color="error" onClick={() => runBulk('revoke')} disabled={!selected.length || pending}>حذف گروهی</Button></Stack></Stack></Paper>
    <Paper sx={{ p: 2 }}><Stack spacing={2}><Typography variant="h6">ایجاد مجوز</Typography><TextField label="کلید مجوز" placeholder="resource:action" value={newAction} onChange={(event) => setNewAction(event.target.value)} /><TextField label="توضیح" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} /><Button variant="contained" onClick={createPermission} disabled={!newAction.trim() || pending}>ایجاد مجوز</Button></Stack></Paper>
  </Stack>;
}
