import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  ChangeCommercialDocumentStatusPayload,
  CommercialDocument,
  CommercialDocumentListParams,
  CommercialDocumentPage,
  CreateCommercialDocumentPayload,
  UpdateCommercialDocumentPayload,
} from '../types/commercialDocument.types';

const base = (opportunityId: string) => `/opportunities/${opportunityId}/commercial-documents`;

const cleanParams = (value: CommercialDocumentListParams) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

function cleanPayload<T extends CreateCommercialDocumentPayload | UpdateCommercialDocumentPayload | ChangeCommercialDocumentStatusPayload>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => key !== 'file' && value !== undefined && value !== ''),
  ) as T;
}

function appendFormValue(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === '' || key === 'file') return;
  formData.append(key, String(value));
}

function toCreateFormData(payload: CreateCommercialDocumentPayload) {
  const formData = new FormData();
  if (payload.file) formData.append('file', payload.file);
  Object.entries(cleanPayload(payload)).forEach(([key, value]) => appendFormValue(formData, key, value));
  return formData;
}

export const commercialDocumentsService = {
  list: async (opportunityId: string, query: CommercialDocumentListParams = {}): Promise<CommercialDocumentPage> =>
    unwrapPaginatedApiResponse<CommercialDocument>(
      (await axiosInstance.get<unknown>(base(opportunityId), { params: cleanParams(query) })).data,
    ),
  get: async (opportunityId: string, documentId: string): Promise<CommercialDocument> =>
    unwrapApiResponse<CommercialDocument>((await axiosInstance.get<unknown>(`${base(opportunityId)}/${documentId}`)).data),
  create: async (opportunityId: string, payload: CreateCommercialDocumentPayload): Promise<CommercialDocument> =>
    unwrapApiResponse<CommercialDocument>(
      payload.file
        ? (await axiosInstance.post<unknown>(`${base(opportunityId)}/upload`, toCreateFormData(payload), {
          headers: { 'Content-Type': undefined },
        })).data
        : (await axiosInstance.post<unknown>(base(opportunityId), cleanPayload(payload))).data,
    ),
  update: async (opportunityId: string, documentId: string, payload: UpdateCommercialDocumentPayload): Promise<CommercialDocument> =>
    unwrapApiResponse<CommercialDocument>(
      (await axiosInstance.patch<unknown>(`${base(opportunityId)}/${documentId}`, cleanPayload(payload))).data,
    ),
  changeStatus: async (opportunityId: string, documentId: string, payload: ChangeCommercialDocumentStatusPayload): Promise<CommercialDocument> =>
    unwrapApiResponse<CommercialDocument>(
      (await axiosInstance.patch<unknown>(`${base(opportunityId)}/${documentId}/status`, cleanPayload(payload))).data,
    ),
  remove: async (opportunityId: string, documentId: string): Promise<void> => {
    await axiosInstance.delete(`${base(opportunityId)}/${documentId}`);
  },
};
