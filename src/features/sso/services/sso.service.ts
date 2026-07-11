import axiosInstance from '@/lib/axios';
import {
  unwrapApiResponse,
  unwrapPaginatedApiResponse,
  type ApiWrappedResponse,
} from '@/lib/apiResponse';
import type {
  CreateSsoProviderPayload,
  FindSsoProvidersParams,
  PublicSsoProvider,
  SsoExchangeRequest,
  SsoExchangeResponse,
  SsoProvider,
  SsoProviderPage,
  UpdateSsoProviderPayload,
} from '../types/sso.types';
import { redirectToSsoProvider } from '../utils/ssoRedirect';

function cleanObject<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== '')
  ) as Partial<T>;
}

function cleanPayload<T extends CreateSsoProviderPayload | UpdateSsoProviderPayload>(payload: T): T {
  return cleanObject({
    ...payload,
    name: payload.name?.trim(),
    displayName: payload.displayName?.trim(),
    issuer: payload.issuer?.trim(),
    clientId: payload.clientId?.trim(),
    clientSecret: payload.clientSecret?.trim(),
    authorizationUrl: payload.authorizationUrl?.trim(),
    tokenUrl: payload.tokenUrl?.trim(),
    userInfoUrl: payload.userInfoUrl?.trim(),
    jwksUrl: payload.jwksUrl?.trim(),
    entityId: payload.entityId?.trim(),
    ssoUrl: payload.ssoUrl?.trim(),
    x509Certificate: payload.x509Certificate?.trim(),
    emailAttribute: payload.emailAttribute?.trim(),
    nameAttribute: payload.nameAttribute?.trim(),
    groupsAttribute: payload.groupsAttribute?.trim(),
  }) as T;
}

export const ssoService = {
  listPublicProviders: async (): Promise<PublicSsoProvider[]> => {
    const response = await axiosInstance.get<ApiWrappedResponse<PublicSsoProvider[]>>('/auth/sso/providers');
    const data = unwrapApiResponse<PublicSsoProvider[] | { items?: PublicSsoProvider[] }>(response.data);
    return Array.isArray(data) ? data : data.items ?? [];
  },
  startLogin: (provider: PublicSsoProvider | SsoProvider): void => {
    redirectToSsoProvider(provider);
  },
  exchangeTicket: async (payload: SsoExchangeRequest): Promise<SsoExchangeResponse> => {
    const response = await axiosInstance.post<ApiWrappedResponse<SsoExchangeResponse>>('/auth/sso/exchange', payload);
    return unwrapApiResponse<SsoExchangeResponse>(response.data);
  },
  listProviders: async (params: FindSsoProvidersParams = {}): Promise<SsoProviderPage> =>
    unwrapPaginatedApiResponse<SsoProvider>(
      (await axiosInstance.get<unknown>('/admin/sso-providers', { params: cleanObject(params) })).data
    ),
  getProvider: async (id: string): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.get<unknown>(`/admin/sso-providers/${id}`)).data),
  createProvider: async (payload: CreateSsoProviderPayload): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.post<unknown>('/admin/sso-providers', cleanPayload(payload))).data),
  updateProvider: async (id: string, payload: UpdateSsoProviderPayload): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.patch<unknown>(`/admin/sso-providers/${id}`, cleanPayload(payload))).data),
  activateProvider: async (id: string): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.patch<unknown>(`/admin/sso-providers/${id}`, { isActive: true })).data),
  deactivateProvider: async (id: string): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.patch<unknown>(`/admin/sso-providers/${id}/disable`)).data),
  deleteProvider: async (id: string): Promise<SsoProvider> =>
    unwrapApiResponse<SsoProvider>((await axiosInstance.delete<unknown>(`/admin/sso-providers/${id}`)).data),
};
