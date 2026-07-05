import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import PersonForm from './PersonForm';
import { useCreatePerson, useUpdatePerson } from '../hooks/usePeople';
import type { CreatePersonPayload, Person, UpdatePersonPayload } from '../types/person.types';

interface PersonFormDialogProps {
  mode: 'create' | 'edit';
  companyId: string;
  person?: Person | null;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody { message?: string }

export default function PersonFormDialog({
  mode,
  companyId,
  person,
  open,
  onClose,
}: PersonFormDialogProps) {
  const createPerson = useCreatePerson(companyId);
  const updatePerson = useUpdatePerson(companyId, person?.id ?? '');
  const mutation = mode === 'create' ? createPerson : updatePerson;

  const handleClose = () => {
    if (mutation.isPending) return;
    mutation.reset();
    onClose();
  };

  const handleSubmit = async (values: CreatePersonPayload | UpdatePersonPayload) => {
    try {
      if (mode === 'create') {
        await createPerson.mutateAsync(values as CreatePersonPayload);
        toast.success('شخص با موفقیت ایجاد شد.');
      } else {
        await updatePerson.mutateAsync(values as UpdatePersonPayload);
        toast.success('اطلاعات شخص با موفقیت بروزرسانی شد.');
      }
      onClose();
    } catch {
      // خطا در فرم نمایش داده می‌شود.
    }
  };

  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error)
    ? mutation.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'افزودن شخص' : 'ویرایش شخص'}</DialogTitle>
      <DialogContent>
        <PersonForm
          mode={mode}
          companyId={companyId}
          initialValues={person ?? undefined}
          isSubmitting={mutation.isPending}
          errorMessage={mutation.isError
            ? apiMessage || (mode === 'create' ? 'خطا در ایجاد شخص.' : 'خطا در بروزرسانی اطلاعات شخص.')
            : undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
