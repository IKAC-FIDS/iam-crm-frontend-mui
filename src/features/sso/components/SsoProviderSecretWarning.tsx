import { Alert } from '@mui/material';

export default function SsoProviderSecretWarning() {
  return (
    <Alert severity="info">
      کلیدها، رمزهای محرمانه و گواهی‌ها اطلاعات حساس هستند. مقدار ذخیره‌شده نمایش داده نمی‌شود و فقط در صورت ورود مقدار جدید ارسال می‌شود.
    </Alert>
  );
}
