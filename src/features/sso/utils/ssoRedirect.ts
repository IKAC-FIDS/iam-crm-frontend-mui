import type { PublicSsoProvider, SsoProvider } from '../types/sso.types';

function apiBaseUrl(): string {
  return (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
}

export function buildSsoLoginUrl(provider: PublicSsoProvider | SsoProvider): string {
  const encodedId = encodeURIComponent(provider.id);
  const path = provider.type === 'SAML'
    ? `auth/saml/${encodedId}/login`
    : `auth/oidc/${encodedId}/login`;

  return `${apiBaseUrl()}/${path}`;
}

export function redirectToSsoProvider(provider: PublicSsoProvider | SsoProvider): void {
  window.location.assign(buildSsoLoginUrl(provider));
}
