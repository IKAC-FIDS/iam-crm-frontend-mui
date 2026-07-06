import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import type { Person } from '@/features/people/types/person.types';
import type { Opportunity } from '@/features/opportunities/types/opportunity.types';
import { ACTIVITY_TYPE_OPTIONS, MANUAL_ACTIVITY_TYPE_OPTIONS } from '../types/activity.types';
import type { Activity, ActivityType } from '../types/activity.types';

export interface ActivityFormValues {
  type: ActivityType;
  personId: string | null;
  opportunityId: string | null;
  occurredAt: string | null;
  notes: string | null;
  outcome: string | null;
  nextActionDate: string | null;
}

interface ActivityFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<Activity>;
  people?: Person[];
  opportunities?: Opportunity[];
  isPeopleLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: ActivityFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const activityTypes = ACTIVITY_TYPE_OPTIONS.map((option) => option.value) as [ActivityType, ...ActivityType[]];
const schema = z.object({ type: z.enum(activityTypes), personId: z.string(), opportunityId: z.string(), occurredAt: z.string(), notes: z.string(), outcome: z.string(), nextActionDate: z.string() });
type FormData = z.infer<typeof schema>;

function toLocalDateTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function initial(value?: Partial<Activity>): FormData {
  return { type: value?.type ?? 'CALL', personId: value?.personId ?? '', opportunityId: value?.opportunityId ?? '', occurredAt: toLocalDateTime(value?.occurredAt), notes: value?.notes ?? '', outcome: value?.outcome ?? '', nextActionDate: toLocalDateTime(value?.nextActionDate) };
}

function nullable(value: string): string | null { return value.trim() || null; }
function nullableDate(value: string): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
function personLabel(person: Person): string { const details = [person.title, person.department].filter(Boolean).join('، '); return details ? `${person.fullName} (${details})` : person.fullName; }

export default function ActivityForm({ mode, initialValues, people = [], opportunities = [], isPeopleLoading = false, isSubmitting = false, errorMessage, onSubmit, onCancel }: ActivityFormProps) {
  const { control, handleSubmit, register, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: initial(initialValues) });
  const isStageChange = initialValues?.type === 'STAGE_CHANGE';
  const options = isStageChange ? ACTIVITY_TYPE_OPTIONS : MANUAL_ACTIVITY_TYPE_OPTIONS;
  const submit = (data: FormData) => onSubmit({ type: data.type, personId: nullable(data.personId), opportunityId: nullable(data.opportunityId), occurredAt: nullableDate(data.occurredAt), notes: nullable(data.notes), outcome: nullable(data.outcome), nextActionDate: nullableDate(data.nextActionDate) });
  return <Stack component="form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    <Controller name="type" control={control} render={({ field }) => <FormControl required disabled={isStageChange}><InputLabel id="activity-type-label">نوع فعالیت</InputLabel><Select {...field} labelId="activity-type-label" label="نوع فعالیت">{options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</Select>{errors.type?.message && <FormHelperText>{errors.type.message}</FormHelperText>}</FormControl>} />
    <Controller name="personId" control={control} render={({ field }) => <FormControl disabled={isPeopleLoading}><InputLabel id="activity-person-label">شخص مرتبط</InputLabel><Select {...field} labelId="activity-person-label" label="شخص مرتبط"><MenuItem value="">بدون شخص مرتبط</MenuItem>{people.map((person) => <MenuItem key={person.id} value={person.id}>{personLabel(person)}</MenuItem>)}</Select>{isPeopleLoading && <FormHelperText>در حال دریافت افراد شرکت...</FormHelperText>}</FormControl>} />
    {mode === 'create' && <Controller name="opportunityId" control={control} render={({ field }) => <FormControl><InputLabel id="activity-opportunity-label">فرصت مرتبط</InputLabel><Select {...field} labelId="activity-opportunity-label" label="فرصت مرتبط"><MenuItem value="">فعالیت سطح شرکت</MenuItem>{opportunities.map((item) => <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)}</Select></FormControl>} />}
    <TextField label="زمان انجام" type="datetime-local" slotProps={{ inputLabel: { shrink: true } }} {...register('occurredAt')} />
    <TextField label="یادداشت" multiline minRows={3} {...register('notes')} />
    <TextField label="نتیجه" multiline minRows={2} {...register('outcome')} />
    <TextField label="تاریخ پیگیری بعدی" type="datetime-local" slotProps={{ inputLabel: { shrink: true } }} {...register('nextActionDate')} />
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>{onCancel && <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>}<Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'در حال ثبت...' : mode === 'edit' ? 'ذخیره تغییرات' : 'ثبت فعالیت'}</Button></Stack>
  </Stack>;
}
