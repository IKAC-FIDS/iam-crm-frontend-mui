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
import { useChangeCompanyStage } from '../hooks/useCompanies';
import {
  COMPANY_STAGES,
  companyStageLabels,
  isCompanyStage,
} from '../types/company.types';
import type { CompanyStage } from '../types/company.types';

interface ChangeCompanyStageDialogProps {
  companyId: string;
  currentStage?: string | null;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody {
  message?: string;
}

export default function ChangeCompanyStageDialog({
  companyId,
  currentStage,
  open,
  onClose,
}: ChangeCompanyStageDialogProps) {
  const changeStage = useChangeCompanyStage(companyId);
  const [stage, setStage] = useState<CompanyStage | ''>(
    currentStage && isCompanyStage(currentStage) ? currentStage : '',
  );

  const handleClose = () => {
    if (changeStage.isPending) return;
    setStage(currentStage && isCompanyStage(currentStage) ? currentStage : '');
    changeStage.reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!stage) return;
    try {
      await changeStage.mutateAsync({ stage });
      toast.success('مرحله فروش شرکت تغییر کرد.');
      onClose();
    } catch {
      // خطای API در خود فرم نمایش داده می‌شود.
    }
  };

  const errorMessage = axios.isAxiosError<ApiErrorBody>(changeStage.error)
    ? changeStage.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>تغییر مرحله</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        {changeStage.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage || 'تغییر مرحله با خطا مواجه شد.'}
          </Alert>
        )}
        <FormControl fullWidth>
          <InputLabel id="change-company-stage-label">مرحله فروش</InputLabel>
          <Select
            labelId="change-company-stage-label"
            label="مرحله فروش"
            value={stage}
            onChange={(event) => {
              const value = event.target.value;
              setStage(isCompanyStage(value) ? value : '');
            }}
          >
            {COMPANY_STAGES.map((value) => (
              <MenuItem key={value} value={value}>{companyStageLabels[value]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={changeStage.isPending}>انصراف</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!stage || changeStage.isPending || stage === currentStage}
        >
          {changeStage.isPending ? 'در حال ثبت...' : 'ثبت مرحله'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
