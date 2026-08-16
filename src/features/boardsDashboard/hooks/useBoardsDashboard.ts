import { useQuery } from '@tanstack/react-query';
import { boardsDashboardService } from '../services/boardsDashboard.service';
import type { BoardsDashboardFilters } from '../types/boardsDashboard.types';

export function useBoardsDashboard(filters: BoardsDashboardFilters) {
  return useQuery({
    queryKey: ['boards-dashboard', filters.startDate ?? null, filters.endDate ?? null],
    queryFn: () => boardsDashboardService.getOverview(filters),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
