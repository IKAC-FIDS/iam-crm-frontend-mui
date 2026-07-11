import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  GetCompaniesParams,
  PaginatedResult,
  Company,
  CompanyListItem,
  ChangeCompanyOwnerPayload,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  ArchiveCompanyPayload,
} from '../types/company.types';

interface CompaniesApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface CompaniesApiEnvelope {
  data?: CompanyListItem[];
  items?: CompanyListItem[];
  meta?: CompaniesApiMeta;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

type CompaniesApiResponse = CompanyListItem[] | CompaniesApiEnvelope;

function normalizeCompaniesResponse(
  payload: CompaniesApiResponse,
  params: GetCompaniesParams,
): PaginatedResult<CompanyListItem> {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: {
        page: params.page,
        limit: params.limit,
        total: payload.length,
        totalPages: Math.max(1, Math.ceil(payload.length / params.limit)),
        hasNext: false,
        hasPrevious: params.page > 1,
      },
    };
  }

  const items = payload.data ?? payload.items ?? [];
  const page = payload.meta?.page ?? payload.page ?? params.page;
  const limit = payload.meta?.limit ?? payload.limit ?? params.limit;
  const total = payload.meta?.total ?? payload.total ?? items.length;

  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages:
        payload.meta?.totalPages ??
        payload.totalPages ??
        Math.max(1, Math.ceil(total / limit)),
      hasNext: payload.meta?.hasNext ?? page * limit < total,
      hasPrevious: payload.meta?.hasPrevious ?? page > 1,
    },
  };
}

function cleanRequestParams(params: GetCompaniesParams): Record<string, string | number | boolean> {
  const result = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  ) as Record<string, string | number | boolean>;

  delete result.archiveStatus;

  if (params.archiveStatus === 'ALL') result.includeArchived = true;
  if (params.archiveStatus === 'ARCHIVED') result.archivedOnly = true;

  return result;
}

export const companiesService = {
  getCompanies: async (
    params: GetCompaniesParams,
  ): Promise<PaginatedResult<CompanyListItem>> => {
    const response = await axiosInstance.get<CompaniesApiResponse>('/companies', {
      params: cleanRequestParams(params),
    });

    return normalizeCompaniesResponse(unwrapPaginatedApiResponse<CompanyListItem>(response.data), params);
  },

  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.get<Company | { data: Company }>(
      `/companies/${companyId}`,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  createCompany: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.post<Company | { data: Company }>(
      '/companies',
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  updateCompany: async (
    companyId: string,
    payload: UpdateCompanyPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}`,
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  changeCompanyOwner: async (
    companyId: string,
    payload: ChangeCompanyOwnerPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}/owner`,
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },
  archiveCompany: async (companyId: string, payload: ArchiveCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(`/companies/${companyId}/archive`, payload);
    return unwrapApiResponse<Company>(response.data);
  },
  restoreCompany: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(`/companies/${companyId}/restore`);
    return unwrapApiResponse<Company>(response.data);
  },
};
