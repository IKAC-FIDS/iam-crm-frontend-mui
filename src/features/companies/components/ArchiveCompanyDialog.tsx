import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useArchiveCompany } from '../hooks/useCompanies';

export default function ArchiveCompanyDialog({ companyId, companyName, open, onClose, onSuccess }: { companyId: string; companyName: string; open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const mutation = useArchiveCompany(companyId); const [reason, setReason] = useState('');
  const submit = async () => { if (!reason.trim()) return; try { await mutation.mutateAsync({ reason: reason.trim() }); toast.success('شرکت با موفقیت بایگانی شد.'); onSuccess?.(); onClose(); } catch { toast.error('بایگانی شرکت با خطا مواجه شد.'); } };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>بایگانی شرکت</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><Typography>شرکت «{companyName}» از فهرست فعال خارج می‌شود.</Typography>{mutation.isError && <Alert severity="error">خطا در بایگانی شرکت.</Alert>}<TextField autoFocus required label="دلیل بایگانی" multiline minRows={3} value={reason} onChange={(event) => setReason(event.target.value)} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button color="warning" variant="contained" onClick={submit} disabled={!reason.trim() || mutation.isPending}>{mutation.isPending ? 'در حال بایگانی...' : 'بایگانی'}</Button></DialogActions></Dialog>;
}
