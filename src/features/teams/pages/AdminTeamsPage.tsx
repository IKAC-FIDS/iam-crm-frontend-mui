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
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { can } from '@/features/auth/utils/permissions';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { PageContainer, PageHeader, PageSection } from '@/shared/components/ui';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import TeamFormDialog from '../components/TeamFormDialog';
import TeamMembersDialog from '../components/TeamMembersDialog';
import {
  useActivateTeam,
  useDeactivateTeam,
  useTeams,
} from '../hooks/useTeams';
import {
  getTeamDisplayName,
  getTeamManagerName,
  isTeamActive,
} from '../types/team.types';
import type { Team } from '../types/team.types';

export default function AdminTeamsPage() {
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'team:manage', ['ADMIN']);
  const teamsQuery = useTeams({ includeInactive: true }, allowed);
  const activate = useActivateTeam();
  const deactivate = useDeactivateTeam();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [membersTeam, setMembersTeam] = useState<Team | null>(null);
  const [statusTeam, setStatusTeam] = useState<Team | null>(null);

  const filteredTeams = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('fa');
    return (teamsQuery.data ?? []).filter((team) => {
      if (!term) return true;
      return [team.name, team.code, getTeamManagerName(team)]
        .some((value) => value?.toLocaleLowerCase('fa').includes(term));
    });
  }, [search, teamsQuery.data]);

  const columns = useMemo<GridColDef<Team>[]>(() => [
    { field: 'name', headerName: 'نام تیم', minWidth: 170, flex: 1 },
    { field: 'code', headerName: 'کد', minWidth: 130, valueFormatter: (value) => value || '—' },
    {
      field: 'manager',
      headerName: 'مدیر',
      minWidth: 170,
      flex: 1,
      valueGetter: (_, row) => getTeamManagerName(row),
    },
    {
      field: 'memberCount',
      headerName: 'تعداد اعضا',
      minWidth: 120,
      valueFormatter: (value) => value ?? '—',
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 110,
      renderCell: ({ row }: GridRenderCellParams<Team>) => (
        <Chip size="small" color={isTeamActive(row) ? 'success' : 'default'} label={isTeamActive(row) ? 'فعال' : 'غیرفعال'} />
      ),
    },
    { field: 'createdAt', headerName: 'تاریخ ایجاد', minWidth: 170, valueFormatter: formatDateTime },
    { field: 'updatedAt', headerName: 'آخرین بروزرسانی', minWidth: 170, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 136,
      width: 136,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<Team>) => (
        <RowActions
          actions={[
            {
              key: 'edit',
              label: 'ویرایش تیم',
              icon: <EditOutlinedIcon fontSize="small" />,
              onClick: () => {
                setEditing(row);
                setFormOpen(true);
              },
            },
            {
              key: 'members',
              label: 'مدیریت اعضا',
              icon: <GroupsOutlinedIcon fontSize="small" />,
              onClick: () => setMembersTeam(row),
            },
            {
              key: 'status',
              label: isTeamActive(row) ? 'غیرفعال‌سازی' : 'فعال‌سازی',
              icon: isTeamActive(row) ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />,
              color: isTeamActive(row) ? 'error' : 'success',
              menuOnly: true,
              onClick: () => setStatusTeam(row),
            },
          ]}
        />
      ),
    },
  ], []);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const changeStatus = async () => {
    if (!statusTeam) return;
    const active = isTeamActive(statusTeam);
    try {
      await (active ? deactivate : activate).mutateAsync(statusTeam);
      toast.success(active ? 'تیم غیرفعال شد.' : 'تیم فعال شد.');
      setStatusTeam(null);
    } catch {
      toast.error(active ? 'خطا در غیرفعال‌سازی تیم.' : 'خطا در فعال‌سازی تیم.');
    }
  };

  if (!allowed) {
    return <Alert severity="warning">شما دسترسی مدیریت تیم‌ها را ندارید.</Alert>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="مدیریت تیم‌ها"
        description="تعریف تیم‌های فروش، تعیین مدیر تیم و مدیریت اعضای هر تیم."
        actions={
          <>
            <Button onClick={() => teamsQuery.refetch()}>بروزرسانی</Button>
            <Button variant="contained" onClick={() => setFormOpen(true)}>افزودن تیم</Button>
          </>
        }
      />
      {teamsQuery.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت تیم‌ها.</Alert>}
      <PageSection>
        <Stack spacing={2}>
          <TextField
            label="جستجو"
            placeholder="نام، کد یا مدیر تیم"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ maxWidth: { md: 420 } }}
          />
          <DataGrid
            autoHeight
            rows={filteredTeams}
            columns={columns}
            loading={teamsQuery.isLoading}
            hideFooter
            localeText={{ noRowsLabel: 'تیمی مطابق فیلترها یافت نشد.' }}
            sx={{ border: 0, minHeight: 360 }}
          />
        </Stack>
      </PageSection>
      <TeamFormDialog team={editing} open={formOpen} onClose={closeForm} />
      <TeamMembersDialog team={membersTeam} open={Boolean(membersTeam)} onClose={() => setMembersTeam(null)} />
      <Dialog open={Boolean(statusTeam)} onClose={() => setStatusTeam(null)}>
        <DialogTitle>{statusTeam && isTeamActive(statusTeam) ? 'غیرفعال‌سازی تیم' : 'فعال‌سازی تیم'}</DialogTitle>
        <DialogContent>
          آیا از تغییر وضعیت «{statusTeam ? getTeamDisplayName(statusTeam) : ''}» مطمئن هستید؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusTeam(null)} disabled={activate.isPending || deactivate.isPending}>انصراف</Button>
          <Button variant="contained" onClick={changeStatus} disabled={activate.isPending || deactivate.isPending}>تأیید</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
