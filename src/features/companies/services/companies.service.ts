import axiosInstance from '@/lib/axios';
import type {
  CompaniesPageResult,
  CompaniesQueryParams,
  Company,
  ChangeCompanyStagePayload,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '../types/company.types';

interface CompaniesApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

interface CompaniesApiEnvelope {
  data?: Company[];
  items?: Company[];
  meta?: CompaniesApiMeta;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

type CompaniesApiResponse = Company[] | CompaniesApiEnvelope;

function normalizeCompaniesResponse(
  payload: CompaniesApiResponse,
  params: CompaniesQueryParams,
): CompaniesPageResult {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      page: params.page,
      limit: params.limit,
      total: payload.length,
      totalPages: Math.max(1, Math.ceil(payload.length / params.limit)),
    };
  }

  const items = payload.data ?? payload.items ?? [];
  const page = payload.meta?.page ?? payload.page ?? params.page;
  const limit = payload.meta?.limit ?? payload.limit ?? params.limit;
  const total = payload.meta?.total ?? payload.total ?? items.length;

  return {
    items,
    page,
    limit,
    total,
    totalPages:
      payload.meta?.totalPages ??
      payload.totalPages ??
      Math.max(1, Math.ceil(total / limit)),
  };
}

export const companiesService = {
  getAll: async (params: CompaniesQueryParams): Promise<CompaniesPageResult> => {
    const response = await axiosInstance.get<CompaniesApiResponse>('/companies', {
      params,
    });

    return normalizeCompaniesResponse(response.data, params);
  },

  getById: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.get<Company | { data: Company }>(
      `/companies/${companyId}`,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  create: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.post<Company | { data: Company }>(
      '/companies',
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  update: async (companyId: string, payload: UpdateCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}`,
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },

  changeStage: async (
    companyId: string,
    payload: ChangeCompanyStagePayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}/stage`,
      payload,
    );

    return 'data' in response.data ? response.data.data : response.data;
  },
};
