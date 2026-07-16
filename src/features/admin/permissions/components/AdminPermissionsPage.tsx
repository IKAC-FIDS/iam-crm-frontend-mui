import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, MenuItem, Paper, Stack, Switch, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { can } from '@/features/auth/utils/permissions';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { USER_ROLES, USER_ROLE_LABELS } from '../../users/types/adminUser.types';
import type { UserRole } from '../../users/types/adminUser.types';
import {
  useCreatePermission, useCreateRole, useDeletePermission, useDeleteRole, usePermissions,
  useRolePermissions, useRoles, useUpdatePermission, useUpdateRole, useUpdateRolePermissions,
} from '../hooks/useAdminPermissions';
import type { ManagedPermission, ManagedRole } from '../types/adminPermission.types';

function PermissionDialog({ item, onClose }: { item?: ManagedPermission; onClose: () => void }) {
  const [action, setAction] = useState(item?.action ?? '');
  const [name, setName] = useState(item?.name ?? '');
  const [group, setGroup] = useState(item?.group ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [attempted, setAttempted] = useState(false);
  const create = useCreatePermission();
  const update = useUpdatePermission(item?.id ?? '');
  const pending = create.isPending || update.isPending;
  const actionValid = /^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(action.trim());
  const submit = async () => {
    setAttempted(true); if (!actionValid) return;
    const payload = { action: action.trim(), name: name.trim() || undefined, group: group.trim() || undefined, description: description.trim() || undefined, isActive };
    try { if (item) await update.mutateAsync(payload); else await create.mutateAsync(payload); toast.success(item ? 'مجوز بروزرسانی شد.' : 'مجوز ایجاد شد.'); onClose(); }
    catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره مجوز انجام نشد.')); }
  };
  return <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="sm"><DialogTitle>{item ? 'ویرایش مجوز' : 'ایجاد مجوز'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
    {(create.isError || update.isError) && <Alert severity="error">ذخیره مجوز با خطا مواجه شد.</Alert>}
    <TextField required label="کد مجوز" placeholder="module:action" value={action} disabled={Boolean(item?.isSystem)} onChange={(event) => setAction(event.target.value)} error={attempted && !actionValid} helperText={attempted && !actionValid ? 'کد مجوز باید مانند module:action باشد.' : item?.isSystem ? 'کد مجوز سیستمی قابل تغییر نیست.' : undefined} slotProps={{ htmlInput: { dir: 'ltr' } }} />
    <TextField label="نام نمایشی" value={name} onChange={(event) => setName(event.target.value)} />
    <TextField label="گروه" value={group} onChange={(event) => setGroup(event.target.value)} />
    <TextField label="توضیحات" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
    <FormControlLabel label="فعال" control={<Switch checked={isActive} onChange={(_, checked) => setIsActive(checked)} />} />
  </Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button></DialogActions></Dialog>;
}

function RoleDialog({ item, onClose }: { item?: ManagedRole; onClose: () => void }) {
  const [code, setCode] = useState(item?.code ?? ''); const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? ''); const [baseRole, setBaseRole] = useState<UserRole>(item?.baseRole ?? 'REP');
  const [isActive, setIsActive] = useState(item?.isActive ?? true); const [attempted, setAttempted] = useState(false);
  const create = useCreateRole(); const update = useUpdateRole(item?.id ?? ''); const pending = create.isPending || update.isPending;
  const normalizedCode = code.trim().toUpperCase().replace(/[\s-]+/g, '_'); const codeValid = /^[A-Z][A-Z0-9_]*$/.test(normalizedCode);
  const submit = async () => { setAttempted(true); if (!codeValid || !name.trim()) return;
    try { if (item) await update.mutateAsync({ name: name.trim(), description: description.trim() || undefined, baseRole, isActive });
      else await create.mutateAsync({ code: normalizedCode, name: name.trim(), description: description.trim() || undefined, baseRole, isActive });
      toast.success(item ? 'نقش بروزرسانی شد.' : 'نقش ایجاد شد.'); onClose(); }
    catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره نقش انجام نشد.')); } };
  return <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="sm"><DialogTitle>{item ? 'ویرایش نقش' : 'ایجاد نقش'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
    {(create.isError || update.isError) && <Alert severity="error">ذخیره نقش با خطا مواجه شد.</Alert>}
    <TextField required label="کد نقش" value={code} disabled={Boolean(item)} onChange={(event) => setCode(event.target.value)} error={attempted && !codeValid} helperText={attempted && !codeValid ? 'کد نقش باید با حرف شروع شود و فقط حروف بزرگ، عدد و زیرخط داشته باشد.' : item ? 'کد نقش پس از ایجاد قابل تغییر نیست.' : undefined} slotProps={{ htmlInput: { dir: 'ltr' } }} />
    <TextField required label="نام نقش" value={name} onChange={(event) => setName(event.target.value)} error={attempted && !name.trim()} helperText={attempted && !name.trim() ? 'نام نقش الزامی است.' : undefined} />
    <TextField select label="نقش پایه" value={baseRole} disabled={Boolean(item?.isSystem)} onChange={(event) => setBaseRole(event.target.value as UserRole)}>{USER_ROLES.map((role) => <MenuItem key={role} value={role}>{USER_ROLE_LABELS[role]}</MenuItem>)}</TextField>
    <TextField label="توضیحات" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
    <FormControlLabel label="فعال" control={<Switch checked={isActive} disabled={Boolean(item?.isSystem)} onChange={(_, checked) => setIsActive(checked)} />} />
  </Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button></DialogActions></Dialog>;
}

function RolePermissionsDialog({ role, onClose }: { role: ManagedRole; onClose: () => void }) {
  const query = useRolePermissions(role.id); const update = useUpdateRolePermissions(role.id);
  const [selected, setSelected] = useState<string[] | null>(null); const [search, setSearch] = useState('');
  const selectedIds = selected ?? query.data?.assignedPermissionIds ?? [];
  const filtered = useMemo(() => (query.data?.permissions ?? []).filter((permission) => {
    const needle = search.trim().toLocaleLowerCase('fa');
    return !needle || [permission.action, permission.name, permission.group, permission.description].some((value) => value?.toLocaleLowerCase('fa').includes(needle));
  }), [query.data?.permissions, search]);
  const grouped = useMemo(() => Object.entries(filtered.reduce<Record<string, ManagedPermission[]>>((result, permission) => {
    const group = permission.group?.trim() || permission.action.split(':')[0] || 'سایر'; (result[group] ??= []).push(permission); return result;
  }, {})).sort(([a], [b]) => a.localeCompare(b, 'fa')), [filtered]);
  const save = async () => { try { await update.mutateAsync(selectedIds); toast.success('تغییرات با موفقیت ذخیره شد.'); onClose(); }
    catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره مجوزهای نقش انجام نشد.')); } };
  return <Dialog open onClose={() => !update.isPending && onClose()} fullWidth maxWidth="md"><DialogTitle>مدیریت مجوزهای نقش — {role.name}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
    <TextField label="جستجوی مجوز" value={search} onChange={(event) => setSearch(event.target.value)} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button onClick={() => setSelected((query.data?.permissions ?? []).map((permission) => permission.id))}>انتخاب همه</Button><Button onClick={() => setSelected([])}>حذف انتخاب همه</Button><Typography color="text.secondary" sx={{ alignSelf: 'center' }}>مجوزهای فعال برای این نقش: {selectedIds.length.toLocaleString('fa-IR')}</Typography></Stack>
    {query.isLoading && <Typography>در حال بارگذاری مجوزها...</Typography>}{query.isError && <Alert severity="error">خطا در دریافت اطلاعات</Alert>}
    {!query.isLoading && !query.isError && !query.data?.permissions.length && <Typography color="text.secondary">مجوزی ثبت نشده است.</Typography>}
    {grouped.map(([group, permissions]) => <Paper key={group} variant="outlined" sx={{ p: 2 }}><Typography variant="subtitle1" sx={{ mb: 1 }}>{group}</Typography><Stack>{permissions.map((permission) => <FormControlLabel key={permission.id} label={`${permission.name || permission.action} — ${permission.action}`} control={<Checkbox checked={selectedIds.includes(permission.id)} onChange={(_, checked) => setSelected(checked ? [...selectedIds, permission.id] : selectedIds.filter((id) => id !== permission.id))} />} />)}</Stack></Paper>)}
  </Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={update.isPending}>انصراف</Button><Button variant="contained" onClick={save} disabled={query.isLoading || query.isError || update.isPending}>ذخیره تغییرات</Button></DialogActions></Dialog>;
}

export default function AdminPermissionsPage() {
  const user = useAuthStore((state) => state.user); const canViewPermissions = can(user, 'permission:view', ['ADMIN']); const canManagePermissions = can(user, 'permission:manage', ['ADMIN']);
  const canViewRoles = can(user, 'role:view', ['ADMIN']); const canManageRoles = can(user, 'role:manage', ['ADMIN']);
  const tabs = [...(canViewPermissions ? ['permissions' as const] : []), ...(canViewRoles ? ['roles' as const] : [])];
  const [tab, setTab] = useState<'permissions' | 'roles'>(tabs[0] ?? 'permissions'); const permissions = usePermissions(canViewPermissions); const roles = useRoles(canViewRoles);
  const [search, setSearch] = useState(''); const [permissionForm, setPermissionForm] = useState<ManagedPermission | null | undefined>(); const [roleForm, setRoleForm] = useState<ManagedRole | null | undefined>();
  const [assigningRole, setAssigningRole] = useState<ManagedRole>(); const [deletingPermission, setDeletingPermission] = useState<ManagedPermission>(); const [deletingRole, setDeletingRole] = useState<ManagedRole>();
  const deletePermission = useDeletePermission(); const deleteRole = useDeleteRole();
  const filteredPermissions = (permissions.data ?? []).filter((item) => [item.action, item.name, item.group].some((value) => value?.toLocaleLowerCase('fa').includes(search.toLocaleLowerCase('fa'))));
  const filteredRoles = (roles.data ?? []).filter((item) => [item.code, item.name, item.description].some((value) => value?.toLocaleLowerCase('fa').includes(search.toLocaleLowerCase('fa'))));
  const permissionColumns: GridColDef<ManagedPermission>[] = [
    { field: 'action', headerName: 'کد مجوز', minWidth: 190, flex: 1 }, { field: 'name', headerName: 'نام نمایشی', minWidth: 150, flex: 0.8, valueFormatter: (value) => value || '—' },
    { field: 'group', headerName: 'گروه', minWidth: 120, valueFormatter: (value) => value || '—' }, { field: 'isActive', headerName: 'وضعیت', minWidth: 100, renderCell: ({ row }) => <Chip size="small" color={row.isActive ? 'success' : 'default'} label={row.isActive ? 'فعال' : 'غیر فعال'} /> },
    { field: 'isSystem', headerName: 'سیستمی', minWidth: 90, valueFormatter: (value) => value ? 'بله' : 'خیر' }, { field: 'actions', headerName: 'عملیات', width: 104, sortable: false, filterable: false, renderCell: ({ row }: GridRenderCellParams<ManagedPermission>) => <RowActions actions={[{ key: 'edit', label: 'ویرایش مجوز', icon: <EditOutlinedIcon fontSize="small" />, visible: canManagePermissions, onClick: () => setPermissionForm(row) }, { key: 'delete', label: row.isSystem ? 'مجوز سیستمی قابل حذف نیست' : 'حذف مجوز', icon: <DeleteOutlineIcon fontSize="small" />, color: 'error', visible: canManagePermissions, disabled: row.isSystem, onClick: () => setDeletingPermission(row) }]} /> },
  ];
  const roleColumns: GridColDef<ManagedRole>[] = [
    { field: 'code', headerName: 'کد نقش', minWidth: 130 }, { field: 'name', headerName: 'نام نقش', minWidth: 160, flex: 1 }, { field: 'isActive', headerName: 'وضعیت', minWidth: 100, renderCell: ({ row }) => <Chip size="small" color={row.isActive ? 'success' : 'default'} label={row.isActive ? 'فعال' : 'غیر فعال'} /> },
    { field: 'isSystem', headerName: 'نقش سیستمی', minWidth: 110, valueFormatter: (value) => value ? 'بله' : 'خیر' }, { field: 'permissionCount', headerName: 'تعداد مجوزها', minWidth: 110, valueGetter: (_value, row) => row._count?.permissions ?? 0 },
    { field: 'actions', headerName: 'عملیات', width: 144, sortable: false, filterable: false, renderCell: ({ row }: GridRenderCellParams<ManagedRole>) => <RowActions maxInline={3} actions={[{ key: 'permissions', label: 'اختصاص مجوز', icon: <SecurityOutlinedIcon fontSize="small" />, visible: canManageRoles, onClick: () => setAssigningRole(row) }, { key: 'edit', label: 'ویرایش نقش', icon: <EditOutlinedIcon fontSize="small" />, visible: canManageRoles, onClick: () => setRoleForm(row) }, { key: 'delete', label: row.isSystem ? 'نقش سیستمی قابل حذف نیست' : 'حذف نقش', icon: <DeleteOutlineIcon fontSize="small" />, color: 'error', visible: canManageRoles, disabled: row.isSystem || row.code === 'ADMIN', onClick: () => setDeletingRole(row) }]} /> },
  ];
  if (!tabs.length) return <Alert severity="warning">شما دسترسی مدیریت نقش‌ها و مجوزها را ندارید.</Alert>;
  const confirmPermissionDelete = async () => { if (!deletingPermission) return; try { await deletePermission.mutateAsync(deletingPermission.id); toast.success('مجوز حذف شد.'); setDeletingPermission(undefined); } catch (error) { toast.error(getApiErrorMessage(error, 'حذف مجوز انجام نشد.')); } };
  const confirmRoleDelete = async () => { if (!deletingRole) return; try { await deleteRole.mutateAsync(deletingRole.id); toast.success('نقش حذف شد.'); setDeletingRole(undefined); } catch (error) { toast.error(getApiErrorMessage(error, 'حذف نقش انجام نشد.')); } };
  return <Stack spacing={2}><Box><Typography variant="h4">مدیریت نقش‌ها و مجوزها</Typography><Typography color="text.secondary">تعریف نقش‌ها، مجوزها و دسترسی‌های هر نقش.</Typography></Box>
    <Paper><Tabs value={tab} onChange={(_, value) => { setTab(value); setSearch(''); }}>{canViewPermissions && <Tab value="permissions" label="مجوزها" />}{canViewRoles && <Tab value="roles" label="نقش‌ها" />}</Tabs></Paper>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}><TextField size="small" label={tab === 'permissions' ? 'جستجوی مجوز' : 'جستجوی نقش'} value={search} onChange={(event) => setSearch(event.target.value)} sx={{ minWidth: 280 }} />{tab === 'permissions' ? canManagePermissions && <Button variant="contained" onClick={() => setPermissionForm(null)}>ایجاد مجوز</Button> : canManageRoles && <Button variant="contained" onClick={() => setRoleForm(null)}>ایجاد نقش</Button>}</Stack>
    {tab === 'permissions' ? <>{permissions.isError && <Alert severity="error">خطا در دریافت اطلاعات</Alert>}<Paper><DataGrid autoHeight rows={filteredPermissions} columns={permissionColumns} loading={permissions.isLoading} disableRowSelectionOnClick localeText={{ noRowsLabel: permissions.isLoading ? 'در حال بارگذاری مجوزها...' : 'مجوزی ثبت نشده است.' }} sx={{ border: 0, minHeight: 360 }} /></Paper></>
      : <>{roles.isError && <Alert severity="error">خطا در دریافت اطلاعات</Alert>}<Paper><DataGrid autoHeight rows={filteredRoles} columns={roleColumns} loading={roles.isLoading} disableRowSelectionOnClick localeText={{ noRowsLabel: roles.isLoading ? 'در حال بارگذاری نقش‌ها...' : 'نقشی ثبت نشده است.' }} sx={{ border: 0, minHeight: 360 }} /></Paper></>}
    {permissionForm !== undefined && <PermissionDialog item={permissionForm ?? undefined} onClose={() => setPermissionForm(undefined)} />}{roleForm !== undefined && <RoleDialog item={roleForm ?? undefined} onClose={() => setRoleForm(undefined)} />}{assigningRole && <RolePermissionsDialog role={assigningRole} onClose={() => setAssigningRole(undefined)} />}
    <Dialog open={Boolean(deletingPermission)} onClose={() => setDeletingPermission(undefined)}><DialogTitle>حذف مجوز</DialogTitle><DialogContent><Typography>آیا از حذف مجوز «{deletingPermission?.action}» مطمئن هستید؟</Typography></DialogContent><DialogActions><Button onClick={() => setDeletingPermission(undefined)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmPermissionDelete} disabled={deletePermission.isPending}>حذف</Button></DialogActions></Dialog>
    <Dialog open={Boolean(deletingRole)} onClose={() => setDeletingRole(undefined)}><DialogTitle>حذف نقش</DialogTitle><DialogContent><Typography>آیا از حذف نقش «{deletingRole?.name}» مطمئن هستید؟</Typography></DialogContent><DialogActions><Button onClick={() => setDeletingRole(undefined)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmRoleDelete} disabled={deleteRole.isPending}>حذف</Button></DialogActions></Dialog>
  </Stack>;
}
