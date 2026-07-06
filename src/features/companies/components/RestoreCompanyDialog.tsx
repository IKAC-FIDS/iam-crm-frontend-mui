import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useRestoreCompany } from '../hooks/useCompanies';

export default function RestoreCompanyDialog({ companyId, companyName, open, onClose, onSuccess }: { companyId: string; companyName: string; open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const mutation = useRestoreCompany(companyId);
  const submit = async () => { try { await mutation.mutateAsync(); toast.success('شرکت با موفقیت بازیابی شد.'); onSuccess?.(); onClose(); } catch { toast.error('بازیابی شرکت با خطا مواجه شد.'); } };
  return <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs"><DialogTitle>بازیابی شرکت</DialogTitle><DialogContent>{mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در بازیابی شرکت.</Alert>}<Typography>شرکت «{companyName}» به فهرست شرکت‌های فعال بازگردانده شود؟</Typography></DialogContent><DialogActions><Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button><Button color="success" variant="contained" onClick={submit} disabled={mutation.isPending}>{mutation.isPending ? 'در حال بازیابی...' : 'بازیابی'}</Button></DialogActions></Dialog>;
}
