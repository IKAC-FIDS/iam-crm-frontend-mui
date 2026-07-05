import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CompanyBranchForm from './CompanyBranchForm';
import { useCreateCompanyBranch, useUpdateCompanyBranch } from '../hooks/useCompanyBranches';
import type {
  CompanyBranch,
  CreateCompanyBranchPayload,
  UpdateCompanyBranchPayload,
} from '../types/companyBranch.types';

interface Props {
  mode: 'create' | 'edit';
  companyId: string;
  branch?: CompanyBranch | null;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody { message?: string }

export default function CompanyBranchFormDialog({ mode, companyId, branch, open, onClose }: Props) {
  const createBranch = useCreateCompanyBranch(companyId);
  const updateBranch = useUpdateCompanyBranch(companyId, branch?.id ?? '');
  const mutation = mode === 'create' ? createBranch : updateBranch;

  const close = () => {
    if (mutation.isPending) return;
    mutation.reset();
    onClose();
  };

  const submit = async (values: CreateCompanyBranchPayload | UpdateCompanyBranchPayload) => {
    try {
      if (mode === 'create') {
        await createBranch.mutateAsync(values as CreateCompanyBranchPayload);
        toast.success('شعبه با موفقیت ایجاد شد.');
      } else {
        await updateBranch.mutateAsync(values as UpdateCompanyBranchPayload);
        toast.success('شعبه با موفقیت بروزرسانی شد.');
      }
      onClose();
    } catch {
      toast.error(mode === 'create' ? 'خطا در ایجاد شعبه.' : 'خطا در بروزرسانی شعبه.');
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error)
    ? mutation.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'افزودن شعبه' : 'ویرایش شعبه'}</DialogTitle>
      <DialogContent>
        <CompanyBranchForm
          mode={mode}
          initialValues={branch ?? undefined}
          isSubmitting={mutation.isPending}
          errorMessage={mutation.isError
            ? apiMessage || (mode === 'create' ? 'خطا در ایجاد شعبه.' : 'خطا در بروزرسانی شعبه.')
            : undefined}
          onSubmit={submit}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}
