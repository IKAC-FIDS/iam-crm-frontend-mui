import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useChangeCommercialDocumentStatus } from '../hooks/useCommercialDocuments';
import { commercialDocumentStatusOptions } from '../utils/commercialDocumentDisplay';
import type { CommercialDocument, CommercialDocumentStatus } from '../types/commercialDocument.types';

export default function ChangeCommercialDocumentStatusDialog({ opportunityId, companyId, document, open, onClose }: { opportunityId: string; companyId?: string; document: CommercialDocument; open: boolean; onClose: () => void }) {
  const mutation = useChangeCommercialDocumentStatus(opportunityId, companyId);
  const [status, setStatus] = useState<CommercialDocumentStatus>(document.status);
  const [notes, setNotes] = useState(document.notes ?? '');
  const submit = async () => {
    try {
      await mutation.mutateAsync({ id: document.id, payload: { status, notes: notes.trim() || undefined } });
      toast.success('وضعیت سند تجاری تغییر کرد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'تغییر وضعیت سند تجاری انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !mutation.isPending && onClose()} fullWidth maxWidth="xs">
      <DialogTitle>تغییر وضعیت سند</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as CommercialDocumentStatus)}>
            {commercialDocumentStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField label="یادداشت" multiline minRows={2} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={mutation.isPending}>ثبت وضعیت</Button>
      </DialogActions>
    </Dialog>
  );
}
