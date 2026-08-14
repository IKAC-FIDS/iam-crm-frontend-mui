import { quotaCurrentGet } from '@/api/generated/endpoints';
import type { QuotaSummary, QuotaSummaryQuotasItem } from '@/api/generated/models';

function isCompleteQuota(item: QuotaSummaryQuotasItem): boolean {
  return typeof item.metric === 'string' && typeof item.current === 'string' && typeof item.state === 'string';
}

export const quotaService = {
  current: async (signal?: AbortSignal): Promise<QuotaSummary> => {
    const response = await quotaCurrentGet({ signal });
    if (!response.data?.organizationId || !Array.isArray(response.data.quotas) || !response.data.quotas.every(isCompleteQuota)) {
      throw new Error('Malformed quota response');
    }
    return response.data;
  },
};
