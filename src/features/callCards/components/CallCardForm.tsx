import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type {
  CallCard,
  CallCardPerson,
  UpsertCallCardPayload,
} from '../types/callCard.types';

interface CallCardFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<CallCard>;
  people?: CallCardPerson[];
  isPeopleLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: UpsertCallCardPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const formSchema = z.object({
  primaryContactId: z.string(),
  secondaryContactId: z.string(),
  entryAngle: z.string(),
  painPoint: z.string(),
  useCase: z.string(),
  openingLine: z.string(),
  firstEmail: z.string(),
  linkedinMsg: z.string(),
  discoveryQs: z.array(z.object({ question: z.string() })),
  objections: z.array(z.object({ objection: z.string(), response: z.string() })),
  meetingAsk: z.string(),
  callGoal: z.string(),
  qualificationCriteria: z.string(),
  disqualificationCriteria: z.string(),
  followUpNoResponseAt: z.string(),
  followUpInterestAt: z.string(),
});

type FormData = z.infer<typeof formSchema>;

function toLocalDateTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getValues(value?: Partial<CallCard>): FormData {
  return {
    primaryContactId: value?.primaryContactId ?? '',
    secondaryContactId: value?.secondaryContactId ?? '',
    entryAngle: value?.entryAngle ?? '',
    painPoint: value?.painPoint ?? '',
    useCase: value?.useCase ?? '',
    openingLine: value?.openingLine ?? '',
    firstEmail: value?.firstEmail ?? '',
    linkedinMsg: value?.linkedinMsg ?? '',
    discoveryQs: value?.discoveryQs?.length ? value.discoveryQs : [],
    objections: value?.objections?.length ? value.objections : [],
    meetingAsk: value?.meetingAsk ?? '',
    callGoal: value?.callGoal ?? '',
    qualificationCriteria: value?.qualificationCriteria ?? '',
    disqualificationCriteria: value?.disqualificationCriteria ?? '',
    followUpNoResponseAt: toLocalDateTime(value?.followUpNoResponseAt),
    followUpInterestAt: toLocalDateTime(value?.followUpInterestAt),
  };
}

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

function optionalDate(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function personLabel(person: CallCardPerson): string {
  return [person.fullName, person.jobTitle ?? person.title, person.department].filter(Boolean).join(' - ');
}

function normalizeQuestions(items: FormData['discoveryQs']) {
  const result = items
    .map(({ question }) => ({ question: question.trim() }))
    .filter(({ question }) => Boolean(question));
  return result.length ? result : undefined;
}

function normalizeObjections(items: FormData['objections']) {
  const result = items
    .map(({ objection, response }) => ({ objection: objection.trim(), response: response.trim() }))
    .filter(({ objection, response }) => Boolean(objection || response));
  return result.length ? result : undefined;
}

export default function CallCardForm({
  mode,
  initialValues,
  people = [],
  isPeopleLoading = false,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: CallCardFormProps) {
  const { control, handleSubmit, register, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getValues(initialValues),
  });
  const questions = useFieldArray({ control, name: 'discoveryQs' });
  const objections = useFieldArray({ control, name: 'objections' });

  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);

  const submit = (data: FormData) => onSubmit({
    primaryContactId: data.primaryContactId || null,
    secondaryContactId: data.secondaryContactId || null,
    entryAngle: optional(data.entryAngle),
    painPoint: optional(data.painPoint),
    useCase: optional(data.useCase),
    openingLine: optional(data.openingLine),
    firstEmail: optional(data.firstEmail),
    linkedinMsg: optional(data.linkedinMsg),
    discoveryQs: normalizeQuestions(data.discoveryQs),
    objections: normalizeObjections(data.objections),
    meetingAsk: optional(data.meetingAsk),
    callGoal: optional(data.callGoal),
    qualificationCriteria: optional(data.qualificationCriteria),
    disqualificationCriteria: optional(data.disqualificationCriteria),
    followUpNoResponseAt: optionalDate(data.followUpNoResponseAt),
    followUpInterestAt: optionalDate(data.followUpInterestAt),
  });

  return (
    <Stack component="form" onSubmit={handleSubmit(submit)} spacing={3} sx={{ pt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Typography variant="h6">مخاطبان</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {(['primaryContactId', 'secondaryContactId'] as const).map((name, index) => (
          <Controller key={name} name={name} control={control} render={({ field }) => (
            <FormControl fullWidth disabled={isPeopleLoading}>
              <InputLabel id={`${name}-label`}>{index === 0 ? 'مخاطب اصلی' : 'مخاطب دوم'}</InputLabel>
              <Select {...field} labelId={`${name}-label`} label={index === 0 ? 'مخاطب اصلی' : 'مخاطب دوم'}>
                <MenuItem value="">انتخاب نشده</MenuItem>
                {people.map((person) => <MenuItem key={person.id} value={person.id}>{personLabel(person)}</MenuItem>)}
              </Select>
            </FormControl>
          )} />
        ))}
      </Stack>

      <Divider />
      <Typography variant="h6">استراتژی</Typography>
      <TextField label="زاویه ورود" multiline minRows={2} {...register('entryAngle')} />
      <TextField label="نقطه درد" multiline minRows={3} {...register('painPoint')} />
      <TextField label="کاربرد پیشنهادی" multiline minRows={3} {...register('useCase')} />
      <TextField label="هدف تماس" multiline minRows={2} {...register('callGoal')} />

      <Divider />
      <Typography variant="h6">متن‌های شروع ارتباط</Typography>
      <TextField label="جمله شروع تماس" multiline minRows={3} {...register('openingLine')} />
      <TextField label="متن ایمیل اول" multiline minRows={5} {...register('firstEmail')} />
      <TextField label="پیام لینکدین" multiline minRows={4} {...register('linkedinMsg')} />

      <Divider />
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">سؤالات کشف نیاز</Typography>
        <Button onClick={() => questions.append({ question: '' })}>افزودن سؤال</Button>
      </Stack>
      {questions.fields.map((field, index) => (
        <Stack key={field.id} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <TextField fullWidth label={`سؤال ${index + 1}`} {...register(`discoveryQs.${index}.question`)} />
          <Button color="error" onClick={() => questions.remove(index)}>حذف سؤال</Button>
        </Stack>
      ))}

      <Divider />
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">اعتراض‌ها و پاسخ‌ها</Typography>
        <Button onClick={() => objections.append({ objection: '', response: '' })}>افزودن اعتراض</Button>
      </Stack>
      {objections.fields.map((field, index) => (
        <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField label="اعتراض" multiline minRows={2} {...register(`objections.${index}.objection`)} />
            <TextField label="پاسخ پیشنهادی" multiline minRows={2} {...register(`objections.${index}.response`)} />
            <Button color="error" sx={{ alignSelf: 'flex-end' }} onClick={() => objections.remove(index)}>حذف اعتراض</Button>
          </Stack>
        </Paper>
      ))}

      <Divider />
      <Typography variant="h6">ارزیابی صلاحیت</Typography>
      <TextField label="معیارهای احراز" multiline minRows={3} {...register('qualificationCriteria')} />
      <TextField label="معیارهای رد صلاحیت" multiline minRows={3} {...register('disqualificationCriteria')} />

      <Divider />
      <Typography variant="h6">پیگیری</Typography>
      <TextField label="درخواست جلسه" multiline minRows={2} {...register('meetingAsk')} />
      <TextField label="پیگیری در صورت عدم پاسخ" type="datetime-local" slotProps={{ inputLabel: { shrink: true } }} {...register('followUpNoResponseAt')} />
      <TextField label="پیگیری در صورت علاقه‌مندی" type="datetime-local" slotProps={{ inputLabel: { shrink: true } }} {...register('followUpInterestAt')} />

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ذخیره...' : mode === 'create' ? 'ایجاد کال کارت' : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}
