import { useState } from 'react';
import { Alert, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { COMPANY_PRIORITY_OPTIONS, type Priority } from '@/features/companies/types/company.types';
import type { PipelineStageConfig } from '@/features/pipelineConfig/types/pipelineConfig.types';
import type { CompanyOpportunityPayload, Opportunity } from '../types/opportunity.types';

export default function OpportunityForm({ opportunity, stages, onChange }: { opportunity?: Opportunity | null; stages: PipelineStageConfig[]; onChange: (value: CompanyOpportunityPayload) => void }) {
  const [value, setValue] = useState<CompanyOpportunityPayload>({ title: opportunity?.title ?? '', description: opportunity?.description ?? undefined, stageId: opportunity?.stageId, priority: opportunity?.priority as Priority ?? 'MEDIUM', estimatedValue: opportunity?.estimatedValue == null ? undefined : Number(opportunity.estimatedValue), expectedCloseDate: opportunity?.expectedCloseDate?.slice(0, 10), source: opportunity?.source ?? undefined });
  const update = (next: Partial<CompanyOpportunityPayload>) => { const merged = { ...value, ...next }; setValue(merged); onChange(merged); };
  return <Stack spacing={2} sx={{ pt: 1 }}>
    {!stages.length && <Alert severity="warning">هیچ مرحله فعال پایپ‌لاین دریافت نشد.</Alert>}
    <TextField required label="عنوان فرصت" value={value.title} onChange={(e) => update({ title: e.target.value })} />
    <TextField label="توضیحات" multiline minRows={2} value={value.description ?? ''} onChange={(e) => update({ description: e.target.value || undefined })} />
    {!opportunity && <FormControl><InputLabel>مرحله آغازین</InputLabel><Select label="مرحله آغازین" value={value.stageId ?? ''} onChange={(e) => update({ stageId: e.target.value || undefined })}><MenuItem value="">مرحله پیش‌فرض</MenuItem>{stages.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}</Select></FormControl>}
    <FormControl><InputLabel>اولویت</InputLabel><Select label="اولویت" value={value.priority ?? 'MEDIUM'} onChange={(e) => update({ priority: e.target.value as Priority })}>{COMPANY_PRIORITY_OPTIONS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}</Select></FormControl>
    <TextField label="ارزش تخمینی" type="number" value={value.estimatedValue ?? ''} onChange={(e) => update({ estimatedValue: e.target.value === '' ? undefined : Number(e.target.value) })} />
    <TextField label="تاریخ بسته‌شدن مورد انتظار" type="date" slotProps={{ inputLabel: { shrink: true } }} value={value.expectedCloseDate ?? ''} onChange={(e) => update({ expectedCloseDate: e.target.value || undefined })} />
    <TextField label="منبع" value={value.source ?? ''} onChange={(e) => update({ source: e.target.value || undefined })} />
  </Stack>;
}
