import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../services/companies.service';
import type {
  ChangeCompanyStagePayload,
  CompaniesQueryParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '../types/company.types';

export const companyQueryKeys = {
  all: ['companies'] as const,
  list: (params: CompaniesQueryParams) => [...companyQueryKeys.all, 'list', params] as const,
  detail: (companyId: string) => [...companyQueryKeys.all, 'detail', companyId] as const,
};

export function useCompanies(params: CompaniesQueryParams) {
  return useQuery({
    queryKey: companyQueryKeys.list(params),
    queryFn: () => companiesService.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompany(companyId: string) {
  return useQuery({
    queryKey: companyQueryKeys.detail(companyId),
    queryFn: () => companiesService.getById(companyId),
    enabled: Boolean(companyId),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companiesService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
  });
}

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) =>
      companiesService.update(companyId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
  });
}

export function useChangeCompanyStage(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeCompanyStagePayload) =>
      companiesService.changeStage(companyId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
  });
}
