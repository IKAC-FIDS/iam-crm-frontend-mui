import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { COMPANY_SOCIAL_PLATFORM_OPTIONS } from '../types/companySocialChannel.types';
import type { CompanySocialChannel, CompanySocialPlatform, CreateCompanySocialChannelPayload, UpdateCompanySocialChannelPayload } from '../types/companySocialChannel.types';

interface Props {
  mode: 'create' | 'edit';
  initialValues?: Partial<CompanySocialChannel>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreateCompanySocialChannelPayload | UpdateCompanySocialChannelPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const platforms = COMPANY_SOCIAL_PLATFORM_OPTIONS.map((option) => option.value) as [CompanySocialPlatform, ...CompanySocialPlatform[]];
const schema = z.object({
  platform: z.enum(platforms, { error: 'پلتفرم الزامی است.' }),
  handle: z.string().trim().min(1, 'آدرس یا هندل الزامی است.'),
});
type FormData = z.infer<typeof schema>;

export default function CompanySocialChannelForm({ mode, initialValues, isSubmitting = false, errorMessage, onSubmit, onCancel }: Props) {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platform: initialValues?.platform ?? 'LINKEDIN', handle: initialValues?.handle ?? '' },
  });

  useEffect(() => reset({ platform: initialValues?.platform ?? 'LINKEDIN', handle: initialValues?.handle ?? '' }), [initialValues, reset]);

  return (
    <Stack component="form" onSubmit={handleSubmit((data) => onSubmit({ platform: data.platform, handle: data.handle.trim() }))} spacing={2} sx={{ pt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Controller name="platform" control={control} render={({ field }) => (
        <FormControl required error={Boolean(errors.platform)}>
          <InputLabel id="company-social-platform-label">پلتفرم</InputLabel>
          <Select {...field} labelId="company-social-platform-label" label="پلتفرم">
            {COMPANY_SOCIAL_PLATFORM_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
          </Select>
          {errors.platform?.message && <FormHelperText>{errors.platform.message}</FormHelperText>}
        </FormControl>
      )} />
      <TextField required autoFocus label="آدرس / هندل" error={Boolean(errors.handle)} helperText={errors.handle?.message} {...register('handle')} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>}
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'در حال ثبت...' : mode === 'create' ? 'افزودن کانال' : 'ذخیره تغییرات'}</Button>
      </Stack>
    </Stack>
  );
}
