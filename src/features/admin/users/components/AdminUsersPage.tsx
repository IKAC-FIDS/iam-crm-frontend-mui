import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { can } from '@/features/auth/utils/permissions';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { useActiveTeams } from '@/features/teams/hooks/useTeams';
import { getTeamDisplayName } from '@/features/teams/types/team.types';
import type { Team } from '@/features/teams/types/team.types';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import AdminUserFormDialog from './AdminUserFormDialog';
import EditUserRoleDialog from './EditUserRoleDialog';
import { useActivateUser, useAdminUsers, useDeactivateUser } from '../hooks/useAdminUsers';
import { isUserActive, USER_ROLE_LABELS, USER_ROLES } from '../types/adminUser.types';
import type { AdminUser, UserRole } from '../types/adminUser.types';

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function AdminUsersPage() {
  const current = useAuthStore((state) => state.user);
  const allowed = can(current, 'user:manage', ['ADMIN']);
  const query = useAdminUsers(allowed);
  const teamsQuery = useActiveTeams(allowed);
  const activate = useActivateUser();
  const deactivate = useDeactivateUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [statusUser, setStatusUser] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | 'ALL'>('ALL');
  const [selectedTeamId, setSelectedTeamId] = useState('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');

  const teamById = useMemo(() => new Map((teamsQuery.data ?? []).map((team) => [team.id, team])), [teamsQuery.data]);

  const getUserTeamLabel = useCallback((user: AdminUser): string => {
    if (user.teamId && teamById.has(user.teamId)) return getTeamDisplayName(teamById.get(user.teamId) as Team);
    if (user.teamName) return user.teamCode ? `${user.teamName} — ${user.teamCode}` : user.teamName;
    return user.team ?? '—';
  }, [teamById]);

  const userMatchesTeam = useCallback((user: AdminUser): boolean => {
    if (selectedTeamId === 'ALL') return true;
    if (user.teamId) return user.teamId === selectedTeamId;
    const selectedTeam = teamById.get(selectedTeamId);
    if (!selectedTeam) return false;
    const legacyTeam = (user.teamName ?? user.team ?? '').trim();
    return legacyTeam === selectedTeam.name || legacyTeam === selectedTeam.code;
  }, [selectedTeamId, teamById]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('fa');
    return (query.data ?? []).filter((user) => {
      const matchesSearch = !term || [user.fullName, user.email, getUserTeamLabel(user)]
        .some((value) => value?.toLocaleLowerCase('fa').includes(term));
      const matchesRole = role === 'ALL' || user.role === role;
      const matchesTeam = userMatchesTeam(user);
      const active = isUserActive(user);
      const matchesStatus = status === 'ALL' || (status === 'ACTIVE' ? active : !active);
      return matchesSearch && matchesRole && matchesTeam && matchesStatus;
    });
  }, [getUserTeamLabel, query.data, role, search, status, userMatchesTeam]);

  const columns = useMemo<GridColDef<AdminUser>[]>(() => [
    { field: 'fullName', headerName: 'نام', minWidth: 150, flex: 1 },
    { field: 'email', headerName: 'ایمیل', minWidth: 200, flex: 1 },
    { field: 'role', headerName: 'نقش', minWidth: 130, valueFormatter: (value) => USER_ROLE_LABELS[value as UserRole] ?? value },
    { field: 'team', headerName: 'تیم', minWidth: 150, valueGetter: (_, row) => getUserTeamLabel(row) },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 100,
      renderCell: ({ row }: GridRenderCellParams<AdminUser>) => (
        <Chip size="small" color={isUserActive(row) ? 'success' : 'default'} label={isUserActive(row) ? 'فعال' : 'غیرفعال'} />
      ),
    },
    { field: 'createdAt', headerName: 'تاریخ ایجاد', minWidth: 180, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 112,
      width: 112,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<AdminUser>) => (
        <RowActions
          actions={[
            {
              key: 'role',
              label: 'ویرایش نقش',
              icon: <ManageAccountsOutlinedIcon fontSize="small" />,
              onClick: () => setEditing(row),
            },
            {
              key: 'status',
              label: isUserActive(row) ? 'غیرفعال‌سازی' : 'فعال‌سازی',
              icon: isUserActive(row) ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />,
              color: isUserActive(row) ? 'error' : 'success',
              disabled: row.id === current?.id,
              onClick: () => setStatusUser(row),
            },
          ]}
        />
      ),
    },
  ], [current?.id, getUserTeamLabel]);

  if (!allowed) return <Alert severity="warning">شما دسترسی مدیریت کاربران را ندارید.</Alert>;

  const changeStatus = async () => {
    if (!statusUser) return;
    const active = isUserActive(statusUser);
    try {
      await (active ? deactivate : activate).mutateAsync(statusUser.id);
      toast.success(active ? 'کاربر با موفقیت غیرفعال شد.' : 'کاربر با موفقیت فعال شد.');
      setStatusUser(null);
    } catch {
      toast.error(active ? 'خطا در غیرفعال‌سازی کاربر.' : 'خطا در فعال‌سازی کاربر.');
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4">مدیریت کاربران</Typography>
          <Typography color="text.secondary">ایجاد، فعال‌سازی، غیرفعال‌سازی و مدیریت نقش کاربران سیستم.</Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button onClick={() => query.refetch()}>بروزرسانی</Button>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>افزودن کاربر</Button>
        </Stack>
      </Stack>
      {query.isError && <Alert severity="error">خطا در دریافت کاربران.</Alert>}
      {teamsQuery.isError && <Alert severity="warning">خطا در دریافت تیم‌ها؛ فیلتر تیم و انتخاب تیم کاربران در دسترس نیست.</Alert>}
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField fullWidth label="جستجو" placeholder="نام، ایمیل یا تیم" value={search} onChange={(event) => setSearch(event.target.value)} />
          <FormControl fullWidth>
            <InputLabel id="admin-user-role-filter">نقش</InputLabel>
            <Select labelId="admin-user-role-filter" label="نقش" value={role} onChange={(event) => setRole(event.target.value as UserRole | 'ALL')}>
              <MenuItem value="ALL">همه نقش‌ها</MenuItem>
              {USER_ROLES.map((item) => <MenuItem key={item} value={item}>{USER_ROLE_LABELS[item]}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={teamsQuery.isLoading || teamsQuery.isError}>
            <InputLabel id="admin-user-team-filter">تیم</InputLabel>
            <Select labelId="admin-user-team-filter" label="تیم" value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)}>
              <MenuItem value="ALL">همه تیم‌ها</MenuItem>
              {(teamsQuery.data ?? []).map((item) => <MenuItem key={item.id} value={item.id}>{getTeamDisplayName(item)}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="admin-user-status-filter">وضعیت</InputLabel>
            <Select labelId="admin-user-status-filter" label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
              <MenuItem value="ALL">همه وضعیت‌ها</MenuItem>
              <MenuItem value="ACTIVE">فعال</MenuItem>
              <MenuItem value="INACTIVE">غیرفعال</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <DataGrid
          autoHeight
          rows={filteredUsers}
          columns={columns}
          loading={query.isLoading}
          hideFooter
          localeText={{ noRowsLabel: 'کاربری مطابق فیلترها یافت نشد.' }}
          sx={{ border: 0, minHeight: 350 }}
        />
      </Paper>
      <AdminUserFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditUserRoleDialog key={editing?.id ?? 'no-user'} user={editing} open={Boolean(editing)} onClose={() => setEditing(null)} />
      <Dialog open={Boolean(statusUser)} onClose={() => setStatusUser(null)}>
        <DialogTitle>{statusUser && isUserActive(statusUser) ? 'غیرفعال‌سازی کاربر' : 'فعال‌سازی کاربر'}</DialogTitle>
        <DialogContent>آیا از تغییر وضعیت این کاربر مطمئن هستید؟</DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUser(null)}>انصراف</Button>
          <Button variant="contained" onClick={changeStatus} disabled={activate.isPending || deactivate.isPending}>تأیید</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
