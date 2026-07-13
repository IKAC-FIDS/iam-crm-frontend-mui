import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Chip, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { RowActions } from '@/shared/components/RowActions';
import {
  useArchiveNotification,
  useMarkNotificationRead,
  useMarkNotificationUnread,
  useNotifications,
  useUnarchiveNotification,
} from '../hooks/useNotifications';
import {
  formatNotificationDate,
  getNotificationEntityTypeLabel,
  getNotificationPriorityColor,
  getNotificationPriorityLabel,
  getNotificationStatusLabel,
  getNotificationTypeLabel,
  isArchived,
  isUnread,
  notificationEntityTypeOptions,
  notificationPriorityOptions,
  notificationTypeOptions,
} from '../utils/notificationDisplay';
import { navigateToNotificationTarget } from '../utils/notificationNavigation';
import type {
  FindNotificationsParams,
  Notification,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
} from '../types/notification.types';
import DeleteNotificationDialog from './DeleteNotificationDialog';

type ArchivedMode = 'active' | 'include' | 'archived';

export default function NotificationsTable({ canManage }: { canManage: boolean }) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'unread' | 'read' | 'all'>('all');
  const [type, setType] = useState<NotificationType | ''>('');
  const [priority, setPriority] = useState<NotificationPriority | ''>('');
  const [entityType, setEntityType] = useState<NotificationEntityType | ''>('');
  const [archivedMode, setArchivedMode] = useState<ArchivedMode>('active');
  const [deleteNotification, setDeleteNotification] = useState<Notification | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const markRead = useMarkNotificationRead();
  const markUnread = useMarkNotificationUnread();
  const archive = useArchiveNotification();
  const unarchive = useUnarchiveNotification();

  const params: FindNotificationsParams = {
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status,
    type: type || undefined,
    priority: priority || undefined,
    entityType: entityType || undefined,
    includeArchived: archivedMode === 'include' ? true : undefined,
    archivedOnly: archivedMode === 'archived' ? true : undefined,
  };
  const query = useNotifications(params);

  const resetPage = () => setPagination((current) => ({ ...current, page: 0 }));

  const runAction = useCallback(async (message: string, fallback: string, action: () => Promise<unknown>) => {
    try {
      await action();
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, fallback));
    }
  }, []);

  const openNotification = useCallback(async (notification: Notification) => {
    try {
      if (canManage && isUnread(notification)) await markRead.mutateAsync(notification);
      const navigated = navigateToNotificationTarget(navigate, notification.actionUrl);
      if (!navigated) toast.info('مسیر امنی برای این اعلان ثبت نشده است.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'باز کردن اعلان انجام نشد.'));
    }
  }, [canManage, markRead, navigate]);

  const columns = useMemo<GridColDef<Notification>[]>(() => [
    {
      field: 'title',
      headerName: 'عنوان',
      minWidth: 240,
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Box component="span" sx={{ fontWeight: isUnread(row) ? 700 : 500 }}>{row.title}</Box>
          {row.body && <Box sx={{ color: 'text.secondary', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.body}</Box>}
        </Box>
      ),
    },
    { field: 'type', headerName: 'نوع', minWidth: 160, renderCell: ({ row }) => getNotificationTypeLabel(row.type) },
    {
      field: 'priority',
      headerName: 'اولویت',
      minWidth: 110,
      renderCell: ({ row }) => (
        <Chip size="small" color={getNotificationPriorityColor(row.priority)} label={getNotificationPriorityLabel(row.priority)} />
      ),
    },
    { field: 'entityType', headerName: 'ارتباط', minWidth: 140, renderCell: ({ row }) => getNotificationEntityTypeLabel(row.entityType) },
    {
      field: 'status',
      headerName: 'وضعیت',
      minWidth: 130,
      renderCell: ({ row }) => (
        <Chip size="small" variant={isUnread(row) ? 'filled' : 'outlined'} label={getNotificationStatusLabel(row)} />
      ),
    },
    { field: 'actor', headerName: 'فرستنده', minWidth: 150, valueGetter: (_value, row) => row.actor?.fullName || row.actor?.email || '—' },
    { field: 'createdAt', headerName: 'زمان', minWidth: 170, valueFormatter: formatNotificationDate },
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
      renderCell: ({ row }: GridRenderCellParams<Notification>) => (
        <RowActions
          actions={[
            {
              key: 'open',
              label: 'مشاهده',
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              onClick: () => openNotification(row),
            },
            {
              key: 'read',
              label: 'خوانده شد',
              icon: <DraftsOutlinedIcon fontSize="small" />,
              disabled: !canManage || !isUnread(row),
              onClick: () => runAction('اعلان خوانده شد.', 'خوانده کردن اعلان انجام نشد.', () => markRead.mutateAsync(row)),
            },
            {
              key: 'unread',
              label: 'خوانده‌نشده',
              icon: <MarkEmailUnreadOutlinedIcon fontSize="small" />,
              disabled: !canManage || isUnread(row),
              menuOnly: true,
              onClick: () => runAction('اعلان خوانده‌نشده شد.', 'خوانده‌نشده کردن اعلان انجام نشد.', () => markUnread.mutateAsync(row)),
            },
            {
              key: 'archive-toggle',
              label: isArchived(row) ? 'خروج از بایگانی' : 'بایگانی',
              icon: isArchived(row) ? <RestoreOutlinedIcon fontSize="small" /> : <ArchiveOutlinedIcon fontSize="small" />,
              color: isArchived(row) ? undefined : 'warning',
              disabled: !canManage,
              menuOnly: true,
              onClick: () => isArchived(row)
                ? runAction('اعلان از بایگانی خارج شد.', 'خروج از بایگانی انجام نشد.', () => unarchive.mutateAsync(row))
                : runAction('اعلان بایگانی شد.', 'بایگانی اعلان انجام نشد.', () => archive.mutateAsync(row)),
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              disabled: !canManage,
              menuOnly: true,
              onClick: () => setDeleteNotification(row),
            },
          ]}
        />
      ),
    },
  ], [archive, canManage, markRead, markUnread, openNotification, runAction, unarchive]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
          <TextField fullWidth select label="وضعیت" value={status} onChange={(event) => { setStatus(event.target.value as 'unread' | 'read' | 'all'); resetPage(); }}>
            <MenuItem value="all">همه</MenuItem>
            <MenuItem value="unread">خوانده‌نشده</MenuItem>
            <MenuItem value="read">خوانده‌شده</MenuItem>
          </TextField>
          <TextField fullWidth select label="نوع" value={type} onChange={(event) => { setType(event.target.value as NotificationType | ''); resetPage(); }}>
            <MenuItem value="">همه</MenuItem>
            {notificationTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField fullWidth select label="اولویت" value={priority} onChange={(event) => { setPriority(event.target.value as NotificationPriority | ''); resetPage(); }}>
            <MenuItem value="">همه</MenuItem>
            {notificationPriorityOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField fullWidth select label="موجودیت" value={entityType} onChange={(event) => { setEntityType(event.target.value as NotificationEntityType | ''); resetPage(); }}>
            <MenuItem value="">همه</MenuItem>
            {notificationEntityTypeOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField fullWidth select label="بایگانی" value={archivedMode} onChange={(event) => { setArchivedMode(event.target.value as ArchivedMode); resetPage(); }}>
            <MenuItem value="active">غیربایگانی</MenuItem>
            <MenuItem value="include">همراه بایگانی</MenuItem>
            <MenuItem value="archived">فقط بایگانی</MenuItem>
          </TextField>
        </Stack>
      </Paper>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت اعلان‌ها انجام نشد.</Alert>}
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
          getRowClassName={({ row }) => (isUnread(row) ? 'notification-unread-row' : '')}
          localeText={{ noRowsLabel: 'هنوز اعلانی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 420, '& .notification-unread-row': { bgcolor: 'action.hover' } }}
        />
      </Paper>
      {deleteNotification && (
        <DeleteNotificationDialog
          notification={deleteNotification}
          open
          onClose={() => setDeleteNotification(null)}
        />
      )}
    </Box>
  );
}
