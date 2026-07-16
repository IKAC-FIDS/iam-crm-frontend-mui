import type { PaginatedMeta } from '@/lib/apiResponse';

export type AttachmentEntityType = 'OPPORTUNITY' | 'COMMERCIAL_DOCUMENT' | 'PAYMENT' | 'COMPANY_LEGAL_DOCUMENT';
export type AttachmentStorageProvider = 'LOCAL' | 'MINIO';

export interface FileAttachment {
  id: string;
  entityType: AttachmentEntityType;
  entityId: string;
  storageProvider?: AttachmentStorageProvider;
  bucket?: string | null;
  objectKey?: string;
  storagePath?: string | null;
  originalFileName: string;
  originalName?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  storedFileName?: string;
  mimeType: string;
  sizeBytes: number;
  sha256?: string;
  description?: string | null;
  uploadedById?: string | null;
  uploadedBy?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
  } | null;
  deletedAt?: string | null;
  deletedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FindAttachmentsParams {
  entityType: AttachmentEntityType;
  entityId: string;
  page?: number;
  limit?: number;
}

export interface UploadAttachmentPayload {
  entityType: AttachmentEntityType;
  entityId: string;
  description?: string;
  file: File;
}

export interface AttachmentPage {
  data: FileAttachment[];
  meta: PaginatedMeta;
}
