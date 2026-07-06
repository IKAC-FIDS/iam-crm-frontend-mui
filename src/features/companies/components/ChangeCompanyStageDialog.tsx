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
import { isCompanyStage } from '../types/company.types';
import type { PipelineStage } from '../types/company.types';
import { usePipelineStages, useTransitionRules } from '@/features/pipelineConfig/hooks/usePipelineConfig';
import { useAuthStore } from '@/store/authStore';

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
  const role = useAuthStore((state) => state.user?.role);
  const stages = usePipelineStages(open);
  const rules = useTransitionRules(open);
  const [stage, setStage] = useState<PipelineStage | ''>('');

  const handleClose = () => {
    if (changeStage.isPending) return;
    setStage('');
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
  const allowedCodes = new Set((rules.data ?? []).filter((rule) => rule.allowed && rule.fromStage === currentStage && rule.role === role).map((rule) => rule.toStage));
  const targets = (stages.data ?? []).filter((item) => item.isActive && isCompanyStage(item.code) && item.code !== currentStage && allowedCodes.has(item.code));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>تغییر مرحله</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        {changeStage.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage || 'خطا در تغییر مرحله شرکت.'}
          </Alert>
        )}
        {(stages.isError || rules.isError) && <Alert severity="error" sx={{ mb: 2 }}>دریافت مراحل مجاز از Backend با خطا مواجه شد. تغییر مرحله تا دریافت قوانین معتبر غیرفعال است.</Alert>}
        {!stages.isLoading && !rules.isLoading && !stages.isError && !rules.isError && targets.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>برای نقش شما انتقال مجازی از مرحله فعلی تعریف نشده است.</Alert>}
        <FormControl fullWidth disabled={stages.isLoading || rules.isLoading || stages.isError || rules.isError}>
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
            {targets.map((option) => (
              <MenuItem key={option.id} value={option.code}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={changeStage.isPending}>انصراف</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!stage || changeStage.isPending || stage === currentStage || !targets.some((item) => item.code === stage)}
        >
          {changeStage.isPending ? 'در حال ثبت...' : 'ثبت تغییر مرحله'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
