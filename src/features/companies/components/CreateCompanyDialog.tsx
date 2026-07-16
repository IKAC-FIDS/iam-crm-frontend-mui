import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useAuthStore } from '@/store/authStore';
import CompanyForm from './CompanyForm';
import { useCreateCompany } from '../hooks/useCompanies';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '../types/company.types';

interface CreateCompanyDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateCompanyDialog({ open, onClose }: CreateCompanyDialogProps) {
  const createCompany = useCreateCompany();
  const userId = useAuthStore((state) => state.user?.id);

  const handleClose = () => {
    if (createCompany.isPending) return;
    createCompany.reset();
    onClose();
  };

  const handleSubmit = async (
    values: CreateCompanyPayload | UpdateCompanyPayload,
  ) => {
    if (!userId) {
      toast.error('اطلاعات کاربر واردشده در دسترس نیست. دوباره وارد شوید.');
      return;
    }

    try {
      await createCompany.mutateAsync({
        ...(values as CreateCompanyPayload),
        ownerId: userId,
      });
      toast.success('شرکت با موفقیت ایجاد شد.');
      onClose();
    } catch {
      // خطا از وضعیت mutation در فرم نمایش داده می‌شود.
    }
  };

  const apiMessage = createCompany.error
    ? getApiErrorMessage(createCompany.error, 'خطا در ایجاد شرکت.')
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>افزودن شرکت</DialogTitle>
      <DialogContent>
        <CompanyForm
          mode="create"
          isSubmitting={createCompany.isPending}
          errorMessage={
            createCompany.isError
              ? apiMessage || 'خطا در ایجاد شرکت.'
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
