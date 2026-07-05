import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { companyBranchesService } from '../services/companyBranches.service';
import type {
  CreateCompanyBranchPayload,
  UpdateCompanyBranchPayload,
} from '../types/companyBranch.types';

export const companyBranchQueryKeys = {
  all: ['company-branches'] as const,
  list: (companyId: string) => [...companyBranchQueryKeys.all, companyId] as const,
};

export function useCompanyBranches(companyId: string) {
  return useQuery({
    queryKey: companyBranchQueryKeys.list(companyId),
    queryFn: () => companyBranchesService.getCompanyBranches(companyId),
    enabled: Boolean(companyId),
  });
}

function useBranchInvalidation(companyId: string) {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: companyBranchQueryKeys.list(companyId) }),
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
  ]);
}

export function useCreateCompanyBranch(companyId: string) {
  const invalidate = useBranchInvalidation(companyId);
  return useMutation({
    mutationFn: (payload: CreateCompanyBranchPayload) =>
      companyBranchesService.createCompanyBranch(companyId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateCompanyBranch(companyId: string, branchId: string) {
  const invalidate = useBranchInvalidation(companyId);
  return useMutation({
    mutationFn: (payload: UpdateCompanyBranchPayload) =>
      companyBranchesService.updateCompanyBranch(companyId, branchId, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCompanyBranch(companyId: string) {
  const invalidate = useBranchInvalidation(companyId);
  return useMutation({
    mutationFn: (branchId: string) => companyBranchesService.deleteCompanyBranch(companyId, branchId),
    onSuccess: invalidate,
  });
}
