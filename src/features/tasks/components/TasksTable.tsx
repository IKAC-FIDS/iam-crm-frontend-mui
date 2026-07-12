import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Chip, Link, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { toEndOfDayIso } from '@/shared/utils/jalaliDate';
import { useTasks } from '../hooks/useTasks';
import {
  formatTaskDate,
  getTaskLinkedEntityLabel,
  getTaskPriorityColor,
  getTaskPriorityLabel,
  getTaskStatusColor,
  getTaskStatusLabel,
  taskPriorityOptions,
  taskRowClassName,
  taskStatusOptions,
} from '../utils/taskDisplay';
import type { FindTasksParams, Task, TaskPriority, TaskStatus } from '../types/task.types';
import AssignTaskDialog from './AssignTaskDialog';
import ChangeTaskStatusDialog from './ChangeTaskStatusDialog';
import CompleteTaskDialog from './CompleteTaskDialog';
import DeleteTaskDialog from './DeleteTaskDialog';
import RescheduleTaskDialog from './RescheduleTaskDialog';
import TaskFormDialog from './TaskFormDialog';

function LinkedEntity({ task }: { task: Task }) {
  if (task.opportunity?.id) return <Link component={RouterLink} to={`/opportunities/${task.opportunity.id}`}>{getTaskLinkedEntityLabel(task)}</Link>;
  if (task.company?.id) return <Link component={RouterLink} to={`/companies/${task.company.id}`}>{getTaskLinkedEntityLabel(task)}</Link>;
  return <>{getTaskLinkedEntityLabel(task)}</>;
}

export default function TasksTable({
  fixedParams = {},
  opportunityId,
  compact = false,
}: {
  fixedParams?: FindTasksParams;
  opportunityId?: string;
  compact?: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'task:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canCreate = can(user, 'task:create', ['ADMIN', 'MANAGER', 'REP']);
  const canUpdate = can(user, 'task:update', ['ADMIN', 'MANAGER', 'REP']);
  const canAssign = can(user, 'task:assign', ['ADMIN', 'MANAGER']);
  const canComplete = can(user, 'task:complete', ['ADMIN', 'MANAGER', 'REP']);
  const canDelete = can(user, 'task:delete', ['ADMIN', 'MANAGER']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueFrom, setDueFrom] = useState('');
  const [dueTo, setDueTo] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const owners = useOwnerOptions(canView && !compact);
  const params: FindTasksParams = {
    ...fixedParams,
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search: compact ? undefined : debouncedSearch || undefined,
    status: status || fixedParams.status,
    priority: priority || fixedParams.priority,
    assignedToId: compact ? fixedParams.assignedToId : assignedToId || fixedParams.assignedToId,
    dueFrom: compact ? fixedParams.dueFrom : dueFrom || fixedParams.dueFrom,
    dueTo: compact ? fixedParams.dueTo : toEndOfDayIso(dueTo) || fixedParams.dueTo,
  };
  const query = useTasks(params, canView);
  const [form, setForm] = useState<Task | null | undefined>(undefined);
  const [statusTask, setStatusTask] = useState<Task | null>(null);
  const [assignTask, setAssignTask] = useState<Task | null>(null);
  const [completeTask, setCompleteTask] = useState<Task | null>(null);
  const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const resetPage = () => setPagination((current) => ({ ...current, page: 0 }));

  const columns = useMemo<GridColDef<Task>[]>(() => [
    { field: 'title', headerName: 'عنوان', minWidth: 220, flex: 1 },
    { field: 'status', headerName: 'وضعیت', minWidth: 130, renderCell: ({ row }) => <Chip size="small" color={getTaskStatusColor(row.status)} label={getTaskStatusLabel(row.status)} /> },
    { field: 'priority', headerName: 'اولویت', minWidth: 120, renderCell: ({ row }) => <Chip size="small" variant="outlined" color={getTaskPriorityColor(row.priority)} label={getTaskPriorityLabel(row.priority)} /> },
    { field: 'linked', headerName: 'ارتباط', minWidth: 180, flex: 0.8, renderCell: ({ row }) => <LinkedEntity task={row} /> },
    { field: 'assignedTo', headerName: 'مسئول', minWidth: 150, valueGetter: (_value, row) => row.assignedTo?.fullName || row.assignedTo?.email || '—' },
    { field: 'dueAt', headerName: 'سررسید', minWidth: 160, valueFormatter: formatTaskDate },
    { field: 'reminderAt', headerName: 'یادآوری', minWidth: 160, valueFormatter: formatTaskDate },
    { field: 'completedAt', headerName: 'تکمیل', minWidth: 160, valueFormatter: formatTaskDate },
    { field: 'createdAt', headerName: 'ایجاد', minWidth: 160, valueFormatter: formatTaskDate },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 460,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<Task>) => {
        const closed = row.status === 'DONE' || row.status === 'CANCELLED';
        return (
          <Stack direction="row" spacing={1}>
            <Button size="small" disabled={!canUpdate} onClick={() => setForm(row)}>ویرایش</Button>
            <Button size="small" disabled={!canUpdate} onClick={() => setStatusTask(row)}>وضعیت</Button>
            <Button size="small" disabled={!canAssign} onClick={() => setAssignTask(row)}>ارجاع</Button>
            <Button size="small" disabled={!canComplete || closed} onClick={() => setCompleteTask(row)}>تکمیل</Button>
            <Button size="small" disabled={!canUpdate || closed} onClick={() => setRescheduleTask(row)}>زمان</Button>
            <Button size="small" color="error" disabled={!canDelete} onClick={() => setDeleteTask(row)}>حذف</Button>
          </Stack>
        );
      },
    },
  ], [canAssign, canComplete, canDelete, canUpdate]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده کارها فعال نیست.</Alert>;

  return (
    <Box>
      {!compact && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
            <TextField fullWidth select label="وضعیت" value={status} onChange={(event) => { setStatus(event.target.value as TaskStatus | ''); resetPage(); }}><MenuItem value="">همه</MenuItem>{taskStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
            <TextField fullWidth select label="اولویت" value={priority} onChange={(event) => { setPriority(event.target.value as TaskPriority | ''); resetPage(); }}><MenuItem value="">همه</MenuItem>{taskPriorityOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
            <TextField fullWidth select label="مسئول" value={assignedToId} disabled={owners.isError} onChange={(event) => { setAssignedToId(event.target.value); resetPage(); }}><MenuItem value="">همه</MenuItem>{(owners.data ?? []).map((owner) => <MenuItem key={owner.id} value={owner.id}>{owner.fullName}</MenuItem>)}</TextField>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <JalaliDateField fullWidth label="از سررسید" value={dueFrom} onChange={(next) => { setDueFrom(next ?? ''); resetPage(); }} />
            <JalaliDateField fullWidth label="تا سررسید" value={dueTo} onChange={(next) => { setDueTo(next ?? ''); resetPage(); }} />
          </Stack>
        </Paper>
      )}
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        {canCreate && <Button variant="contained" onClick={() => setForm(null)}>ایجاد کار</Button>}
      </Stack>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت کارها انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={query.data?.data ?? []}
          columns={columns}
          loading={query.isFetching}
          rowCount={query.data?.meta.total ?? 0}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          getRowClassName={taskRowClassName}
          localeText={{ noRowsLabel: 'هنوز کاری ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 360, '& .task-overdue-row': { bgcolor: 'warning.light' } }}
        />
      </Paper>
      {form !== undefined && <TaskFormDialog key={form?.id ?? 'new'} task={form} opportunityId={opportunityId} open onClose={() => setForm(undefined)} />}
      {statusTask && <ChangeTaskStatusDialog task={statusTask} open onClose={() => setStatusTask(null)} />}
      {assignTask && <AssignTaskDialog task={assignTask} open onClose={() => setAssignTask(null)} />}
      {completeTask && <CompleteTaskDialog task={completeTask} open onClose={() => setCompleteTask(null)} />}
      {rescheduleTask && <RescheduleTaskDialog task={rescheduleTask} open onClose={() => setRescheduleTask(null)} />}
      {deleteTask && <DeleteTaskDialog task={deleteTask} open onClose={() => setDeleteTask(null)} />}
    </Box>
  );
}
