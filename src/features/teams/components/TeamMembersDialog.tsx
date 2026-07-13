import { useMemo, useState } from 'react';
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
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { isUserActive, USER_ROLE_LABELS } from '@/features/admin/users/types/adminUser.types';
import type { AdminUser } from '@/features/admin/users/types/adminUser.types';
import { RowActions } from '@/shared/components/RowActions';
import {
  useAddTeamMember,
  useRemoveTeamMember,
  useTeamMembers,
} from '../hooks/useTeams';
import { getTeamDisplayName, isTeamActive } from '../types/team.types';
import type { Team, TeamMember } from '../types/team.types';

function memberId(member: TeamMember): string {
  return member.userId ?? member.id;
}

function userOptionLabel(user: AdminUser): string {
  const role = USER_ROLE_LABELS[user.role] ?? user.role;
  return `${user.fullName} — ${user.email} — ${role}`;
}

export default function TeamMembersDialog({
  team,
  open,
  onClose,
}: {
  team: Team | null;
  open: boolean;
  onClose: () => void;
}) {
  const teamId = team?.id ?? '';
  const membersQuery = useTeamMembers(teamId, open && Boolean(team));
  const usersQuery = useOwnerOptions(open && Boolean(team));
  const addMember = useAddTeamMember(teamId);
  const removeMember = useRemoveTeamMember(teamId);
  const [selectedUserId, setSelectedUserId] = useState('');
  const memberIds = useMemo(
    () => new Set((membersQuery.data ?? []).map(memberId)),
    [membersQuery.data],
  );
  const userOptions = (usersQuery.data ?? []).filter((user) => isUserActive(user) && !memberIds.has(user.id));

  const columns = useMemo<GridColDef<TeamMember>[]>(() => [
    { field: 'fullName', headerName: 'نام', minWidth: 160, flex: 1 },
    { field: 'email', headerName: 'ایمیل', minWidth: 210, flex: 1 },
    {
      field: 'role',
      headerName: 'نقش',
      minWidth: 140,
      valueFormatter: (value) => USER_ROLE_LABELS[value as keyof typeof USER_ROLE_LABELS] ?? value ?? '—',
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 110,
      renderCell: ({ row }: GridRenderCellParams<TeamMember>) => (
        <Chip size="small" color={isUserActive(row as AdminUser) ? 'success' : 'default'} label={isUserActive(row as AdminUser) ? 'فعال' : 'غیرفعال'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 96,
      width: 96,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<TeamMember>) => (
        <RowActions
          maxInline={1}
          actions={[
            {
              key: 'remove',
              label: 'حذف از تیم',
              icon: <PersonRemoveOutlinedIcon fontSize="small" />,
              color: 'error',
              disabled: removeMember.isPending,
              onClick: async () => {
                try {
                  await removeMember.mutateAsync(memberId(row));
                  toast.success('عضو از تیم حذف شد.');
                } catch {
                  toast.error('خطا در حذف عضو از تیم.');
                }
              },
            },
          ]}
        />
      ),
    },
  ], [removeMember]);

  const addSelectedMember = async () => {
    if (!selectedUserId || memberIds.has(selectedUserId)) return;
    try {
      await addMember.mutateAsync(selectedUserId);
      setSelectedUserId('');
      toast.success('عضو به تیم اضافه شد.');
    } catch {
      toast.error('خطا در افزودن عضو به تیم.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>مدیریت اعضای تیم</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {team && (
            <Typography color="text.secondary">
              {getTeamDisplayName(team)} {isTeamActive(team) ? '' : '— غیرفعال'}
            </Typography>
          )}
          {(membersQuery.isError || usersQuery.isError) && (
            <Alert severity="error">
              خطا در دریافت اعضا یا کاربران قابل انتخاب. این بخش به پشتیبانی backend از مدیریت اعضای تیم وابسته است.
            </Alert>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <FormControl fullWidth disabled={usersQuery.isLoading || usersQuery.isError || !userOptions.length}>
              <InputLabel id="team-member-user-label">کاربر</InputLabel>
              <Select
                labelId="team-member-user-label"
                label="کاربر"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
              >
                {userOptions.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {userOptionLabel(user)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={addSelectedMember}
              disabled={!selectedUserId || addMember.isPending}
              sx={{ minWidth: 140 }}
            >
              افزودن عضو
            </Button>
          </Stack>
          {!usersQuery.isLoading && !userOptions.length && (
            <Alert severity="info">کاربر فعال جدیدی برای افزودن به این تیم وجود ندارد.</Alert>
          )}
          <DataGrid
            autoHeight
            rows={membersQuery.data ?? []}
            columns={columns}
            loading={membersQuery.isLoading}
            getRowId={memberId}
            hideFooter
            localeText={{ noRowsLabel: 'هنوز عضوی برای این تیم ثبت نشده است.' }}
            sx={{ border: 0, minHeight: 320 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={addMember.isPending || removeMember.isPending}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}
