/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { PaginationMeta } from './paginationMeta';
import type { SuccessEnvelope } from './successEnvelope';
import type { TaskResponse } from './taskResponse';

export type TasksGet200 = SuccessEnvelope & {
  data: TaskResponse[];
  meta: PaginationMeta;
};
