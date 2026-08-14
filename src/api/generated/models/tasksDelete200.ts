/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { DeletedTaskResponse } from './deletedTaskResponse';
import type { SuccessEnvelope } from './successEnvelope';

export type TasksDelete200 = SuccessEnvelope & {
  data: DeletedTaskResponse;
};
