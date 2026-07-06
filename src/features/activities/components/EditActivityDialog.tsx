import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { usePeople } from '@/features/people/hooks/usePeople';
import ActivityForm from './ActivityForm';
import type { ActivityFormValues } from './ActivityForm';
import { useUpdateActivity } from '../hooks/useActivities';
import type { Activity, UpdateActivityPayload } from '../types/activity.types';

interface ApiErrorBody { message?: string }

export default function EditActivityDialog({ activity, open, onClose }: { activity: Activity; open: boolean; onClose: () => void }) {
  const mutation = useUpdateActivity(activity.companyId, activity.id);
  const people = usePeople({ companyId: activity.companyId, page: 1, limit: 100 });
  const close = () => { if (!mutation.isPending) { mutation.reset(); onClose(); } };
  const submit = async (values: ActivityFormValues) => {
    const payload: UpdateActivityPayload = {
      ...(activity.type !== 'STAGE_CHANGE' && values.type !== 'STAGE_CHANGE' ? { type: values.type } : {}),
      personId: values.personId,
      occurredAt: values.occurredAt,
      notes: values.notes,
      outcome: values.outcome,
      nextActionDate: values.nextActionDate,
    };
    try { await mutation.mutateAsync(payload); toast.success('فعالیت با موفقیت بروزرسانی شد.'); onClose(); } catch { toast.error('خطا در بروزرسانی فعالیت.'); }
  };
  const apiMessage = axios.isAxiosError<ApiErrorBody>(mutation.error) ? mutation.error.response?.data?.message : undefined;
  return <Dialog open={open} onClose={close} fullWidth maxWidth="sm"><DialogTitle>ویرایش فعالیت</DialogTitle><DialogContent><ActivityForm mode="edit" initialValues={activity} people={people.data?.data} isPeopleLoading={people.isLoading} isSubmitting={mutation.isPending} errorMessage={mutation.isError ? apiMessage || 'خطا در بروزرسانی فعالیت.' : people.isError ? 'خطا در دریافت افراد شرکت.' : undefined} onSubmit={submit} onCancel={close} /></DialogContent></Dialog>;
}
