export const requiredOperations = [
  'companiesGet',
  'companiesGet1',
  'tasksGet',
  'tasksGet1',
  'tasksDelete',
];

export const requiredSchemas = [
  'SuccessEnvelope',
  'ErrorEnvelope',
  'PaginationMeta',
  'CompanyListItem',
  'CompanyResponse',
  'TaskResponse',
  'DeletedTaskResponse',
];

export function validateContractDocument(document) {
  if (!/^3\./.test(document.openapi ?? '')) throw new Error('OPENAPI_CONTRACT_INVALID: OpenAPI 3.x is required');
  if (!document.info?.title || !document.info?.version) throw new Error('OPENAPI_CONTRACT_INVALID: info.title and info.version are required');
  if (!document.paths || !document.components?.schemas) throw new Error('OPENAPI_CONTRACT_INVALID: paths and component schemas are required');

  const operationIds = new Set();
  for (const item of Object.values(document.paths)) {
    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const operationId = item?.[method]?.operationId;
      if (!operationId) continue;
      if (operationIds.has(operationId)) throw new Error(`OPENAPI_CONTRACT_INVALID: duplicate operationId ${operationId}`);
      operationIds.add(operationId);
    }
  }
  for (const operationId of requiredOperations) {
    if (!operationIds.has(operationId)) throw new Error(`CONTRACT_MISMATCH_REQUIRES_BACKEND_FIX: missing ${operationId}`);
  }
  for (const schema of requiredSchemas) {
    if (!document.components.schemas[schema]) throw new Error(`CONTRACT_MISMATCH_REQUIRES_BACKEND_FIX: missing schema ${schema}`);
  }
  for (const server of document.servers ?? []) {
    if (/^https?:\/\//i.test(server.url ?? '')) throw new Error('OPENAPI_CONTRACT_INVALID: absolute server URLs are not allowed');
  }
}
