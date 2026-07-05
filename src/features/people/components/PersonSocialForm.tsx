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
import { PERSON_SOCIAL_PLATFORM_OPTIONS } from '../types/person.types';
import type {
  CreatePersonSocialPayload,
  PersonSocial,
  UpdatePersonSocialPayload,
} from '../types/person.types';

interface PersonSocialFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<PersonSocial>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (
    values: CreatePersonSocialPayload | UpdatePersonSocialPayload,
  ) => Promise<void> | void;
  onCancel: () => void;
}

const platforms = PERSON_SOCIAL_PLATFORM_OPTIONS.map((option) => option.value);
const schema = z.object({
  platform: z.enum(platforms as [string, ...string[]]),
  handle: z.string().trim().min(1, 'آدرس یا هندل الزامی است'),
  note: z.string(),
  isPrimary: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function PersonSocialForm({
  mode,
  initialValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: PersonSocialFormProps) {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: PERSON_SOCIAL_PLATFORM_OPTIONS.some((item) => item.value === initialValues?.platform)
        ? initialValues?.platform as FormData['platform']
        : 'LINKEDIN',
      handle: initialValues?.handle ?? '',
      note: initialValues?.note ?? '',
      isPrimary: initialValues?.isPrimary ?? false,
    },
  });

  useEffect(() => {
    reset({
      platform: PERSON_SOCIAL_PLATFORM_OPTIONS.some((item) => item.value === initialValues?.platform)
        ? initialValues?.platform as FormData['platform']
        : 'LINKEDIN',
      handle: initialValues?.handle ?? '',
      note: initialValues?.note ?? '',
      isPrimary: initialValues?.isPrimary ?? false,
    });
  }, [initialValues, reset]);

  return (
    <Stack component="form" spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit((data) => onSubmit({
      platform: data.platform as CreatePersonSocialPayload['platform'],
      handle: data.handle.trim(),
      note: data.note.trim() || undefined,
      isPrimary: data.isPrimary,
    }))}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Controller name="platform" control={control} render={({ field }) => (
        <FormControl fullWidth required>
          <InputLabel id="person-social-platform-label">پلتفرم</InputLabel>
          <Select {...field} labelId="person-social-platform-label" label="پلتفرم">
            {PERSON_SOCIAL_PLATFORM_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )} />
      <TextField required label="آدرس / هندل" error={Boolean(errors.handle)} helperText={errors.handle?.message} {...register('handle')} />
      <TextField label="توضیح" {...register('note')} />
      <Controller name="isPrimary" control={control} render={({ field }) => (
        <FormControlLabel label="اصلی" control={<Switch checked={field.value} onChange={(_, value) => field.onChange(value)} />} />
      )} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ثبت...' : mode === 'create' ? 'ثبت شبکه اجتماعی' : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}
