import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useCompleteFollowUp } from '../hooks/useFollowUps';
import type { FollowUpActivity } from '../types/followUp.types';

interface ApiErrorBody { message?: string }
export default function CompleteFollowUpDialog({ followUp, open, onClose }: { followUp: FollowUpActivity; open: boolean; onClose: () => void }) {
  const mutation = useCompleteFollowUp(followUp.companyId, followUp.id); const [outcome, setOutcome] = useState(followUp.outcome ?? ''); const [note, setNote] = useState('');
  const close = () => { if (!mutation.isPending) onClose(); };
  const submit = async () => { try { await mutation.mutateAsync({ outcome: outcome.trim() || undefined, note: note.trim() || undefined }); toast.success('پیگیری با موفقیت انجام شد.'); onClose(); } catch { toast.error('خطا در ثبت انجام پیگیری.'); } };
  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error) ? mutation.error.response?.data?.message : undefined;
  return <Dialog open={open} onClose={close} fullWidth maxWidth="sm"><DialogTitle>انجام پیگیری</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{mutation.isError && <Alert severity="error">{apiMessage || 'خطا در ثبت انجام پیگیری.'}</Alert>}<TextField label="نتیجه" multiline minRows={2} value={outcome} onChange={(e) => setOutcome(e.target.value)} /><TextField label="یادداشت تکمیل" multiline minRows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={close} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={mutation.isPending}>{mutation.isPending ? 'در حال ثبت...' : 'انجام شد'}</Button></DialogActions></Dialog>;
}
