import type { PaginatedResult } from '@/lib/apiResponse';

export const ssoProviderTypes = ['OIDC', 'SAML'] as const;
export type SsoProviderType = (typeof ssoProviderTypes)[number];

export const ssoProviderStatuses = ['ACTIVE', 'INACTIVE'] as const;
export type SsoProviderStatus = (typeof ssoProviderStatuses)[number];

export const ssoDefaultRoles = ['ADMIN', 'MANAGER', 'REP', 'BOARDS'] as const;
export type SsoDefaultRole = (typeof ssoDefaultRoles)[number];

export interface SsoProvider {
  id: string;
  name: string;
  type: SsoProviderType;
  displayName?: string | null;
  isActive?: boolean;
  status?: string;
  autoProvision: boolean;
  defaultRole?: SsoDefaultRole | null;
  allowedDomains: string[] | null;
  issuer?: string | null;
  clientId?: string | null;
  authorizationUrl?: string | null;
  tokenUrl?: string | null;
  userInfoUrl?: string | null;
  jwksUrl?: string | null;
  scopes?: string[] | null;
  entityId?: string | null;
  ssoUrl?: string | null;
  x509Certificate?: string | null;
  signRequests?: boolean;
  wantAssertionsSigned?: boolean;
  wantResponseSigned?: boolean;
  emailAttribute?: string | null;
  nameAttribute?: string | null;
  groupsAttribute?: string | null;
  hasClientSecret?: boolean;
  callbackUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSsoProvider {
  id: string;
  name: string;
  type: SsoProviderType;
  displayName?: string | null;
  isActive?: boolean;
}

export interface CreateSsoProviderPayload {
  name: string;
  type: SsoProviderType;
  displayName?: string;
  isActive?: boolean;
  autoProvision?: boolean;
  defaultRole?: SsoDefaultRole;
  allowedDomains?: string[];
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  jwksUrl?: string;
  scopes?: string[];
  entityId?: string;
  ssoUrl?: string;
  x509Certificate?: string;
  signRequests?: boolean;
  wantAssertionsSigned?: boolean;
  wantResponseSigned?: boolean;
  emailAttribute?: string;
  nameAttribute?: string;
  groupsAttribute?: string;
}

export type UpdateSsoProviderPayload = Partial<CreateSsoProviderPayload>;

export interface SsoExchangeRequest {
  ticket: string;
}

export interface SsoExchangeResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    team: string | null;
    permissions: string[];
    organizationId?: string | null;
  };
}

export interface FindSsoProvidersParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: SsoProviderType;
  active?: boolean | string;
}

export type SsoProviderPage = PaginatedResult<SsoProvider>;
