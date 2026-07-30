import axios, { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiErrorCode, getApiErrorMessage, getApiRequestId, isForbiddenError, unwrapApiResponse } from './apiResponse';

function apiError(status: number, data: unknown): AxiosError {
  return new AxiosError('Request failed', String(status), { headers: new AxiosHeaders() }, undefined, {
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
    data,
  });
}

describe('API response helpers', () => {
  it('unwraps the standardized success envelope', () => {
    expect(unwrapApiResponse({ success: true, data: { id: 'safe-id' }, requestId: 'req-1' })).toEqual({ id: 'safe-id' });
  });

  it('reads validation details, code, and request ID from the standard error envelope', () => {
    const error = apiError(422, { success: false, error: { code: 'VALIDATION_ERROR', details: ['فیلد الزامی است'] }, requestId: 'req-validation' });
    expect(axios.isAxiosError(error)).toBe(true);
    expect(getApiErrorMessage(error, 'fallback')).toBe('فیلد الزامی است');
    expect(getApiErrorCode(error)).toBe('VALIDATION_ERROR');
    expect(getApiRequestId(error)).toBe('req-validation');
  });

  it('distinguishes forbidden, feature-disabled, quota, server, and network errors', () => {
    expect(isForbiddenError(apiError(403, { error: { code: 'FORBIDDEN', message: 'دسترسی مجاز نیست.' } }))).toBe(true);
    expect(getApiErrorCode(apiError(403, { error: { code: 'FEATURE_DISABLED' } }))).toBe('FEATURE_DISABLED');
    expect(getApiErrorCode(apiError(429, { error: { code: 'QUOTA_EXCEEDED' } }))).toBe('QUOTA_EXCEEDED');
    expect(getApiErrorMessage(apiError(500, { error: {} }), 'خطای امن')).toBe('Request failed');
    expect(getApiErrorMessage(new Error('Network Error'), 'خطای امن')).toBe('Network Error');
  });
});
