import { useMemo, useState } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useAdminUsers } from '@/features/admin/users/hooks/useAdminUsers';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { toEndOfDayIso } from '@/shared/utils/jalaliDate';
import { useAuditLogs } from '../hooks/useAuditLogs';
import type { AuditLog, AuditLogParams } from '../types/auditLog.types';

function metadataText(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'string') { try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; } }
  try { return JSON.stringify(value, null, 2); } catch { return 'جزئیات قابل نمایش نیست.'; }
}

export default function AuditLogsPage() {
  const user = useAuthStore((state) => state.user); const allowed = can(user, 'audit-log:view', ['ADMIN']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [actorId, setActorId] = useState(''); const [entityType, setEntityType] = useState(''); const [entityId, setEntityId] = useState(''); const [action, setAction] = useState(''); const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  const [filters, setFilters] = useState<Omit<AuditLogParams, 'page' | 'limit'>>({});
  const users = useAdminUsers(allowed);
  const params = useMemo<AuditLogParams>(() => ({ page: pagination.page + 1, limit: pagination.pageSize as AuditLogParams['limit'], ...filters }), [filters, pagination]);
  const query = useAuditLogs(params, allowed);
  const columns = useMemo<GridColDef<AuditLog>[]>(() => [
    { field: 'date', headerName: 'تاریخ', minWidth: 180, valueGetter: (_value, row) => formatDateTime(row.createdAt ?? row.timestamp) },
    { field: 'actor', headerName: 'کاربر', minWidth: 180, flex: 0.8, valueGetter: (_value, row) => row.actor?.fullName || row.actorName || row.actor?.email || row.actorId || '—' },
    { field: 'action', headerName: 'عملیات', minWidth: 180, flex: 0.8 },
    { field: 'entityType', headerName: 'نوع موجودیت', minWidth: 140, valueFormatter: (value) => value || '—' },
    { field: 'entityId', headerName: 'شناسه موجودیت', minWidth: 210, valueFormatter: (value) => value || '—' },
    { field: 'metadata', headerName: 'جزئیات', minWidth: 320, flex: 1.4, sortable: false, renderCell: ({ value }: GridRenderCellParams<AuditLog, unknown>) => <Box component="pre" sx={{ m: 0, py: 1, maxHeight: 110, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 }}>{metadataText(value)}</Box> },
  ], []);
  if (!allowed) return <Alert severity="warning">شما دسترسی مشاهده لاگ تغییرات را ندارید.</Alert>;
  const apply = () => { setPagination((current) => ({ ...current, page: 0 })); setFilters({ actorId: actorId || undefined, entityType: entityType.trim() || undefined, entityId: entityId.trim() || undefined, action: action.trim() || undefined, startDate: startDate || undefined, endDate: toEndOfDayIso(endDate) }); };
  const reset = () => { setActorId(''); setEntityType(''); setEntityId(''); setAction(''); setStartDate(''); setEndDate(''); setPagination((current) => ({ ...current, page: 0 })); setFilters({}); };
  const invalidRange = Boolean(startDate && endDate && startDate > endDate);
  return <Stack spacing={2}><div><Typography variant="h4">لاگ تغییرات</Typography><Typography color="text.secondary">مشاهده رویدادهای ثبت‌شده و تغییرات سیستمی.</Typography></div>
    <Paper sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 2 }}>فیلترها</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}><FormControl disabled={users.isError}><InputLabel id="audit-actor">کاربر</InputLabel><Select labelId="audit-actor" label="کاربر" value={actorId} onChange={(event) => setActorId(event.target.value)}><MenuItem value="">همه کاربران</MenuItem>{(users.data ?? []).map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}</Select></FormControl><TextField label="نوع موجودیت" value={entityType} onChange={(event) => setEntityType(event.target.value)} /><TextField label="شناسه موجودیت" value={entityId} onChange={(event) => setEntityId(event.target.value)} /><TextField label="عملیات" value={action} onChange={(event) => setAction(event.target.value)} /><JalaliDateField label="از تاریخ" value={startDate} onChange={(next) => setStartDate(next ?? '')} /><JalaliDateField label="تا تاریخ" value={endDate} onChange={(next) => setEndDate(next ?? '')} /></Box>{invalidRange && <Alert severity="warning" sx={{ mt: 2 }}>تاریخ شروع نباید بعد از تاریخ پایان باشد.</Alert>}{users.isError && <Alert severity="warning" sx={{ mt: 2 }}>دریافت فهرست کاربران با خطا مواجه شد؛ سایر فیلترها قابل استفاده‌اند.</Alert>}<Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}><Button onClick={reset}>پاک‌کردن</Button><Button variant="contained" onClick={apply} disabled={invalidRange}>اعمال فیلترها</Button></Stack></Paper>
    {query.isError && <Alert severity="error">خطا در دریافت لاگ تغییرات.</Alert>}
    <Paper sx={{ overflow: 'hidden' }}><DataGrid autoHeight getRowHeight={() => 'auto'} rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[10, 20, 50]} disableRowSelectionOnClick localeText={{ noRowsLabel: 'لاگی مطابق فیلترها یافت نشد.' }} sx={{ border: 0, minHeight: 440, '& .MuiDataGrid-cell': { alignItems: 'flex-start' } }} /></Paper>
  </Stack>;
}
