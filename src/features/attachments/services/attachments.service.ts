import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import { filenameFromContentDisposition, getSafeFileName } from '../utils/attachmentDisplay';
import type { AttachmentPage, FileAttachment, FindAttachmentsParams, UploadAttachmentPayload } from '../types/attachment.types';

const cleanParams = (value: FindAttachmentsParams) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

export const attachmentsService = {
  list: async (params: FindAttachmentsParams): Promise<AttachmentPage> =>
    unwrapPaginatedApiResponse<FileAttachment>(
      (await axiosInstance.get<unknown>('/attachments', { params: cleanParams(params) })).data,
    ),
  get: async (id: string): Promise<FileAttachment> =>
    unwrapApiResponse<FileAttachment>((await axiosInstance.get<unknown>(`/attachments/${id}`)).data),
  upload: async (payload: UploadAttachmentPayload): Promise<FileAttachment> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('entityType', payload.entityType);
    formData.append('entityId', payload.entityId);
    if (payload.description?.trim()) formData.append('description', payload.description.trim());

    return unwrapApiResponse<FileAttachment>(
      (await axiosInstance.post<unknown>('/attachments', formData, {
        headers: { 'Content-Type': undefined },
      })).data,
    );
  },
  download: async (id: string, originalFileName?: string): Promise<void> => {
    const response = await axiosInstance.get<Blob>(`/attachments/${id}/download`, { responseType: 'blob' });
    const contentDisposition = response.headers['content-disposition'];
    const headerFileName = typeof contentDisposition === 'string'
      ? filenameFromContentDisposition(contentDisposition)
      : null;
    const fileName = getSafeFileName(originalFileName || headerFileName || 'attachment');
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/attachments/${id}`);
  },
};
