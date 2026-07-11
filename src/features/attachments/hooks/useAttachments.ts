import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunityKeys } from '@/features/opportunities/hooks/useOpportunities';
import { commercialDocumentKeys } from '@/features/commercialDocuments/hooks/useCommercialDocuments';
import { paymentKeys } from '@/features/payments/hooks/usePayments';
import { attachmentsService } from '../services/attachments.service';
import type { AttachmentEntityType, FindAttachmentsParams, UploadAttachmentPayload } from '../types/attachment.types';

export const attachmentQueryKeys = {
  all: ['attachments'] as const,
  list: (entityType: AttachmentEntityType, entityId: string, params?: Partial<FindAttachmentsParams>) =>
    ['attachments', entityType, entityId, 'list', params] as const,
  detail: (id: string) => ['attachments', 'detail', id] as const,
};

function useInvalidateAttachments(entityType: AttachmentEntityType, entityId: string) {
  const client = useQueryClient();
  return (attachmentId?: string) => Promise.all([
    client.invalidateQueries({ queryKey: ['attachments', entityType, entityId] }),
    attachmentId ? client.invalidateQueries({ queryKey: attachmentQueryKeys.detail(attachmentId) }) : Promise.resolve(),
    entityType === 'OPPORTUNITY' ? client.invalidateQueries({ queryKey: opportunityKeys.detail(entityId) }) : Promise.resolve(),
    entityType === 'COMMERCIAL_DOCUMENT' ? client.invalidateQueries({ queryKey: commercialDocumentKeys.all }) : Promise.resolve(),
    entityType === 'PAYMENT' ? client.invalidateQueries({ queryKey: paymentKeys.all }) : Promise.resolve(),
  ]);
}

export function useAttachments(params: FindAttachmentsParams, enabled = true) {
  return useQuery({
    queryKey: attachmentQueryKeys.list(params.entityType, params.entityId, params),
    queryFn: () => attachmentsService.list(params),
    placeholderData: keepPreviousData,
    enabled: enabled && Boolean(params.entityId),
  });
}

export function useUploadAttachment(entityType: AttachmentEntityType, entityId: string) {
  const invalidate = useInvalidateAttachments(entityType, entityId);
  return useMutation({
    mutationFn: (payload: UploadAttachmentPayload) => attachmentsService.upload(payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useDownloadAttachment() {
  return useMutation({
    mutationFn: ({ id, originalFileName }: { id: string; originalFileName?: string }) =>
      attachmentsService.download(id, originalFileName),
  });
}

export function useDeleteAttachment(entityType: AttachmentEntityType, entityId: string) {
  const invalidate = useInvalidateAttachments(entityType, entityId);
  return useMutation({
    mutationFn: (id: string) => attachmentsService.remove(id),
    onSuccess: (_data, id) => invalidate(id),
  });
}
