import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { Person } from '@/features/people/types/person.types';
import {
  MANUAL_ACTIVITY_TYPE_OPTIONS,
} from '../types/activity.types';
import type {
  CreateActivityPayload,
  ManualActivityType,
} from '../types/activity.types';

interface ActivityFormProps {
  companyId: string;
  people?: Person[];
  isPeopleLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreateActivityPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const manualActivityTypes = MANUAL_ACTIVITY_TYPE_OPTIONS.map((option) => option.value) as [
  ManualActivityType,
  ...ManualActivityType[],
];

const activityFormSchema = z.object({
  type: z.enum(manualActivityTypes, { error: 'نوع فعالیت الزامی است.' }),
  personId: z.string(),
  occurredAt: z.string(),
  notes: z.string(),
  outcome: z.string(),
  nextActionDate: z.string(),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

function optionalDate(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getPersonLabel(person: Person): string {
  const details = [person.title, person.department].filter(Boolean).join('، ');
  return details ? `${person.fullName} (${details})` : person.fullName;
}

export default function ActivityForm({
  companyId,
  people = [],
  isPeopleLoading = false,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: ActivityFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: 'CALL',
      personId: '',
      occurredAt: '',
      notes: '',
      outcome: '',
      nextActionDate: '',
    },
  });

  const submit = (data: ActivityFormData) => onSubmit({
    companyId,
    type: data.type,
    personId: optional(data.personId),
    occurredAt: optionalDate(data.occurredAt),
    notes: optional(data.notes),
    outcome: optional(data.outcome),
    nextActionDate: optionalDate(data.nextActionDate),
  });

  return (
    <Stack component="form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl required error={Boolean(errors.type)}>
            <InputLabel id="activity-type-label">نوع فعالیت</InputLabel>
            <Select {...field} labelId="activity-type-label" label="نوع فعالیت">
              {MANUAL_ACTIVITY_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
            {errors.type?.message && <FormHelperText>{errors.type.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="personId"
        control={control}
        render={({ field }) => (
          <FormControl disabled={isPeopleLoading}>
            <InputLabel id="activity-person-label">شخص مرتبط</InputLabel>
            <Select {...field} labelId="activity-person-label" label="شخص مرتبط">
              <MenuItem value="">بدون شخص مرتبط</MenuItem>
              {people.map((person) => (
                <MenuItem key={person.id} value={person.id}>{getPersonLabel(person)}</MenuItem>
              ))}
            </Select>
            {isPeopleLoading && <FormHelperText>در حال دریافت افراد شرکت...</FormHelperText>}
          </FormControl>
        )}
      />

      <TextField
        label="زمان انجام"
        type="datetime-local"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register('occurredAt')}
      />
      <TextField label="یادداشت" multiline minRows={3} {...register('notes')} />
      <TextField label="نتیجه" multiline minRows={2} {...register('outcome')} />
      <TextField
        label="تاریخ پیگیری بعدی"
        type="datetime-local"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register('nextActionDate')}
      />

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ثبت...' : 'ثبت فعالیت'}
        </Button>
      </Stack>
    </Stack>
  );
}
