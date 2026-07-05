import { useQueries } from '@tanstack/react-query';
import { companiesService } from '@/features/companies/services/companies.service';
import { COMPANY_STAGES } from '@/features/companies/types/company.types';
import type { Priority } from '@/features/companies/types/company.types';

export const pipelineQueryKeys = {
  all: ['pipeline'] as const,
  column: (stage: string, priority?: Priority, search?: string) => [
    ...pipelineQueryKeys.all,
    stage,
    { priority, search, limit: 20 },
  ] as const,
};

export function usePipeline(priority?: Priority, search?: string) {
  return useQueries({
    queries: COMPANY_STAGES.map((stage) => ({
      queryKey: pipelineQueryKeys.column(stage, priority, search),
      queryFn: () => companiesService.getCompanies({
        stage,
        page: 1,
        limit: 20,
        priority,
        search: search || undefined,
      }),
    })),
  });
}
