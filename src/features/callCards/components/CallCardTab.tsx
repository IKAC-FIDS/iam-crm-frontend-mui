import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import CallCardFormDialog from './CallCardFormDialog';
import CallCardSuggestionDialog from './CallCardSuggestionDialog';
import CallCardView from './CallCardView';
import { useCallCard, useSuggestCallCard } from '../hooks/useCallCards';
import type { CallCard } from '../types/callCard.types';
import { mergeCallCardSuggestion } from '../utils/callCardDisplay';

export default function CallCardTab({ companyId }: { companyId: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'call-card:view', ['ADMIN', 'MANAGER', 'REP']);
  const canManage = can(user, 'call-card:manage', ['ADMIN', 'MANAGER', 'REP']);
  const callCardQuery = useCallCard(companyId);
  const suggestionMutation = useSuggestCallCard(companyId);
  const [formOpen, setFormOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [formValues, setFormValues] = useState<Partial<CallCard> | undefined>();

  if (!canView) return <Alert severity="warning">دسترسی مشاهده کال کارت برای این حساب فعال نیست.</Alert>;

  const callCard = callCardQuery.data;

  const openForm = (values?: Partial<CallCard>) => {
    setFormValues(values ?? callCard ?? undefined);
    setFormOpen(true);
  };

  const getSuggestions = () => {
    suggestionMutation.reset();
    setSuggestionOpen(true);
    suggestionMutation.mutate();
  };

  const applySuggestions = () => {
    if (!suggestionMutation.data) return;
    setFormValues(mergeCallCardSuggestion(callCard, suggestionMutation.data));
    setSuggestionOpen(false);
    setFormOpen(true);
  };

  const copy = async (text: string, success: string) => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      toast.success(success);
    } catch {
      toast.error('کپی متن با خطا مواجه شد.');
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
        <Typography variant="h6">کال کارت شرکت</Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {canManage && <Button variant="contained" onClick={() => openForm()}>{callCard ? 'ویرایش کال کارت' : 'ایجاد کال کارت'}</Button>}
          {canManage && <Button variant="outlined" onClick={getSuggestions}>دریافت پیشنهادات</Button>}
          {callCard?.firstEmail && <Button onClick={() => copy(callCard.firstEmail!, 'متن ایمیل کپی شد.')}>کپی متن ایمیل</Button>}
          {callCard?.linkedinMsg && <Button onClick={() => copy(callCard.linkedinMsg!, 'پیام لینکدین کپی شد.')}>کپی پیام لینکدین</Button>}
        </Stack>
      </Stack>

      {callCardQuery.isLoading ? (
        <Stack sx={{ minHeight: 260, alignItems: 'center', justifyContent: 'center' }} spacing={2}><CircularProgress /><Typography>در حال دریافت کال کارت...</Typography></Stack>
      ) : callCardQuery.isError ? (
        <Alert severity="error">خطا در دریافت کال کارت.</Alert>
      ) : callCard ? (
        <CallCardView callCard={callCard} />
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">هنوز کال کارتی برای این شرکت ثبت نشده است.</Typography>
          {canManage && <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}><Button variant="contained" onClick={() => openForm({})}>ایجاد کال کارت</Button><Button variant="outlined" onClick={getSuggestions}>دریافت پیشنهادات</Button></Stack>}
        </Paper>
      )}

      {canManage && <CallCardFormDialog key={formOpen ? JSON.stringify(formValues) : 'closed'} companyId={companyId} mode={callCard ? 'edit' : 'create'} initialValues={formValues} open={formOpen} onClose={() => setFormOpen(false)} />}
      {canManage && <CallCardSuggestionDialog open={suggestionOpen} suggestion={suggestionMutation.data} isLoading={suggestionMutation.isPending} isError={suggestionMutation.isError} onApply={applySuggestions} onClose={() => setSuggestionOpen(false)} />}
    </Stack>
  );
}
