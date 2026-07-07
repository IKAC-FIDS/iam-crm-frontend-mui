import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Key } from '@mui/icons-material';
import { toast } from 'sonner';

import { passkeyErrorMessage } from '@/features/auth/utils/passkeyErrors';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { useDeletePasskey, usePasskeys, useRegisterPasskey } from '../hooks/usePasskeys';
import type { Passkey } from '../types/passkey.types';

function formatBoolean(value?: boolean | null) {
  if (value == null) return '—';
  return value ? 'بله' : 'خیر';
}

function formatTransports(value?: string[] | null) {
  return value?.length ? value.join(', ') : '—';
}

function registrationErrorMessage(error: unknown) {
  const message = passkeyErrorMessage(error);

  if (message === 'ورود با Passkey انجام نشد.') {
    return 'ثبت Passkey انجام نشد.';
  }

  return message;
}

function RegisterPasskeyDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [deviceName, setDeviceName] = useState('');
  const mutation = useRegisterPasskey();

  const close = () => {
    if (!mutation.isPending) {
      setDeviceName('');
      onClose();
    }
  };

  const submit = async () => {
    const name = deviceName.trim();

    if (!name) {
      return;
    }

    try {
      await mutation.mutateAsync(name);
      toast.success('Passkey با موفقیت ثبت شد.');
      close();
    } catch (error) {
      toast.error(registrationErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>ثبت Passkey جدید</DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <TextField
          fullWidth
          autoFocus
          label="نام دستگاه"
          value={deviceName}
          onChange={(event) => setDeviceName(event.target.value)}
          disabled={mutation.isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={mutation.isPending}>
          انصراف
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={mutation.isPending || !deviceName.trim()}
        >
          {mutation.isPending ? 'در حال بررسی Passkey...' : 'ثبت Passkey جدید'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PasskeyRow({ passkey }: { passkey: Passkey }) {
  const mutation = useDeletePasskey();

  const remove = async () => {
    try {
      await mutation.mutateAsync(passkey.id);
      toast.success('Passkey حذف شد.');
    } catch {
      toast.error('حذف Passkey انجام نشد.');
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 600 }}>
            {passkey.deviceName || 'کلید بدون نام'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {passkey.id}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{formatDateTime(passkey.createdAt)}</TableCell>
      <TableCell>
        {passkey.lastUsedAt ? formatDateTime(passkey.lastUsedAt) : 'هرگز استفاده نشده'}
      </TableCell>
      <TableCell>{formatTransports(passkey.transports)}</TableCell>
      <TableCell>
        <Chip size="small" label={formatBoolean(passkey.backedUp)} />
      </TableCell>
      <TableCell>{passkey.credentialDeviceType || '—'}</TableCell>
      <TableCell align="left">
        <Button
          color="error"
          size="small"
          startIcon={<Delete />}
          onClick={remove}
          disabled={mutation.isPending}
        >
          حذف
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function AccountSecurityPage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const passkeys = usePasskeys();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4">امنیت حساب</Typography>
            <Typography color="text.secondary">کلیدهای ورود / Passkeys</Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setRegisterOpen(true)}
          >
            ثبت Passkey جدید
          </Button>
        </Stack>

        {passkeys.isError && (
          <Alert severity="error">
            دریافت کلیدهای ورود انجام نشد.
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>نام دستگاه</TableCell>
                <TableCell>تاریخ ثبت</TableCell>
                <TableCell>آخرین استفاده</TableCell>
                <TableCell>transports</TableCell>
                <TableCell>backedUp</TableCell>
                <TableCell>credentialDeviceType</TableCell>
                <TableCell align="left">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passkeys.data?.map((passkey) => (
                <PasskeyRow key={passkey.id} passkey={passkey} />
              ))}

              {!passkeys.isLoading && !passkeys.data?.length && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Stack
                      spacing={1}
                      sx={{ alignItems: 'center', py: 4, color: 'text.secondary' }}
                    >
                      <Key />
                      <Typography>هنوز Passkey ثبت نشده است.</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {passkeys.isLoading && (
                <TableRow>
                  <TableCell colSpan={7}>در حال دریافت کلیدهای ورود...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <RegisterPasskeyDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </Box>
  );
}
