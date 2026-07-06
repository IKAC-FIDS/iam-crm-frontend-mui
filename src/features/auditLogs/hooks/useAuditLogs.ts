import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { auditLogsService } from '../services/auditLogs.service';
import type { AuditLogParams } from '../types/auditLog.types';

export const auditLogQueryKeys = { all: ['admin', 'audit-logs'] as const, list: (params: AuditLogParams) => [...auditLogQueryKeys.all, params] as const };
export function useAuditLogs(params: AuditLogParams, enabled = true) { return useQuery({ queryKey: auditLogQueryKeys.list(params), queryFn: () => auditLogsService.getAuditLogs(params), placeholderData: keepPreviousData, enabled }); }
