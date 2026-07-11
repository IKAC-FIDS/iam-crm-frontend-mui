import { Alert, Button, Divider, Stack, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ssoService } from '../services/sso.service';
import { usePublicSsoProviders } from '../hooks/useSsoProviders';
import { getSsoProviderDisplayName } from '../utils/ssoDisplay';

export default function SsoLoginButtons({ disabled = false }: { disabled?: boolean }) {
  const providers = usePublicSsoProviders();
  const items = providers.data ?? [];

  if (providers.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        در حال دریافت ارائه‌دهنده‌های ورود سازمانی...
      </Typography>
    );
  }

  if (providers.isError) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        دریافت ارائه‌دهنده‌های ورود سازمانی انجام نشد.
      </Alert>
    );
  }

  if (!items.length) return null;

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Divider>
        <Typography variant="caption" color="text.secondary">
          یا ورود با حساب سازمانی
        </Typography>
      </Divider>
      <Stack spacing={1}>
        {items.map((provider) => (
          <Button
            key={provider.id}
            fullWidth
            type="button"
            variant="outlined"
            startIcon={<LoginIcon />}
            disabled={disabled}
            onClick={() => ssoService.startLogin(provider)}
          >
            ورود با {getSsoProviderDisplayName(provider)}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
