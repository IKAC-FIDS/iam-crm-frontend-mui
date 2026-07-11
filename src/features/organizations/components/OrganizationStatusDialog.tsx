import { toast } from 'sonner';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useActivateOrganization, useSuspendOrganization } from '../hooks/useOrganizations';
import type { Organization } from '../types/organization.types';

export default function OrganizationStatusDialog({
  organization,
  action,
  open,
  onClose,
}: {
  organization: Organization;
  action: 'activate' | 'suspend';
  open: boolean;
  onClose: () => void;
}) {
  const activate = useActivateOrganization();
  const suspend = useSuspendOrganization();
  const pending = activate.isPending || suspend.isPending;
  const isActivate = action === 'activate';

  const submit = async () => {
    try {
      await (isActivate ? activate : suspend).mutateAsync(organization);
      toast.success(isActivate ? 'سازمان فعال شد.' : 'سازمان تعلیق شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, isActivate ? 'فعال‌سازی سازمان انجام نشد.' : 'تعلیق سازمان انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()}>
      <DialogTitle>{isActivate ? 'فعال‌سازی سازمان' : 'تعلیق سازمان'}</DialogTitle>
      <DialogContent>
        آیا از {isActivate ? 'فعال‌سازی' : 'تعلیق'} سازمان «{organization.name}» با کد «{organization.code}» مطمئن هستید؟
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" color={isActivate ? 'success' : 'warning'} onClick={submit} disabled={pending}>
          تأیید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
