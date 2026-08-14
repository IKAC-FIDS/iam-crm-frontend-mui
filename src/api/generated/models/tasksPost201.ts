/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { SuccessEnvelope } from './successEnvelope';
import type { TaskResponse } from './taskResponse';

export type TasksPost201 = SuccessEnvelope & {
  data: TaskResponse;
};
