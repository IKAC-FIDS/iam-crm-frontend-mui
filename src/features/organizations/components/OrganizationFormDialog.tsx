import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateOrganization, useUpdateOrganization } from '../hooks/useOrganizations';
import { organizationStatusOptions } from '../utils/organizationDisplay';
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationStatus,
  UpdateOrganizationPayload,
} from '../types/organization.types';

const codePattern = /^[a-z0-9_-]+$/;

function stringifySettings(settings?: Record<string, unknown> | null): string {
  if (!settings) return '';
  return JSON.stringify(settings, null, 2);
}

function parseSettings(value: string): Record<string, unknown> | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = JSON.parse(trimmed) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('settings must be an object');
  }
  return parsed as Record<string, unknown>;
}

export default function OrganizationFormDialog({
  organization,
  open,
  onClose,
}: {
  organization?: Organization | null;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateOrganization();
  const update = useUpdateOrganization();
  const [code, setCode] = useState(organization?.code ?? '');
  const [name, setName] = useState(organization?.name ?? '');
  const [status, setStatus] = useState<OrganizationStatus>(organization?.status ?? 'ACTIVE');
  const [timezone, setTimezone] = useState(organization?.timezone ?? 'Asia/Tehran');
  const [locale, setLocale] = useState(organization?.locale ?? 'fa-IR');
  const [settings, setSettings] = useState(stringifySettings(organization?.settings));
  const [settingsError, setSettingsError] = useState('');
  const pending = create.isPending || update.isPending;
  const isEdit = Boolean(organization);

  const codeError = useMemo(() => {
    if (!code.trim()) return 'کد سازمان الزامی است.';
    if (!codePattern.test(code.trim())) return 'کد فقط می‌تواند شامل حروف کوچک انگلیسی، عدد، خط تیره و زیرخط باشد.';
    return '';
  }, [code]);

  const submit = async () => {
    setSettingsError('');
    if (codeError || !name.trim()) return;

    let parsedSettings: Record<string, unknown> | undefined;
    try {
      parsedSettings = parseSettings(settings);
    } catch {
      setSettingsError('تنظیمات باید یک JSON معتبر از نوع object باشد.');
      return;
    }

    try {
      if (organization) {
        const payload: UpdateOrganizationPayload = {
          name: name.trim(),
          status,
          timezone: timezone.trim() || undefined,
          locale: locale.trim() || undefined,
          settings: parsedSettings,
        };
        await update.mutateAsync({ id: organization.id, payload });
      } else {
        const payload: CreateOrganizationPayload = {
          code: code.trim(),
          name: name.trim(),
          status,
          timezone: timezone.trim() || 'Asia/Tehran',
          locale: locale.trim() || 'fa-IR',
          settings: parsedSettings,
        };
        await create.mutateAsync(payload);
      }
      toast.success(organization ? 'سازمان بروزرسانی شد.' : 'سازمان ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, organization ? 'بروزرسانی سازمان انجام نشد.' : 'ایجاد سازمان انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{organization ? 'ویرایش سازمان' : 'ایجاد سازمان'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">ذخیره سازمان با خطا مواجه شد.</Alert>}
          <TextField
            required
            label="کد"
            value={code}
            disabled={isEdit}
            onChange={(event) => setCode(event.target.value)}
            error={Boolean(codeError)}
            helperText={isEdit ? 'کد سازمان پس از ایجاد قابل ویرایش نیست.' : codeError || 'نمونه: acme_tehran'}
          />
          <TextField required label="نام" value={name} onChange={(event) => setName(event.target.value)} />
          <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as OrganizationStatus)}>
            {organizationStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <TextField label="منطقه زمانی" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
          <TextField label="زبان/محلی‌سازی" value={locale} onChange={(event) => setLocale(event.target.value)} />
          <TextField
            label="تنظیمات JSON"
            value={settings}
            onChange={(event) => setSettings(event.target.value)}
            multiline
            minRows={4}
            error={Boolean(settingsError)}
            helperText={settingsError || 'اختیاری؛ فقط یک object معتبر وارد کنید.'}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={Boolean(codeError) || !name.trim() || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
