import { describe, expect, it } from 'vitest';
import { validateParity } from './api-parity-lib.mjs';

const contract = { paths: { '/api/example': { get: { operationId: 'exampleGet' } } } };
const classified = [{ method: 'GET', path: '/api/example', operationId: 'exampleGet', status: 'FULL_UI_SUPPORT' }];

describe('capability parity validation', () => {
  it('accepts an explicitly classified operation deterministically', () => {
    expect(validateParity(contract, classified)).toMatchObject({ errors: [], counts: { FULL_UI_SUPPORT: 1 } });
  });

  it('fails when a new backend operation has no explicit classification', () => {
    const changed = { paths: { ...contract.paths, '/api/new': { post: { operationId: 'newPost' } } } };
    expect(validateParity(changed, classified).errors).toContain('Unclassified OpenAPI operation: POST /api/new');
  });

  it('fails when a classified frontend binding silently disappears from the contract', () => {
    expect(validateParity({ paths: {} }, classified).errors).toContain('Manifest operation is absent from OpenAPI: GET /api/example');
  });
});
