import axiosInstance from '@/lib/axios';
import {
  unwrapApiResponse,
  unwrapPaginatedApiResponse,
  type ApiWrappedResponse,
  type PaginatedResult,
} from '@/lib/apiResponse';
import type {
  CreateOrganizationPayload,
  CurrentOrganizationResponse,
  FindOrganizationsParams,
  Organization,
  UpdateOrganizationPayload,
} from '../types/organization.types';

function cleanObject<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== '')
  ) as Partial<T>;
}

function cleanPayload<T extends CreateOrganizationPayload | UpdateOrganizationPayload>(payload: T): T {
  return cleanObject({
    ...payload,
    code: payload.code?.trim(),
    name: payload.name?.trim(),
    timezone: payload.timezone?.trim(),
    locale: payload.locale?.trim(),
  }) as T;
}

export const organizationsService = {
  getCurrent: async (): Promise<CurrentOrganizationResponse> => {
    const response = await axiosInstance.get<ApiWrappedResponse<CurrentOrganizationResponse>>(
      '/organizations/current'
    );
    return unwrapApiResponse<CurrentOrganizationResponse>(response.data);
  },
  list: async (params: FindOrganizationsParams = {}): Promise<PaginatedResult<Organization>> =>
    unwrapPaginatedApiResponse<Organization>(
      (await axiosInstance.get<unknown>('/admin/organizations', { params: cleanObject(params) })).data
    ),
  get: async (id: string): Promise<Organization> =>
    unwrapApiResponse<Organization>((await axiosInstance.get<unknown>(`/admin/organizations/${id}`)).data),
  create: async (payload: CreateOrganizationPayload): Promise<Organization> =>
    unwrapApiResponse<Organization>((await axiosInstance.post<unknown>('/admin/organizations', cleanPayload(payload))).data),
  update: async (id: string, payload: UpdateOrganizationPayload): Promise<Organization> =>
    unwrapApiResponse<Organization>((await axiosInstance.patch<unknown>(`/admin/organizations/${id}`, cleanPayload(payload))).data),
  activate: async (id: string): Promise<Organization> =>
    unwrapApiResponse<Organization>((await axiosInstance.patch<unknown>(`/admin/organizations/${id}/activate`)).data),
  suspend: async (id: string): Promise<Organization> =>
    unwrapApiResponse<Organization>((await axiosInstance.patch<unknown>(`/admin/organizations/${id}/suspend`)).data),
};
