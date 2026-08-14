import { quotaCurrentGet } from '@/api/generated/endpoints';
import type { QuotaSummary, QuotaSummaryMetric } from '@/api/generated/models';

function isCompleteMetric(item: QuotaSummaryMetric): boolean {
  return typeof item.metric === 'string' && typeof item.current === 'string' && typeof item.state === 'string';
}

export const quotaService = {
  current: async (signal?: AbortSignal): Promise<QuotaSummary> => {
    const response = await quotaCurrentGet({ signal });
    if (
      !response.data?.organizationId
      || typeof response.data.generatedAt !== 'string'
      || !response.data.generatedAt
      || !Array.isArray(response.data.metrics)
      || !response.data.metrics.every(isCompleteMetric)
    ) {
      throw new Error('Malformed quota response');
    }
    return response.data;
  },
};
