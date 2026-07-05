import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { PERSON_CONTACT_TYPE_OPTIONS } from '../types/person.types';
import type {
  CreatePersonContactPayload,
  PersonContact,
  UpdatePersonContactPayload,
} from '../types/person.types';

interface PersonContactFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<PersonContact>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (
    values: CreatePersonContactPayload | UpdatePersonContactPayload,
  ) => Promise<void> | void;
  onCancel: () => void;
}

const contactTypes = PERSON_CONTACT_TYPE_OPTIONS.map((option) => option.value);
const schema = z.object({
  type: z.enum(contactTypes as [string, ...string[]]),
  value: z.string().trim().min(1, 'مقدار راه تماس الزامی است'),
  note: z.string(),
  isPrimary: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function PersonContactForm({
  mode,
  initialValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: PersonContactFormProps) {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: PERSON_CONTACT_TYPE_OPTIONS.some((item) => item.value === initialValues?.type)
        ? initialValues?.type as FormData['type']
        : 'MOBILE',
      value: initialValues?.value ?? '',
      note: initialValues?.note ?? '',
      isPrimary: initialValues?.isPrimary ?? false,
    },
  });

  useEffect(() => {
    reset({
      type: PERSON_CONTACT_TYPE_OPTIONS.some((item) => item.value === initialValues?.type)
        ? initialValues?.type as FormData['type']
        : 'MOBILE',
      value: initialValues?.value ?? '',
      note: initialValues?.note ?? '',
      isPrimary: initialValues?.isPrimary ?? false,
    });
  }, [initialValues, reset]);

  return (
    <Stack component="form" spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit((data) => onSubmit({
      type: data.type as CreatePersonContactPayload['type'],
      value: data.value.trim(),
      note: data.note.trim() || undefined,
      isPrimary: data.isPrimary,
    }))}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Controller name="type" control={control} render={({ field }) => (
        <FormControl fullWidth required>
          <InputLabel id="person-contact-type-label">نوع تماس</InputLabel>
          <Select {...field} labelId="person-contact-type-label" label="نوع تماس">
            {PERSON_CONTACT_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )} />
      <TextField required label="مقدار" error={Boolean(errors.value)} helperText={errors.value?.message} {...register('value')} />
      <TextField label="توضیح" {...register('note')} />
      <Controller name="isPrimary" control={control} render={({ field }) => (
        <FormControlLabel label="اصلی" control={<Switch checked={field.value} onChange={(_, value) => field.onChange(value)} />} />
      )} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ثبت...' : mode === 'create' ? 'ثبت راه تماس' : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}
