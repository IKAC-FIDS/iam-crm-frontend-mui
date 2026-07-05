import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CompanySocialChannelForm from './CompanySocialChannelForm';
import { useCreateCompanySocialChannel, useUpdateCompanySocialChannel } from '../hooks/useCompanySocialChannels';
import type { CompanySocialChannel, CreateCompanySocialChannelPayload, UpdateCompanySocialChannelPayload } from '../types/companySocialChannel.types';

interface Props { mode: 'create' | 'edit'; companyId: string; channel?: CompanySocialChannel | null; open: boolean; onClose: () => void }
interface ApiErrorBody { message?: string }

export default function CompanySocialChannelFormDialog({ mode, companyId, channel, open, onClose }: Props) {
  const createChannel = useCreateCompanySocialChannel(companyId);
  const updateChannel = useUpdateCompanySocialChannel(companyId, channel?.id ?? '');
  const mutation = mode === 'create' ? createChannel : updateChannel;
  const close = () => { if (!mutation.isPending) { mutation.reset(); onClose(); } };
  const submit = async (values: CreateCompanySocialChannelPayload | UpdateCompanySocialChannelPayload) => {
    try {
      if (mode === 'create') {
        await createChannel.mutateAsync(values as CreateCompanySocialChannelPayload);
        toast.success('کانال اجتماعی با موفقیت ایجاد شد.');
      } else {
        await updateChannel.mutateAsync(values as UpdateCompanySocialChannelPayload);
        toast.success('کانال اجتماعی با موفقیت بروزرسانی شد.');
      }
      onClose();
    } catch {
      toast.error(mode === 'create' ? 'خطا در ایجاد کانال اجتماعی.' : 'خطا در بروزرسانی کانال اجتماعی.');
    }
  };
  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error) ? mutation.error.response?.data?.message : undefined;
  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'افزودن کانال اجتماعی' : 'ویرایش کانال اجتماعی'}</DialogTitle>
      <DialogContent><CompanySocialChannelForm mode={mode} initialValues={channel ?? undefined} isSubmitting={mutation.isPending} errorMessage={mutation.isError ? apiMessage || (mode === 'create' ? 'خطا در ایجاد کانال اجتماعی.' : 'خطا در بروزرسانی کانال اجتماعی.') : undefined} onSubmit={submit} onCancel={close} /></DialogContent>
    </Dialog>
  );
}
