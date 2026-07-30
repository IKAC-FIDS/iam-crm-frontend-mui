import { http, HttpResponse } from 'msw';
import { latestActivity, tenantA, testUser } from '../fixtures';

const api = 'http://localhost:3000/api';

export const handlers = [
  http.get(`${api}/auth/sso/providers`, () => HttpResponse.json({ success: true, data: [], requestId: 'test-sso-request' })),
  http.post(`${api}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };
    if (body.email !== 'user@example.test' || body.password !== 'password123') {
      return HttpResponse.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'ایمیل یا رمز عبور نادرست است.' }, requestId: 'test-login-denied' }, { status: 401 });
    }
    return HttpResponse.json({ success: true, data: { accessToken: 'synthetic-access-token', user: testUser({ permissions: ['activity:view'] }) }, requestId: 'test-login-success' });
  }),
  http.post(`${api}/auth/refresh`, () => HttpResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'نشست منقضی شده است.' }, requestId: 'test-refresh-denied' }, { status: 401 })),
  http.get(`${api}/dashboard/latest-activities`, () => HttpResponse.json({ success: true, data: [latestActivity], requestId: 'test-activities-request' })),
  http.get(`${api}/organizations/current`, () => HttpResponse.json({ success: true, data: tenantA, requestId: 'test-organization-request' })),
];
