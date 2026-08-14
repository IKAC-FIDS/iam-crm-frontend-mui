/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { ErrorEnvelopeError } from './errorEnvelopeError';

export interface ErrorEnvelope {
  error: ErrorEnvelopeError;
  method: string;
  path: string;
  /** @nullable */
  requestId: string | null;
  statusCode: number;
  success: false;
  timestamp: string;
}
