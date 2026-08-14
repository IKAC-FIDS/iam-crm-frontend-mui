/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { PaginationMeta } from './paginationMeta';

export interface SuccessEnvelope {
  data: unknown;
  meta?: PaginationMeta;
  /** @nullable */
  requestId: string | null;
  success: true;
  timestamp: string;
}
