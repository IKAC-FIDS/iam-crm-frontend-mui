import { useQueries } from '@tanstack/react-query';
import { opportunitiesService } from '@/features/opportunities/services/opportunities.service';
import type { Priority } from '@/features/companies/types/company.types';
export const pipelineQueryKeys = { all: ['pipeline'] as const, column: (stageId: string, priority?: Priority, search?: string) => ['pipeline', stageId, { priority, search, limit: 20 }] as const };
export function usePipeline(stageIds: string[], priority?: Priority, search?: string) { return useQueries({ queries: stageIds.map((stageId) => ({ queryKey: pipelineQueryKeys.column(stageId, priority, search), queryFn: () => opportunitiesService.list({ stageId, page: 1, limit: 20, priority, search: search || undefined }) })) }); }
