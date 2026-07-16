import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../services/companies.service';
import type {
  ChangeCompanyOwnerPayload,
  GetCompaniesParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  ArchiveCompanyPayload,
  UploadCompanyLegalDocumentPayload,
  UpdateCompanyLegalDocumentPayload,
} from '../types/company.types';

export const companyQueryKeys = {
  all: ['companies'] as const,
  list: (params: GetCompaniesParams) => [...companyQueryKeys.all, 'list', params] as const,
  detail: (companyId: string) => [...companyQueryKeys.all, 'detail', companyId] as const,
  legalDocuments: (companyId: string) => [...companyQueryKeys.detail(companyId), 'legal-documents'] as const,
};

function invalidateCompanyData(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
    queryClient.invalidateQueries({ queryKey: ['reports'] }),
  ]);
}

function invalidateCompanyDetail(queryClient: ReturnType<typeof useQueryClient>, companyId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.legalDocuments(companyId) }),
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
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

export function useCompanyLegalDocuments(companyId: string, enabled = true) {
  return useQuery({
    queryKey: companyQueryKeys.legalDocuments(companyId),
    queryFn: () => companiesService.listLegalDocuments(companyId),
    enabled: enabled && Boolean(companyId),
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

export function useUploadCompanyLegalDocument(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadCompanyLegalDocumentPayload) =>
      companiesService.uploadLegalDocument(companyId, payload),
    onSuccess: () => invalidateCompanyDetail(queryClient, companyId),
  });
}

export function useUpdateCompanyLegalDocument(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCompanyLegalDocumentPayload }) =>
      companiesService.updateLegalDocument(companyId, id, payload),
    onSuccess: () => invalidateCompanyDetail(queryClient, companyId),
  });
}

export function useDeleteCompanyLegalDocument(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companiesService.deleteLegalDocument(companyId, id),
    onSuccess: () => invalidateCompanyDetail(queryClient, companyId),
  });
}
