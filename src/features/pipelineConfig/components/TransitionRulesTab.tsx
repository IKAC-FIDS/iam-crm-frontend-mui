import { useMemo, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'sonner';
import { USER_ROLE_LABELS } from '@/features/admin/users/types/adminUser.types';
import { useDeleteTransitionRule, usePipelineStages, useTransitionRules } from '../hooks/usePipelineConfig';
import type { TransitionRule } from '../types/pipelineConfig.types';
import TransitionRuleDialog from './TransitionRuleDialog';

export default function TransitionRulesTab() {
  const rules = useTransitionRules(); const stages = usePipelineStages(); const remove = useDeleteTransitionRule();
  const [editing, setEditing] = useState<TransitionRule | null>(null); const [formOpen, setFormOpen] = useState(false); const [deleting, setDeleting] = useState<TransitionRule | null>(null);
  const labels = useMemo(() => Object.fromEntries((stages.data ?? []).map((stage) => [stage.code, stage.label])), [stages.data]);
  const columns = useMemo<GridColDef<TransitionRule>[]>(() => [
    { field: 'fromStage', headerName: 'از مرحله', minWidth: 180, valueFormatter: (value) => labels[value] ?? value },
    { field: 'toStage', headerName: 'به مرحله', minWidth: 180, valueFormatter: (value) => labels[value] ?? value },
    { field: 'role', headerName: 'نقش', minWidth: 130, valueFormatter: (value) => USER_ROLE_LABELS[value as keyof typeof USER_ROLE_LABELS] ?? value },
    { field: 'allowed', headerName: 'مجاز / غیرمجاز', minWidth: 130, valueFormatter: (value) => value ? 'مجاز' : 'غیرمجاز' },
    { field: 'actions', headerName: 'عملیات', minWidth: 150, sortable: false, renderCell: ({ row }: GridRenderCellParams<TransitionRule>) => <Stack direction="row"><Button size="small" onClick={() => { setEditing(row); setFormOpen(true); }}>ویرایش</Button><Button size="small" color="error" onClick={() => setDeleting(row)}>حذف</Button></Stack> },
  ], [labels]);
  const confirmDelete = async () => { if (!deleting) return; try { await remove.mutateAsync(deleting.id); toast.success('قانون انتقال حذف شد.'); setDeleting(null); } catch { toast.error('حذف قانون انتقال با خطا مواجه شد.'); } };
  const close = () => { setEditing(null); setFormOpen(false); };
  return <Stack spacing={2}><Stack direction="row" sx={{ justifyContent: 'flex-end' }}><Button variant="contained" onClick={() => setFormOpen(true)} disabled={stages.isLoading || stages.isError}>افزودن قانون</Button></Stack>{(rules.isError || stages.isError) && <Alert severity="error">خطا در دریافت قوانین انتقال یا مراحل.</Alert>}<Paper><DataGrid autoHeight rows={rules.data ?? []} columns={columns} loading={rules.isLoading || stages.isLoading} hideFooter localeText={{ noRowsLabel: 'هنوز قانون انتقالی ثبت نشده است.' }} sx={{ border: 0, minHeight: 360 }} /></Paper>{formOpen && <TransitionRuleDialog key={editing?.id ?? 'new'} rule={editing} stages={stages.data ?? []} open onClose={close} />}<Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}><DialogTitle>حذف قانون انتقال</DialogTitle><DialogContent>آیا از حذف این قانون مطمئن هستید؟</DialogContent><DialogActions><Button onClick={() => setDeleting(null)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog></Stack>;
}
