import axiosInstance from '@/lib/axios';
import type {
  CompanyBranch,
  CreateCompanyBranchPayload,
  UpdateCompanyBranchPayload,
} from '../types/companyBranch.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? payload.data
    : payload;
}

function unwrapList(payload: CompanyBranch[] | { data?: CompanyBranch[]; items?: CompanyBranch[] }) {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.items ?? [];
}

export const companyBranchesService = {
  getCompanyBranches: async (companyId: string): Promise<CompanyBranch[]> => {
    const response = await axiosInstance.get<
      CompanyBranch[] | { data?: CompanyBranch[]; items?: CompanyBranch[] }
    >(`/companies/${companyId}/branches`);
    return unwrapList(response.data);
  },

  createCompanyBranch: async (
    companyId: string,
    payload: CreateCompanyBranchPayload,
  ): Promise<CompanyBranch> => {
    const response = await axiosInstance.post<CompanyBranch | { data: CompanyBranch }>(
      `/companies/${companyId}/branches`,
      payload,
    );
    return unwrap(response.data);
  },

  updateCompanyBranch: async (
    companyId: string,
    branchId: string,
    payload: UpdateCompanyBranchPayload,
  ): Promise<CompanyBranch> => {
    const response = await axiosInstance.patch<CompanyBranch | { data: CompanyBranch }>(
      `/companies/${companyId}/branches/${branchId}`,
      payload,
    );
    return unwrap(response.data);
  },

  deleteCompanyBranch: async (companyId: string, branchId: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${companyId}/branches/${branchId}`);
  },
};
