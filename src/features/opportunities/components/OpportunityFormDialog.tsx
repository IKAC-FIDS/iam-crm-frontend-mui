import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { usePipelineStages } from '@/features/pipelineConfig/hooks/usePipelineConfig';
import { useCreateOpportunity, useUpdateOpportunity } from '../hooks/useOpportunities';
import type { CompanyOpportunityPayload, Opportunity } from '../types/opportunity.types';
import OpportunityForm from './OpportunityForm';

export default function OpportunityFormDialog({ companyId, opportunity, open, onClose }: { companyId: string; opportunity?: Opportunity | null; open: boolean; onClose: () => void }) {
  const stages = usePipelineStages(open); const create = useCreateOpportunity(companyId); const update = useUpdateOpportunity(companyId);
  const [payload, setPayload] = useState<CompanyOpportunityPayload>({ title: opportunity?.title ?? '' });
  const submit = async () => { if (!payload.title.trim()) return; try { if (opportunity) { await update.mutateAsync({ id: opportunity.id, payload: { title: payload.title, description: payload.description, priority: payload.priority, estimatedValue: payload.estimatedValue, expectedCloseDate: payload.expectedCloseDate, source: payload.source } }); } else await create.mutateAsync(payload); toast.success(opportunity ? 'فرصت ویرایش شد.' : 'فرصت ایجاد شد.'); onClose(); } catch { toast.error('ذخیره فرصت انجام نشد.'); } };
  const pending = create.isPending || update.isPending;
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{opportunity ? 'ویرایش فرصت' : 'ایجاد فرصت'}</DialogTitle><DialogContent><OpportunityForm key={opportunity?.id ?? 'new'} opportunity={opportunity} stages={(stages.data ?? []).filter((s) => s.isActive)} onChange={setPayload} /></DialogContent><DialogActions><Button onClick={onClose}>انصراف</Button><Button variant="contained" disabled={pending || !payload.title?.trim()} onClick={submit}>ذخیره</Button></DialogActions></Dialog>;
}
