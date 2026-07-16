import { useQueries } from '@tanstack/react-query';
import { opportunitiesService } from '@/features/opportunities/services/opportunities.service';
import type { Priority } from '@/features/companies/types/company.types';
import type { OwnershipScope } from '@/shared/types/ownership';
export const pipelineQueryKeys = { all: ['pipeline'] as const, column: (stageId: string, ownershipScope: OwnershipScope, priority?: Priority, search?: string) => ['pipeline', stageId, { ownershipScope, priority, search, limit: 20 }] as const };
export function usePipeline(stageIds: string[], ownershipScope: OwnershipScope, priority?: Priority, search?: string) { return useQueries({ queries: stageIds.map((stageId) => ({ queryKey: pipelineQueryKeys.column(stageId, ownershipScope, priority, search), queryFn: () => opportunitiesService.list({ stageId, page: 1, limit: 20, ownershipScope, priority, search: search || undefined }) })) }); }
