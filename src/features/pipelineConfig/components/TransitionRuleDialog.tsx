// ============================================================
// مسیر: src/features/pipelineConfig/components/TransitionRuleDialog.tsx
// ============================================================

import { useState } from 'react';
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
  Stack,
} from '@mui/material';
import { toast } from 'sonner';
import { USER_ROLES, USER_ROLE_LABELS } from '@/features/admin/users/types/adminUser.types';
import type { UserRole } from '@/features/admin/users/types/adminUser.types';
import { isCompanyStage } from '@/features/companies/types/company.types';
import type { PipelineStage } from '@/features/companies/types/company.types';
import { useCreateTransitionRule, useUpdateTransitionRule } from '../hooks/usePipelineConfig';
import type { PipelineStageConfig, TransitionRule } from '../types/pipelineConfig.types';

interface TransitionRuleDialogProps {
  rule: TransitionRule | null;
  stages: PipelineStageConfig[];
  open: boolean;
  onClose: () => void;
}

export default function TransitionRuleDialog({
  rule,
  stages,
  open,
  onClose,
}: TransitionRuleDialogProps) {
  const validStages = stages.filter((item) => isCompanyStage(item.code));

  const create = useCreateTransitionRule();
  const update = useUpdateTransitionRule();

  const [fromStage, setFromStage] = useState<PipelineStage | ''>(
    rule && isCompanyStage(rule.fromStage) ? rule.fromStage : ''
  );

  const [toStage, setToStage] = useState<PipelineStage | ''>(
    rule && isCompanyStage(rule.toStage) ? rule.toStage : ''
  );

  const [role, setRole] = useState<UserRole>(
    USER_ROLES.includes(rule?.role as UserRole) ? (rule?.role as UserRole) : 'REP'
  );

  const [allowed, setAllowed] = useState(rule?.allowed ?? true);

  const pending = create.isPending || update.isPending;

  const submit = async () => {
    if (!fromStage || !toStage || fromStage === toStage) return;

    try {
      const payload = {
        fromStage,
        toStage,
        role,
        allowed,
      };

      if (rule) {
        await update.mutateAsync({
          id: rule.id,
          payload,
        });
      } else {
        await create.mutateAsync(payload);
      }

      toast.success(rule ? 'قانون انتقال بروزرسانی شد.' : 'قانون انتقال ایجاد شد.');
      onClose();
    } catch {
      toast.error('ذخیره قانون انتقال با خطا مواجه شد.');
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{rule ? 'ویرایش قانون انتقال' : 'افزودن قانون انتقال'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && (
            <Alert severity="error">ذخیره قانون با خطا مواجه شد.</Alert>
          )}

          <FormControl fullWidth>
            <InputLabel id="rule-from-stage">از مرحله</InputLabel>
            <Select
              labelId="rule-from-stage"
              label="از مرحله"
              value={fromStage}
              onChange={(event) => setFromStage(event.target.value as PipelineStage)}
            >
              {validStages.map((stage) => (
                <MenuItem key={stage.id} value={stage.code}>
                  {stage.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="rule-to-stage">به مرحله</InputLabel>
            <Select
              labelId="rule-to-stage"
              label="به مرحله"
              value={toStage}
              onChange={(event) => setToStage(event.target.value as PipelineStage)}
            >
              {validStages.map((stage) => (
                <MenuItem key={stage.id} value={stage.code} disabled={stage.code === fromStage}>
                  {stage.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="rule-role">نقش</InputLabel>
            <Select
              labelId="rule-role"
              label="نقش"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {USER_ROLES.map((item) => (
                <MenuItem key={item} value={item}>
                  {USER_ROLE_LABELS[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="rule-allowed">وضعیت</InputLabel>
            <Select
              labelId="rule-allowed"
              label="وضعیت"
              value={allowed ? 'allowed' : 'blocked'}
              onChange={(event) => setAllowed(event.target.value === 'allowed')}
            >
              <MenuItem value="allowed">مجاز</MenuItem>
              <MenuItem value="blocked">غیرمجاز</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={pending}>
          انصراف
        </Button>

        <Button
          variant="contained"
          onClick={submit}
          disabled={!fromStage || !toStage || fromStage === toStage || pending}
        >
          ذخیره
        </Button>
      </DialogActions>
    </Dialog>
  );
}