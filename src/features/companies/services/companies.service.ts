import axiosInstance from '@/lib/axios';
import type {
  GetCompaniesParams,
  PaginatedResult,
  Company,
  CompanyListItem,
  ChangeCompanyStagePayload,
  ChangeCompanyOwnerPayload,
  CreateCompanyPayload,
  UpdateCompanyPayload,
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
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  ) as Record<string, string | number | boolean>;
}

export const companiesService = {
  getCompanies: async (
    params: GetCompaniesParams,
  ): Promise<PaginatedResult<CompanyListItem>> => {
    const response = await axiosInstance.get<CompaniesApiResponse>('/companies', {
      params: cleanRequestParams(params),
    });

    return normalizeCompaniesResponse(response.data, params);
  },

  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.get<Company | { data: Company }>(
      `/companies/${companyId}`,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  createCompany: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.post<Company | { data: Company }>(
      '/companies',
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  updateCompany: async (
    companyId: string,
    payload: UpdateCompanyPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}`,
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  changeCompanyStage: async (
    companyId: string,
    payload: ChangeCompanyStagePayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}/stage`,
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  changeCompanyOwner: async (
    companyId: string,
    payload: ChangeCompanyOwnerPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}/owner`,
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },
};
