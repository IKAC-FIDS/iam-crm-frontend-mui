import axiosInstance from '@/lib/axios';
import { unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type { AuditLog, AuditLogParams, AuditLogResult } from '../types/auditLog.types';

interface Envelope { data?: AuditLog[]; items?: AuditLog[]; meta?: { total?: number; page?: number; limit?: number; totalPages?: number; hasNext?: boolean; hasPrevious?: boolean }; total?: number; page?: number; limit?: number; totalPages?: number }
const clean = (params: AuditLogParams) => Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ''));

export const auditLogsService = {
  getAuditLogs: async (params: AuditLogParams): Promise<AuditLogResult> => {
    const response = await axiosInstance.get<AuditLog[] | Envelope>('/admin/audit-logs', { params: clean(params) });
    const result = unwrapPaginatedApiResponse<AuditLog>(response.data);
    const page = result.meta.page || params.page;
    const limit = result.meta.limit || params.limit;
    const total = result.meta.total ?? result.data.length;
    const totalPages = result.meta.totalPages || Math.max(1, Math.ceil(total / limit));
    return { data: result.data, meta: { total, page, limit, totalPages, hasNext: result.meta.hasNext ?? page < totalPages, hasPrevious: result.meta.hasPrevious ?? page > 1 } };
  },
};
