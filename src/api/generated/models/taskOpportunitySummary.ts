/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { TaskOpportunitySummaryPriority } from './taskOpportunitySummaryPriority';

export interface TaskOpportunitySummary {
  /** @nullable */
  archivedAt: string | null;
  companyId: string;
  id: string;
  /** @nullable */
  ownerId: string | null;
  priority: TaskOpportunitySummaryPriority;
  title: string;
}
