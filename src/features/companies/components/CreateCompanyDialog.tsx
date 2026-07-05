import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useCreateCompany } from '../hooks/useCompanies';
import {
  COMPANY_PRIORITIES,
  companyPriorityLabels,
} from '../types/company.types';
import type { CreateCompanyPayload } from '../types/company.types';

interface CreateCompanyDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody {
  message?: string;
}

const createCompanySchema = z.object({
  legalName: z.string().trim().min(1, 'نام حقوقی الزامی است'),
  brandName: z.string(),
  industry: z.string(),
  priority: z.enum(COMPANY_PRIORITIES).or(z.literal('')),
  headOfficeCity: z.string(),
  website: z.string(),
  source: z.string(),
  ownerId: z.string(),
});

type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

const defaultValues: CreateCompanyFormData = {
  legalName: '',
  brandName: '',
  industry: '',
  priority: '',
  headOfficeCity: '',
  website: '',
  source: '',
  ownerId: '',
};

function optionalValue(value: string): string | undefined {
  return value.trim() || undefined;
}

export default function CreateCompanyDialog({ open, onClose }: CreateCompanyDialogProps) {
  const createCompany = useCreateCompany();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues,
  });

  const handleClose = () => {
    if (createCompany.isPending) return;
    reset(defaultValues);
    createCompany.reset();
    onClose();
  };

  const onSubmit = async (data: CreateCompanyFormData) => {
    const payload: CreateCompanyPayload = {
      legalName: data.legalName.trim(),
      brandName: optionalValue(data.brandName),
      industry: optionalValue(data.industry),
      priority: data.priority || undefined,
      headOfficeCity: optionalValue(data.headOfficeCity),
      website: optionalValue(data.website),
      source: optionalValue(data.source),
      ownerId: optionalValue(data.ownerId),
    };

    await createCompany.mutateAsync(payload);
    toast.success('شرکت با موفقیت افزوده شد.');
    reset(defaultValues);
    createCompany.reset();
    onClose();
  };

  const errorMessage = axios.isAxiosError<ApiErrorBody>(createCompany.error)
    ? createCompany.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>افزودن شرکت</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="create-company-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
          sx={{ pt: 1 }}
        >
          {createCompany.isError && (
            <Alert severity="error">
              {errorMessage || 'ایجاد شرکت با خطا مواجه شد.'}
            </Alert>
          )}

          <TextField
            autoFocus
            required
            label="نام حقوقی"
            error={Boolean(errors.legalName)}
            helperText={errors.legalName?.message}
            {...register('legalName')}
          />
          <TextField label="نام برند" {...register('brandName')} />
          <TextField label="صنعت" {...register('industry')} />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="create-company-priority-label">اولویت</InputLabel>
                <Select
                  {...field}
                  labelId="create-company-priority-label"
                  label="اولویت"
                >
                  <MenuItem value="">بدون اولویت</MenuItem>
                  {COMPANY_PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {companyPriorityLabels[priority]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <TextField label="شهر دفتر مرکزی" {...register('headOfficeCity')} />
          <TextField label="وب‌سایت" {...register('website')} />
          <TextField label="منبع" {...register('source')} />
          <TextField label="مالک" {...register('ownerId')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={createCompany.isPending}>
          انصراف
        </Button>
        <Button
          type="submit"
          form="create-company-form"
          variant="contained"
          disabled={createCompany.isPending}
        >
          {createCompany.isPending ? 'در حال ثبت...' : 'ثبت شرکت'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
