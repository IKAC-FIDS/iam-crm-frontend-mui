import axiosInstance from '@/lib/axios';
import type { AuditLog, AuditLogParams, AuditLogResult } from '../types/auditLog.types';

interface Envelope { data?: AuditLog[]; items?: AuditLog[]; meta?: { total?: number; page?: number; limit?: number; totalPages?: number; hasNext?: boolean; hasPrevious?: boolean }; total?: number; page?: number; limit?: number; totalPages?: number }
const clean = (params: AuditLogParams) => Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ''));

export const auditLogsService = {
  getAuditLogs: async (params: AuditLogParams): Promise<AuditLogResult> => {
    const response = await axiosInstance.get<AuditLog[] | Envelope>('/admin/audit-logs', { params: clean(params) });
    if (Array.isArray(response.data)) return { data: response.data, meta: { total: response.data.length, page: params.page, limit: params.limit, totalPages: Math.max(1, Math.ceil(response.data.length / params.limit)) } };
    const data = response.data.data ?? response.data.items ?? [];
    const page = response.data.meta?.page ?? response.data.page ?? params.page;
    const limit = response.data.meta?.limit ?? response.data.limit ?? params.limit;
    const total = response.data.meta?.total ?? response.data.total ?? data.length;
    const totalPages = response.data.meta?.totalPages ?? response.data.totalPages ?? Math.max(1, Math.ceil(total / limit));
    return { data, meta: { total, page, limit, totalPages, hasNext: response.data.meta?.hasNext ?? page < totalPages, hasPrevious: response.data.meta?.hasPrevious ?? page > 1 } };
  },
};
