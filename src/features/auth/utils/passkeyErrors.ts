import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
}

export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (['AbortError', 'NotAllowedError'].includes(error.name)) {
      return 'عملیات توسط کاربر لغو شد.';
    }

    if (error.name === 'NotSupportedError' || error.name === 'SecurityError') {
      return 'مرورگر یا دستگاه شما از Passkey پشتیبانی نمی‌کند.';
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('not supported') || message.includes('webauthn')) {
      return 'مرورگر یا دستگاه شما از Passkey پشتیبانی نمی‌کند.';
    }

    if (message.includes('cancel') || message.includes('notallowed')) {
      return 'عملیات توسط کاربر لغو شد.';
    }
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    if (status === 400 || status === 404 || status === 410) {
      return backendMessage || 'چالش Passkey منقضی شده است. دوباره تلاش کنید.';
    }

    if (status === 401 || status === 403) {
      return backendMessage || 'ورود با Passkey انجام نشد.';
    }

    return backendMessage || 'ورود با Passkey انجام نشد.';
  }

  return 'ورود با Passkey انجام نشد.';
}
