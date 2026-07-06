import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { toast } from 'sonner';
import { useUpdatePipelineStage } from '../hooks/usePipelineConfig';
import type { PipelineStageConfig } from '../types/pipelineConfig.types';

export default function StageConfigDialog({ stage, open, onClose }: { stage: PipelineStageConfig; open: boolean; onClose: () => void }) {
  const mutation = useUpdatePipelineStage();
  const [label, setLabel] = useState(stage.label);
  const [description, setDescription] = useState(stage.description ?? '');
  const [sortOrder, setSortOrder] = useState(String(stage.sortOrder));
  const [color, setColor] = useState(stage.color ?? '');
  const [isActive, setIsActive] = useState(stage.isActive);
  const [isTerminal, setIsTerminal] = useState(stage.isTerminal);
  const submit = async () => {
    try { await mutation.mutateAsync({ id: stage.id, payload: { label: label.trim(), description: description.trim() || undefined, sortOrder: Number(sortOrder), color: color || undefined, isActive, isTerminal } }); toast.success('تنظیمات مرحله بروزرسانی شد.'); onClose(); }
    catch { toast.error('خطا در بروزرسانی مرحله.'); }
  };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="sm"><DialogTitle>ویرایش مرحله</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{mutation.isError && <Alert severity="error">ذخیره تنظیمات مرحله با خطا مواجه شد.</Alert>}<TextField label="کد مرحله" value={stage.code} disabled /><TextField required label="عنوان" value={label} onChange={(event) => setLabel(event.target.value)} /><TextField label="توضیح" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} /><TextField required label="ترتیب نمایش" type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /><TextField label="رنگ" placeholder="#1976d2" value={color} onChange={(event) => setColor(event.target.value)} /><FormControlLabel label="فعال" control={<Switch checked={isActive} onChange={(_, checked) => setIsActive(checked)} />} /><FormControlLabel label="مرحله پایانی" control={<Switch checked={isTerminal} onChange={(_, checked) => setIsTerminal(checked)} />} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!label.trim() || !sortOrder || !Number.isFinite(Number(sortOrder)) || mutation.isPending}>ذخیره</Button></DialogActions></Dialog>;
}
