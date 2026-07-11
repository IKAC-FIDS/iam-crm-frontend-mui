import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type {
  CompanyBranch,
  CreateCompanyBranchPayload,
  UpdateCompanyBranchPayload,
} from '../types/companyBranch.types';

function unwrapList(payload: unknown) {
  const value = unwrapApiResponse<unknown>(payload);
  if (Array.isArray(value)) return value as CompanyBranch[];
  return value && typeof value === 'object' && 'items' in value && Array.isArray((value as { items?: unknown }).items)
    ? (value as { items: CompanyBranch[] }).items
    : [];
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
    return unwrapApiResponse<CompanyBranch>(response.data);
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
    return unwrapApiResponse<CompanyBranch>(response.data);
  },

  deleteCompanyBranch: async (companyId: string, branchId: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${companyId}/branches/${branchId}`);
  },
};
