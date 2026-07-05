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
  COMPANY_STAGE_OPTIONS,
  isCompanyStage,
} from '../types/company.types';
import type { PipelineStage } from '../types/company.types';

interface ChangeCompanyStageDialogProps {
  companyId: string;
  currentStage?: PipelineStage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void> | void;
}

interface ApiErrorBody {
  message?: string;
}

export default function ChangeCompanyStageDialog({
  companyId,
  currentStage,
  open,
  onOpenChange,
  onSuccess,
}: ChangeCompanyStageDialogProps) {
  const changeStage = useChangeCompanyStage(companyId);
  const [stage, setStage] = useState<PipelineStage | ''>(
    currentStage && isCompanyStage(currentStage) ? currentStage : '',
  );

  const handleClose = () => {
    if (changeStage.isPending) return;
    setStage(currentStage && isCompanyStage(currentStage) ? currentStage : '');
    changeStage.reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!stage) return;
    try {
      await changeStage.mutateAsync({ stage });
      await onSuccess?.();
      toast.success('مرحله شرکت با موفقیت تغییر کرد.');
      onOpenChange(false);
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
            {errorMessage || 'خطا در تغییر مرحله شرکت.'}
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
            {COMPANY_STAGE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
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
          {changeStage.isPending ? 'در حال ثبت...' : 'ثبت تغییر مرحله'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
