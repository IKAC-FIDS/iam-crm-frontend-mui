import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import { companiesGet } from '@/api/generated/endpoints';
import type { CompaniesGetParams, CompanyListItem as ApiCompanyListItem } from '@/api/generated/models';
import type {
  GetCompaniesParams,
  PaginatedResult,
  Company,
  CompanyListItem,
  CompanyLegalDocument,
  ChangeCompanyOwnerPayload,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  ArchiveCompanyPayload,
  UploadCompanyLegalDocumentPayload,
  UpdateCompanyLegalDocumentPayload,
  CompanyOption,
  GetCompanyOptionsParams,
} from '../types/company.types';

function isCompanyLegalDocument(value: unknown): value is CompanyLegalDocument {
  return typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string';
}

function uploadedLegalDocument(payload: unknown): CompanyLegalDocument | null {
  const value = unwrapApiResponse<unknown>(payload);
  if (isCompanyLegalDocument(value)) return value;
  if (typeof value !== 'object' || value === null) return null;
  const envelope = value as Record<string, unknown>;
  const candidate = envelope.legalDocument ?? envelope.document ?? envelope.data;
  return isCompanyLegalDocument(candidate) ? candidate : null;
}

function cleanRequestParams(params: GetCompaniesParams): { generated: CompaniesGetParams; transport: Record<string, string | number> } {
  const result = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  ) as Record<string, string | number>;

  delete result.archiveStatus;

  if (params.archiveStatus === 'ALL') result.includeArchived = 'true';
  if (params.archiveStatus === 'ARCHIVED') result.archivedOnly = 'true';

  return {
    generated: {
      ownershipScope: params.ownershipScope,
      search: params.search,
      ownerId: params.ownerId,
      page: params.page,
      limit: params.limit,
      includeArchived: params.archiveStatus === 'ALL' ? 'true' : undefined,
      archivedOnly: params.archiveStatus === 'ARCHIVED' ? 'true' : undefined,
    },
    transport: result,
  };
}

function toCompanyListItem(company: ApiCompanyListItem): CompanyListItem {
  return {
    id: company.id,
    legalName: company.legalName,
    brandName: company.brandName,
    industry: company.industry,
    priority: company.priority,
    owner: company.owner ? { ...company.owner, team: company.owner.team ?? undefined } : null,
    headOfficeCity: company.headOfficeCity,
    centralPhone: company.centralPhone,
    updatedAt: company.updatedAt,
    isArchived: Boolean(company.archivedAt),
    archivedAt: company.archivedAt,
    archiveReason: company.archiveReason,
  };
}

export const companiesService = {
  getCompanyOptions: async (
    params: GetCompanyOptionsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<CompanyOption>> => {
    const response = await axiosInstance.get<unknown>('/companies/options', { params, signal });
    return unwrapPaginatedApiResponse<CompanyOption>(response.data);
  },

  getCompanyOptionById: async (companyId: string, signal?: AbortSignal): Promise<CompanyOption> => {
    const response = await axiosInstance.get<unknown>(`/companies/options/${companyId}`, { signal });
    return unwrapApiResponse<CompanyOption>(response.data);
  },

  getCompanies: async (
    params: GetCompaniesParams,
  ): Promise<PaginatedResult<CompanyListItem>> => {
    const query = cleanRequestParams(params);
    const response = await companiesGet(query.generated, { params: query.transport });
    return { data: response.data.map(toCompanyListItem), meta: response.meta };
  },

  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.get<Company | { data: Company }>(
      `/companies/${companyId}`,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  createCompany: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.post<Company | { data: Company }>(
      '/companies',
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  updateCompany: async (
    companyId: string,
    payload: UpdateCompanyPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}`,
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },

  changeCompanyOwner: async (
    companyId: string,
    payload: ChangeCompanyOwnerPayload,
  ): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(
      `/companies/${companyId}/owner`,
      payload,
    );

    return unwrapApiResponse<Company>(response.data);
  },
  archiveCompany: async (companyId: string, payload: ArchiveCompanyPayload): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(`/companies/${companyId}/archive`, payload);
    return unwrapApiResponse<Company>(response.data);
  },
  restoreCompany: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.patch<Company | { data: Company }>(`/companies/${companyId}/restore`);
    return unwrapApiResponse<Company>(response.data);
  },
  listLegalDocuments: async (companyId: string): Promise<CompanyLegalDocument[]> => {
    const response = await axiosInstance.get<CompanyLegalDocument[] | { data: CompanyLegalDocument[] }>(
      `/companies/${companyId}/legal-documents`,
    );
    return unwrapApiResponse<CompanyLegalDocument[]>(response.data);
  },
  uploadLegalDocument: async (
    companyId: string,
    payload: UploadCompanyLegalDocumentPayload,
  ): Promise<CompanyLegalDocument | null> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('type', payload.type);
    formData.append('title', payload.title);
    if (payload.description?.trim()) formData.append('description', payload.description.trim());
    if (payload.documentDate) formData.append('documentDate', payload.documentDate);

    const response = await axiosInstance.post<unknown>(
      `/companies/${companyId}/legal-documents/upload`,
      formData,
    );
    return uploadedLegalDocument(response.data);
  },
  updateLegalDocument: async (
    companyId: string,
    documentId: string,
    payload: UpdateCompanyLegalDocumentPayload,
  ): Promise<CompanyLegalDocument> => {
    const response = await axiosInstance.patch<CompanyLegalDocument | { data: CompanyLegalDocument }>(
      `/companies/${companyId}/legal-documents/${documentId}`,
      payload,
    );
    return unwrapApiResponse<CompanyLegalDocument>(response.data);
  },
  deleteLegalDocument: async (companyId: string, documentId: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${companyId}/legal-documents/${documentId}`);
  },
};
