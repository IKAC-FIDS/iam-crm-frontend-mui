import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useActivateSsoProvider, useDeactivateSsoProvider, useDeleteSsoProvider } from '../hooks/useSsoProviders';
import { getSsoProviderDisplayName } from '../utils/ssoDisplay';
import type { SsoProvider } from '../types/sso.types';

export type SsoProviderAction = 'activate' | 'deactivate' | 'delete';

export default function SsoProviderStatusDialog({
  provider,
  action,
  open,
  onClose,
}: {
  provider: SsoProvider;
  action: SsoProviderAction;
  open: boolean;
  onClose: () => void;
}) {
  const activate = useActivateSsoProvider();
  const deactivate = useDeactivateSsoProvider();
  const remove = useDeleteSsoProvider();
  const pending = activate.isPending || deactivate.isPending || remove.isPending;
  const title = action === 'activate' ? 'فعال‌سازی ارائه‌دهنده' : action === 'deactivate' ? 'غیرفعال‌سازی ارائه‌دهنده' : 'حذف ارائه‌دهنده';

  const submit = async () => {
    try {
      if (action === 'activate') await activate.mutateAsync(provider);
      if (action === 'deactivate') await deactivate.mutateAsync(provider);
      if (action === 'delete') await remove.mutateAsync(provider);
      toast.success(action === 'activate' ? 'ارائه‌دهنده فعال شد.' : action === 'deactivate' ? 'ارائه‌دهنده غیرفعال شد.' : 'ارائه‌دهنده حذف شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'عملیات ارائه‌دهنده ورود سازمانی انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        آیا از انجام این عملیات برای «{getSsoProviderDisplayName(provider)}» مطمئن هستید؟
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button
          variant="contained"
          color={action === 'delete' ? 'error' : action === 'deactivate' ? 'warning' : 'success'}
          onClick={submit}
          disabled={pending}
        >
          تأیید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
