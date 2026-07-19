import { useState } from 'react';
import { toast } from 'sonner';
import {
  Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControlLabel, IconButton, Paper, Stack, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQueryClient } from '@tanstack/react-query';
import type { CompanyOption } from '@/features/companies/types/company.types';
import { CompanyAutocomplete } from '@/components/companies/CompanyAutocomplete';
import { getCompanyLabel } from '@/features/companies/utils/companyOption';
import { getApiErrorMessage } from '@/lib/apiResponse';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { formatJalaliDate } from '@/shared/utils/jalaliDate';
import { createClientId } from '@/shared/utils/createClientId';
import {
  useCreatePersonEmploymentHistory,
  useCreatePersonEmploymentPosition,
  useDeletePersonEmploymentHistory,
  useDeletePersonEmploymentPosition,
  usePersonEmploymentHistory,
  useUpdatePersonEmploymentHistory,
  useUpdatePersonEmploymentPosition,
} from '../hooks/usePeople';
import { peopleService } from '../services/people.service';
import type {
  CreatePersonEmploymentPositionPayload,
  PersonEmploymentHistory,
  PersonEmploymentPosition,
} from '../types/person.types';

type PositionDraft = CreatePersonEmploymentPositionPayload & { clientTempId: string };
const emptyPosition = (): PositionDraft => ({
  clientTempId: createClientId('employment-position'),
  title: '',
  isCurrent: false,
});

function PositionFields({
  value,
  onChange,
  onRemove,
  showRemove,
  error,
}: {
  value: PositionDraft;
  onChange: (value: PositionDraft) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  error?: string;
}) {
  const dateError = value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate)
    ? 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.' : undefined;
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">سمت</Typography>
          {showRemove && <IconButton size="small" color="error" aria-label="حذف سمت" onClick={onRemove}><DeleteIcon /></IconButton>}
        </Stack>
        <TextField required label="سمت" value={value.title} error={Boolean(error)} helperText={error}
          onChange={(event) => onChange({ ...value, title: event.target.value })} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <JalaliDateField fullWidth label="تاریخ شروع" value={value.startDate}
            onChange={(next) => onChange({ ...value, startDate: next })} />
          <JalaliDateField fullWidth label="تاریخ پایان" value={value.endDate} disabled={value.isCurrent}
            error={Boolean(dateError)} helperText={dateError}
            onChange={(next) => onChange({ ...value, endDate: next })} />
        </Stack>
        <FormControlLabel control={<Checkbox checked={Boolean(value.isCurrent)} onChange={(_, checked) =>
          onChange({ ...value, isCurrent: checked, endDate: checked ? undefined : value.endDate })} />} label="سمت فعلی" />
        <TextField label="توضیحات" multiline minRows={2} value={value.description ?? ''}
          onChange={(event) => onChange({ ...value, description: event.target.value })} />
      </Stack>
    </Paper>
  );
}

function EmploymentDialog({ personId, item, onClose }: {
  personId: string;
  item?: PersonEmploymentHistory;
  onClose: () => void;
}) {
  const initialCompany = item?.company
    ? { id: item.company.id, legalName: item.company.legalName, brandName: item.company.brandName } as CompanyOption
    : null;
  const [company, setCompany] = useState<CompanyOption | null>(initialCompany);
  const [description, setDescription] = useState(item?.description ?? '');
  const [positions, setPositions] = useState<PositionDraft[]>(item ? [] : [emptyPosition()]);
  const [attempted, setAttempted] = useState(false);
  const create = useCreatePersonEmploymentHistory(personId);
  const update = useUpdatePersonEmploymentHistory(personId, item?.id ?? '');
  const queryClient = useQueryClient();
  const invalidPositions = positions.some((position) => !position.title.trim()
    || Boolean(position.startDate && position.endDate && new Date(position.endDate) < new Date(position.startDate)));
  const pending = create.isPending || update.isPending;

  const submit = async () => {
    setAttempted(true);
    if (!company || invalidPositions) return;
    try {
      if (item) {
        await update.mutateAsync({ companyId: company.id, description: description.trim() || undefined });
        toast.success('سابقه شغلی بروزرسانی شد.');
      } else {
        const created = await create.mutateAsync({ companyId: company.id, description: description.trim() || undefined });
        if (positions.length) {
          await Promise.all(positions.map((position) => peopleService.createPersonEmploymentPosition(personId, created.id, {
            title: position.title.trim(), startDate: position.startDate, endDate: position.endDate,
            isCurrent: position.isCurrent, description: position.description?.trim() || undefined,
          })));
          await queryClient.invalidateQueries({ queryKey: ['people', 'detail', personId] });
        }
        toast.success('سابقه شغلی ایجاد شد.');
      }
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره سابقه شغلی انجام نشد.'));
    }
  };

  return (
    <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="md">
      <DialogTitle>{item ? 'ویرایش سابقه شغلی' : 'افزودن سابقه شغلی'}</DialogTitle>
      <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
        {(create.isError || update.isError) && <Alert severity="error">ذخیره سابقه شغلی با خطا مواجه شد.</Alert>}
        <CompanyAutocomplete value={company} onChange={setCompany} required label="شرکت"
          error={attempted && !company} helperText={attempted && !company ? 'انتخاب شرکت الزامی است.' : undefined} />
        <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
        {!item && <>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">سمت‌ها</Typography>
            <Button startIcon={<AddIcon />} onClick={() => setPositions((current) => [...current, emptyPosition()])}>افزودن سمت</Button>
          </Stack>
          {positions.map((position) => <PositionFields key={position.clientTempId} value={position}
            error={attempted && !position.title.trim() ? 'عنوان سمت الزامی است.' : undefined}
            showRemove={positions.length > 1} onRemove={() => setPositions((current) => current.filter(({ clientTempId }) => clientTempId !== position.clientTempId))}
            onChange={(next) => setPositions((current) => current.map((entry) => entry.clientTempId === next.clientTempId ? next : entry))} />)}
        </>}
      </Stack></DialogContent>
      <DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button></DialogActions>
    </Dialog>
  );
}

function PositionDialog({ personId, employmentId, item, onClose }: {
  personId: string; employmentId: string; item?: PersonEmploymentPosition; onClose: () => void;
}) {
  const [value, setValue] = useState<PositionDraft>({ clientTempId: item?.id ?? createClientId('employment-position'), title: item?.title ?? '',
    startDate: item?.startDate ?? undefined, endDate: item?.endDate ?? undefined, isCurrent: item?.isCurrent,
    description: item?.description ?? undefined });
  const [attempted, setAttempted] = useState(false);
  const create = useCreatePersonEmploymentPosition(personId, employmentId);
  const update = useUpdatePersonEmploymentPosition(personId, employmentId, item?.id ?? '');
  const pending = create.isPending || update.isPending;
  const submit = async () => {
    setAttempted(true);
    if (!value.title.trim() || (value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate))) return;
    const payload = { title: value.title.trim(), startDate: value.startDate, endDate: value.endDate,
      isCurrent: value.isCurrent, description: value.description?.trim() || undefined };
    try {
      if (item) await update.mutateAsync(payload); else await create.mutateAsync(payload);
      toast.success(item ? 'سمت بروزرسانی شد.' : 'سمت افزوده شد.'); onClose();
    } catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره سمت انجام نشد.')); }
  };
  return <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
    <DialogTitle>{item ? 'ویرایش سمت' : 'افزودن سمت'}</DialogTitle><DialogContent sx={{ pt: '12px !important' }}>
      <PositionFields value={value} onChange={setValue} error={attempted && !value.title.trim() ? 'عنوان سمت الزامی است.' : undefined} />
    </DialogContent><DialogActions><Button onClick={onClose}>انصراف</Button><Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button></DialogActions>
  </Dialog>;
}

export default function PersonEmploymentHistorySection({ personId, canManage }: { personId: string; canManage: boolean }) {
  const query = usePersonEmploymentHistory(personId);
  const removeEmployment = useDeletePersonEmploymentHistory(personId);
  const [formItem, setFormItem] = useState<PersonEmploymentHistory | null | undefined>();
  const [positionTarget, setPositionTarget] = useState<{ employmentId: string; position?: PersonEmploymentPosition }>();
  const [deletingEmployment, setDeletingEmployment] = useState<PersonEmploymentHistory>();
  const [deletingPosition, setDeletingPosition] = useState<{ employmentId: string; position: PersonEmploymentPosition }>();
  const removePosition = useDeletePersonEmploymentPosition(personId, deletingPosition?.employmentId ?? '');

  const confirmEmploymentDelete = async () => {
    if (!deletingEmployment) return;
    try { await removeEmployment.mutateAsync(deletingEmployment.id); toast.success('سابقه شغلی حذف شد.'); setDeletingEmployment(undefined); }
    catch (error) { toast.error(getApiErrorMessage(error, 'حذف سابقه شغلی انجام نشد.')); }
  };
  const confirmPositionDelete = async () => {
    if (!deletingPosition) return;
    try { await removePosition.mutateAsync(deletingPosition.position.id); toast.success('سمت حذف شد.'); setDeletingPosition(undefined); }
    catch (error) { toast.error(getApiErrorMessage(error, 'حذف سمت انجام نشد.')); }
  };

  return <Paper variant="outlined" sx={{ p: 2 }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6">سوابق شغلی</Typography>
      {canManage && <Button size="small" onClick={() => setFormItem(null)}>افزودن سابقه شغلی</Button>}
    </Stack>
    {query.isLoading ? <Typography>در حال دریافت...</Typography> : query.isError ? <Alert severity="error">خطا در دریافت سوابق شغلی.</Alert>
      : !query.data?.length ? <Typography color="text.secondary">سابقه شغلی ثبت نشده است.</Typography>
        : <Stack spacing={2}>{query.data.map((employment) => <Paper key={employment.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box><Typography sx={{ fontWeight: 700 }}>{getCompanyLabel(employment.company) || 'شرکت'}</Typography>
              {employment.description && <Typography variant="body2" color="text.secondary">{employment.description}</Typography>}</Box>
            {canManage && <Box><IconButton size="small" aria-label="ویرایش سابقه شغلی" onClick={() => setFormItem(employment)}><EditIcon /></IconButton>
              <IconButton size="small" color="error" aria-label="حذف سابقه شغلی" onClick={() => setDeletingEmployment(employment)}><DeleteIcon /></IconButton></Box>}
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}><Typography variant="subtitle2">سمت‌ها</Typography>
            {canManage && <Button size="small" startIcon={<AddIcon />} onClick={() => setPositionTarget({ employmentId: employment.id })}>افزودن سمت</Button>}</Stack>
          {!employment.positions?.length ? <Typography variant="body2" color="text.secondary">سمتی ثبت نشده است.</Typography>
            : <Stack spacing={1} sx={{ mt: 1 }}>{employment.positions.map((position) => <Box key={position.id} sx={{ borderInlineStart: 3, borderColor: 'primary.main', ps: 1.5 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Box><Typography sx={{ fontWeight: 600 }}>{position.title}</Typography>
                <Typography variant="body2" color="text.secondary">تاریخ شروع: {formatJalaliDate(position.startDate)} | تاریخ پایان: {position.isCurrent ? 'سمت فعلی' : formatJalaliDate(position.endDate)}</Typography>
                {position.description && <Typography variant="body2">{position.description}</Typography>}</Box>
                {canManage && <Box><IconButton size="small" aria-label="ویرایش سمت" onClick={() => setPositionTarget({ employmentId: employment.id, position })}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" aria-label="حذف سمت" onClick={() => setDeletingPosition({ employmentId: employment.id, position })}><DeleteIcon fontSize="small" /></IconButton></Box>}</Stack>
            </Box>)}</Stack>}
        </Paper>)}</Stack>}
    {formItem !== undefined && <EmploymentDialog personId={personId} item={formItem ?? undefined} onClose={() => setFormItem(undefined)} />}
    {positionTarget && <PositionDialog personId={personId} employmentId={positionTarget.employmentId} item={positionTarget.position} onClose={() => setPositionTarget(undefined)} />}
    <Dialog open={Boolean(deletingEmployment)} onClose={() => setDeletingEmployment(undefined)}><DialogTitle>حذف سابقه شغلی</DialogTitle><DialogContent><Typography>آیا از حذف سابقه شغلی و همه سمت‌های آن مطمئن هستید؟</Typography></DialogContent><DialogActions><Button onClick={() => setDeletingEmployment(undefined)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmEmploymentDelete} disabled={removeEmployment.isPending}>حذف</Button></DialogActions></Dialog>
    <Dialog open={Boolean(deletingPosition)} onClose={() => setDeletingPosition(undefined)}><DialogTitle>حذف سمت</DialogTitle><DialogContent><Typography>آیا از حذف این سمت مطمئن هستید؟</Typography></DialogContent><DialogActions><Button onClick={() => setDeletingPosition(undefined)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmPositionDelete} disabled={removePosition.isPending}>حذف</Button></DialogActions></Dialog>
  </Paper>;
}
