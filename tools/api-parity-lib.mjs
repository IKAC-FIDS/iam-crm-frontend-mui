const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
export const parityStatuses = new Set(['FULL_UI_SUPPORT', 'PARTIAL_UI_SUPPORT', 'SERVICE_ONLY_NO_UI', 'GENERATED_ONLY_NOT_CONSUMED', 'BACKEND_ONLY', 'INTENTIONALLY_NO_UI', 'DEPRECATED_BACKEND_ENDPOINT', 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE', 'PLATFORM_CONTRACT_REQUIRED', 'NOT_USER_FACING']);

export function openApiInventory(contract) {
  const inventory = new Map();
  for (const [operationPath, pathItem] of Object.entries(contract.paths ?? {})) for (const [method, operation] of Object.entries(pathItem)) {
    if (methods.has(method)) inventory.set(`${method.toUpperCase()} ${operationPath}`, operation.operationId);
  }
  return inventory;
}

export function validateParity(contract, operations) {
  const inventory = openApiInventory(contract), classified = new Map(), errors = [];
  for (const entry of operations) {
    const key = `${entry.method} ${entry.path}`;
    if (classified.has(key)) errors.push(`Duplicate manifest operation: ${key}`);
    if (!parityStatuses.has(entry.status)) errors.push(`Invalid status for ${key}: ${entry.status}`);
    if (!inventory.has(key)) errors.push(`Manifest operation is absent from OpenAPI: ${key}`);
    if (inventory.get(key) !== entry.operationId) errors.push(`operationId mismatch for ${key}`);
    classified.set(key, entry);
  }
  for (const key of inventory.keys()) if (!classified.has(key)) errors.push(`Unclassified OpenAPI operation: ${key}`);
  const counts = {};
  for (const entry of classified.values()) counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  return { inventory, classified, errors, counts };
}
