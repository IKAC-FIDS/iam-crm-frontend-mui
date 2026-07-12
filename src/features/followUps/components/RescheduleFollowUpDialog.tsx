import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { useRescheduleFollowUp } from '../hooks/useFollowUps';
import type { FollowUpActivity } from '../types/followUp.types';

interface ApiErrorBody { message?: string }
export default function RescheduleFollowUpDialog({ followUp, open, onClose }: { followUp: FollowUpActivity; open: boolean; onClose: () => void }) {
  const mutation = useRescheduleFollowUp(followUp.companyId, followUp.id); const [date, setDate] = useState(''); const [note, setNote] = useState(''); const [validation, setValidation] = useState('');
  const close = () => { if (!mutation.isPending) onClose(); };
  const submit = async () => { const parsed = new Date(date); if (!date || Number.isNaN(parsed.getTime())) { setValidation('تاریخ پیگیری بعدی الزامی و باید معتبر باشد.'); return; } if (parsed.getTime() <= Date.now()) { setValidation('تاریخ پیگیری بعدی باید در آینده باشد.'); return; } setValidation(''); try { await mutation.mutateAsync({ nextActionDate: parsed.toISOString(), note: note.trim() || undefined }); toast.success('پیگیری با موفقیت زمان‌بندی مجدد شد.'); onClose(); } catch { toast.error('خطا در زمان‌بندی مجدد پیگیری.'); } };
  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error) ? mutation.error.response?.data?.message : undefined;
  return <Dialog open={open} onClose={close} fullWidth maxWidth="sm"><DialogTitle>زمان‌بندی مجدد</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{mutation.isError && <Alert severity="error">{apiMessage || 'خطا در زمان‌بندی مجدد پیگیری.'}</Alert>}<JalaliDateField required label="تاریخ پیگیری بعدی" includeTime value={date} onChange={(next) => setDate(next ?? '')} error={Boolean(validation)} helperText={validation} /><TextField label="یادداشت زمان‌بندی مجدد" multiline minRows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={close} disabled={mutation.isPending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={mutation.isPending}>{mutation.isPending ? 'در حال ثبت...' : 'زمان‌بندی مجدد'}</Button></DialogActions></Dialog>;
}
