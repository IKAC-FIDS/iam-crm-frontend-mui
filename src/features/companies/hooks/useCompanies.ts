import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../services/companies.service';
import type {
  ChangeCompanyStagePayload,
  ChangeCompanyOwnerPayload,
  GetCompaniesParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  ArchiveCompanyPayload,
} from '../types/company.types';

export const companyQueryKeys = {
  all: ['companies'] as const,
  list: (params: GetCompaniesParams) => [...companyQueryKeys.all, 'list', params] as const,
  detail: (companyId: string) => [...companyQueryKeys.all, 'detail', companyId] as const,
};

function invalidateCompanyData(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
    queryClient.invalidateQueries({ queryKey: ['reports'] }),
  ]);
}

export function useCompanies(params: GetCompaniesParams) {
  return useQuery({
    queryKey: companyQueryKeys.list(params),
    queryFn: () => companiesService.getCompanies(params),
    placeholderData: keepPreviousData,
  });
}

export function useCompany(companyId: string) {
  return useQuery({
    queryKey: companyQueryKeys.detail(companyId),
    queryFn: () => companiesService.getCompanyById(companyId),
    enabled: Boolean(companyId),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) =>
      companiesService.createCompany(payload),
    onSuccess: () => invalidateCompanyData(queryClient),
  });
}

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) =>
      companiesService.updateCompany(companyId, payload),
    onSuccess: () => invalidateCompanyData(queryClient),
  });
}

export function useChangeCompanyStage(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeCompanyStagePayload) =>
      companiesService.changeCompanyStage(companyId, payload),
    onSuccess: () => invalidateCompanyData(queryClient),
  });
}

export function useChangeCompanyOwner(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeCompanyOwnerPayload) =>
      companiesService.changeCompanyOwner(companyId, payload),
    onSuccess: () => invalidateCompanyData(queryClient),
  });
}

export function useArchiveCompany(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: ArchiveCompanyPayload) => companiesService.archiveCompany(companyId, payload), onSuccess: () => invalidateCompanyData(queryClient) });
}

export function useRestoreCompany(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: () => companiesService.restoreCompany(companyId), onSuccess: () => invalidateCompanyData(queryClient) });
}
