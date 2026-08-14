import { afterEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { quotaService } from './quota.service';

describe('quota service', () => {
  afterEach(() => server.resetHandlers());

  it('uses the typed tenant quota endpoint without adding tenant headers', async () => {
    server.use(http.get('http://localhost:3000/api/quota/current', ({ request }) => {
      expect(request.headers.has('x-tenant-id')).toBe(false);
      expect(request.headers.has('x-organization-id')).toBe(false);
      return HttpResponse.json({ data: { organizationId: '11111111-1111-4111-8111-111111111111', quotas: [{ metric: 'COMPANIES', current: '12', hardLimit: '100', softLimit: '80', state: 'ACTIVE' }] } });
    }));
    await expect(quotaService.current()).resolves.toMatchObject({ quotas: [{ metric: 'COMPANIES', current: '12' }] });
  });

  it('rejects malformed success payloads instead of converting them to empty data', async () => {
    server.use(http.get('http://localhost:3000/api/quota/current', () => HttpResponse.json({ data: { quotas: [{}] } })));
    await expect(quotaService.current()).rejects.toThrow('Malformed quota response');
  });
});
