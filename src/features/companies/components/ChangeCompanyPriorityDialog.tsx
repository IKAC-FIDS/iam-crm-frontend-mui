import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useUpdateCompany } from '../hooks/useCompanies';
import { COMPANY_PRIORITY_OPTIONS } from '../types/company.types';
import type { Priority } from '../types/company.types';

interface ChangeCompanyPriorityDialogProps {
  companyId: string;
  currentPriority?: Priority | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApiErrorBody {
  message?: string;
}

export default function ChangeCompanyPriorityDialog({
  companyId,
  currentPriority,
  open,
  onOpenChange,
}: ChangeCompanyPriorityDialogProps) {
  const updateCompany = useUpdateCompany(companyId);
  const [priority, setPriority] = useState<Priority | ''>(currentPriority ?? '');

  const handleClose = () => {
    if (updateCompany.isPending) return;
    setPriority(currentPriority ?? '');
    updateCompany.reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!priority) return;

    try {
      await updateCompany.mutateAsync({ priority });
      toast.success('اولویت شرکت با موفقیت تغییر کرد.');
      onOpenChange(false);
    } catch {
      // خطا از وضعیت mutation در فرم نمایش داده می‌شود.
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(updateCompany.error)
    ? updateCompany.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>تغییر اولویت</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        {updateCompany.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiMessage || 'خطا در تغییر اولویت شرکت.'}
          </Alert>
        )}
        <FormControl fullWidth>
          <InputLabel id="change-company-priority-label">اولویت</InputLabel>
          <Select
            labelId="change-company-priority-label"
            label="اولویت"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            {COMPANY_PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={updateCompany.isPending}>انصراف</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!priority || updateCompany.isPending || priority === currentPriority}
        >
          {updateCompany.isPending ? 'در حال ثبت...' : 'ثبت تغییر اولویت'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
