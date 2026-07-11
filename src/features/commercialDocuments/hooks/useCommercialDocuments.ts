import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunityKeys } from '@/features/opportunities/hooks/useOpportunities';
import { commercialDocumentsService } from '../services/commercialDocuments.service';
import type {
  ChangeCommercialDocumentStatusPayload,
  CommercialDocumentListParams,
  CreateCommercialDocumentPayload,
  UpdateCommercialDocumentPayload,
} from '../types/commercialDocument.types';

export const commercialDocumentKeys = {
  all: ['commercial-documents'] as const,
  list: (opportunityId: string, params?: CommercialDocumentListParams) => ['commercial-documents', opportunityId, 'list', params] as const,
  detail: (opportunityId: string, documentId: string) => ['commercial-documents', opportunityId, 'detail', documentId] as const,
};

function useInvalidateCommercialDocuments(opportunityId: string, companyId?: string) {
  const client = useQueryClient();
  return (documentId?: string) => Promise.all([
    client.invalidateQueries({ queryKey: ['commercial-documents', opportunityId] }),
    documentId ? client.invalidateQueries({ queryKey: commercialDocumentKeys.detail(opportunityId, documentId) }) : Promise.resolve(),
    client.invalidateQueries({ queryKey: ['payments', opportunityId] }),
    client.invalidateQueries({ queryKey: opportunityKeys.detail(opportunityId) }),
    client.invalidateQueries({ queryKey: opportunityKeys.all }),
    client.invalidateQueries({ queryKey: ['pipeline'] }),
    client.invalidateQueries({ queryKey: ['company-opportunities', companyId] }),
    client.invalidateQueries({ queryKey: ['companies', 'detail', companyId] }),
  ]);
}

export function useCommercialDocuments(opportunityId: string, params: CommercialDocumentListParams = {}, enabled = true) {
  return useQuery({
    queryKey: commercialDocumentKeys.list(opportunityId, params),
    queryFn: () => commercialDocumentsService.list(opportunityId, params),
    placeholderData: keepPreviousData,
    enabled: enabled && Boolean(opportunityId),
  });
}

export function useCreateCommercialDocument(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateCommercialDocuments(opportunityId, companyId);
  return useMutation({
    mutationFn: (payload: CreateCommercialDocumentPayload) => commercialDocumentsService.create(opportunityId, payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useUpdateCommercialDocument(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateCommercialDocuments(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCommercialDocumentPayload }) =>
      commercialDocumentsService.update(opportunityId, id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useChangeCommercialDocumentStatus(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateCommercialDocuments(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangeCommercialDocumentStatusPayload }) =>
      commercialDocumentsService.changeStatus(opportunityId, id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useDeleteCommercialDocument(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateCommercialDocuments(opportunityId, companyId);
  return useMutation({
    mutationFn: (id: string) => commercialDocumentsService.remove(opportunityId, id),
    onSuccess: (_data, id) => invalidate(id),
  });
}
