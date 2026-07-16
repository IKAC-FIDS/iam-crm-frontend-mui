import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CompanyForm from './CompanyForm';
import { useUpdateCompany } from '../hooks/useCompanies';
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '../types/company.types';

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody {
  message?: string;
}

export default function EditCompanyDialog({ company, open, onClose }: EditCompanyDialogProps) {
  const updateCompany = useUpdateCompany(company.id);

  const handleClose = () => {
    if (updateCompany.isPending) return;
    updateCompany.reset();
    onClose();
  };

  const handleSubmit = async (
    values: CreateCompanyPayload | UpdateCompanyPayload,
  ) => {
    try {
      await updateCompany.mutateAsync(values);
      toast.success('اطلاعات شرکت با موفقیت بروزرسانی شد.');
      onClose();
    } catch {
      // خطا از وضعیت mutation در فرم نمایش داده می‌شود.
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(updateCompany.error)
    ? updateCompany.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>ویرایش اطلاعات شرکت</DialogTitle>
      <DialogContent>
        <CompanyForm
          mode="edit"
          initialValues={company}
          isSubmitting={updateCompany.isPending}
          errorMessage={
            updateCompany.isError
              ? apiMessage || 'خطا در بروزرسانی اطلاعات شرکت.'
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
