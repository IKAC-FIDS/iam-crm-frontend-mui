import { describe, expect, it } from 'vitest';
import { requiredOperations, requiredSchemas, validateContractDocument } from './api-contract-lib.mjs';

function validContract() {
  const paths = Object.fromEntries(requiredOperations.map((operationId, index) => [`/operation-${index}`, { get: { operationId } }]));
  const schemas = Object.fromEntries(requiredSchemas.map((schema) => [schema, { type: 'object' }]));
  return { openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' }, paths, components: { schemas }, servers: [{ url: '/' }] };
}

describe('API contract requirements', () => {
  it('accepts the required OpenAPI metadata, operations, and schemas', () => {
    expect(() => validateContractDocument(validContract())).not.toThrow();
  });

  it('rejects invalid structure, duplicate operations, and missing representative schemas', () => {
    expect(() => validateContractDocument({})).toThrow('OPENAPI_CONTRACT_INVALID');
    const duplicate = validContract();
    duplicate.paths['/duplicate'] = { get: { operationId: requiredOperations[0] } };
    expect(() => validateContractDocument(duplicate)).toThrow('duplicate operationId');
    const missingSchema = validContract();
    delete missingSchema.components.schemas.TaskResponse;
    expect(() => validateContractDocument(missingSchema)).toThrow('CONTRACT_MISMATCH_REQUIRES_BACKEND_FIX');
  });

  it('rejects an absolute environment server URL', () => {
    const contract = validContract();
    contract.servers = [{ url: 'https://production.invalid/api' }];
    expect(() => validateContractDocument(contract)).toThrow('absolute server URLs');
  });
});
