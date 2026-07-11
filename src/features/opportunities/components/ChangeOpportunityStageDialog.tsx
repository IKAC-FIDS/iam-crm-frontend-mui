import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useAuthStore } from '@/store/authStore';
import {
  useRuntimePipelineStages,
  useRuntimeTransitionRules,
} from '@/features/pipelineConfig/hooks/usePipelineConfig';
import { useChangeOpportunityStage } from '../hooks/useOpportunities';
import type { Opportunity } from '../types/opportunity.types';
const message = (e: unknown) => getApiErrorMessage(e, '');
export default function ChangeOpportunityStageDialog({ opportunity, open, onClose }: { opportunity: Opportunity; open: boolean; onClose: () => void }) { const role = useAuthStore((s) => s.user?.role); const [stageId, setStageId] = useState(''); const [note, setNote] = useState(''); const stages = useRuntimePipelineStages(open); const rules = useRuntimeTransitionRules(open); const mutation = useChangeOpportunityStage(opportunity.companyId); const targets = useMemo(() => { if (rules.isError) return []; const applicable = (rules.data ?? []).filter((r) => r.fromStageId === opportunity.stageId && (r.role === role || r.role == null)); return (stages.data ?? []).filter((s) => s.isActive && s.id !== opportunity.stageId && applicable.some((r) => r.toStageId === s.id && r.allowed && (r.role === role || !applicable.some((specific) => specific.toStageId === s.id && specific.role === role)))); }, [opportunity.stageId, role, rules.data, rules.isError, stages.data]); const submit = async () => { try { await mutation.mutateAsync({ id: opportunity.id, stageId, note }); toast.success('مرحله فرصت تغییر کرد.'); onClose(); } catch (e) { toast.error(message(e) || 'تغییر مرحله فرصت انجام نشد.'); } };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"><DialogTitle>تغییر مرحله فرصت</DialogTitle><DialogContent sx={{ display: 'grid', gap: 2, pt: '12px !important' }}>{rules.isError && <Alert severity="error">قوانین انتقال دریافت نشد؛ انتخاب مقصد غیرفعال است.</Alert>}{!rules.isLoading && !rules.isError && !targets.length && <Alert severity="info">انتقال مجازی برای نقش شما تعریف نشده است.</Alert>}<FormControl disabled={rules.isError || !targets.length}><InputLabel>مرحله مقصد</InputLabel><Select label="مرحله مقصد" value={stageId} onChange={(e) => setStageId(e.target.value)}>{targets.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}</Select></FormControl><TextField label="یادداشت" value={note} onChange={(e) => setNote(e.target.value)} /></DialogContent><DialogActions><Button onClick={onClose}>انصراف</Button><Button variant="contained" disabled={mutation.isPending || !stageId} onClick={submit}>تغییر مرحله</Button></DialogActions></Dialog>;
}
