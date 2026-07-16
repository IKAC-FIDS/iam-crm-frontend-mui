import { useState } from 'react';
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
} from '@mui/material';
import { useActiveTeams } from '@/features/teams/hooks/useTeams';
import { getTeamDisplayName } from '@/features/teams/types/team.types';
import { useRoles } from '@/features/admin/permissions/hooks/useAdminPermissions';
import { getApiErrorMessage } from '@/lib/apiResponse';
import type { Team } from '@/features/teams/types/team.types';
import { useUpdateUserRole } from '../hooks/useAdminUsers';
import type { AdminUser } from '../types/adminUser.types';

const noTeamsMessage = 'ابتدا تیم‌ها را از بخش مدیریت تیم‌ها تعریف کنید.';

function resolveUserTeamId(user: AdminUser | null, teams: Team[]): string {
  if (!user) return '';
  if (user.teamId) return user.teamId;
  const legacyName = (user.teamName ?? user.team ?? '').trim();
  if (!legacyName) return '';
  return teams.find((team) => team.name === legacyName || team.code === legacyName)?.id ?? '';
}

export default function EditUserRoleDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}) {
  const mutation = useUpdateUserRole(user?.id ?? '');
  const teamsQuery = useActiveTeams(open);
  const rolesQuery = useRoles(open);
  const [roleId, setRoleId] = useState(user?.roleId ?? user?.assignedRole?.id ?? '');
  const [teamOverrideId, setTeamOverrideId] = useState<string | null>(null);
  const hasTeams = Boolean(teamsQuery.data?.length);
  const selectedTeamId = teamOverrideId ?? resolveUserTeamId(user, teamsQuery.data ?? []);

  const submit = async () => {
    const selectedRole = rolesQuery.data?.find((role) => role.id === roleId);
    if (selectedRole && ['MANAGER', 'REP'].includes(selectedRole.baseRole) && !selectedTeamId) {
      toast.error('تیم برای این نقش الزامی است.');
      return;
    }
    try {
      await mutation.mutateAsync({ roleId, teamId: selectedTeamId || undefined });
      toast.success('نقش کاربر با موفقیت بروزرسانی شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'خطا در بروزرسانی نقش کاربر.'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>ویرایش نقش</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {teamsQuery.isError && <Alert severity="error">خطا در دریافت تیم‌ها.</Alert>}
          {rolesQuery.isError && <Alert severity="error">خطا در دریافت نقش‌ها.</Alert>}
          <FormControl>
            <InputLabel id="edit-role">نقش</InputLabel>
            <Select labelId="edit-role" label="نقش" value={roleId} disabled={rolesQuery.isLoading || rolesQuery.isError} onChange={(event) => setRoleId(event.target.value)}>
              {(rolesQuery.data ?? []).filter((role) => role.isActive).map((role) => <MenuItem key={role.id} value={role.id}>{role.name} — {role.code}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={teamsQuery.isLoading || teamsQuery.isError || !hasTeams}>
            <InputLabel id="edit-team">تیم</InputLabel>
            <Select labelId="edit-team" label="تیم" value={selectedTeamId} onChange={(event) => setTeamOverrideId(event.target.value)}>
              <MenuItem value="">بدون تیم</MenuItem>
              {(teamsQuery.data ?? []).map((team) => (
                <MenuItem key={team.id} value={team.id}>{getTeamDisplayName(team)}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{!hasTeams && !teamsQuery.isLoading ? noTeamsMessage : undefined}</FormHelperText>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!roleId || mutation.isPending || rolesQuery.isLoading || rolesQuery.isError}>ذخیره تغییرات</Button>
      </DialogActions>
    </Dialog>
  );
}
