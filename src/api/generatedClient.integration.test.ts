import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { companiesGet, tasksDelete, tasksGet } from './generated/endpoints';
import {
  CompanyListItemPriority,
  type CompanyListItem,
  type ErrorEnvelope,
  type PaginationMeta,
} from './generated/models';
import { companiesService } from '@/features/companies/services/companies.service';
import { tasksService } from '@/features/tasks/services/tasks.service';
import { server } from '@/test/msw/server';

const api = 'http://localhost:3000/api';

describe('generated API client integration', () => {
  it('keeps shared Axios auth, environment base URL, tenant, request-id, and cancellation behavior', async () => {
    localStorage.setItem('accessToken', 'generated-client-token');
    const controller = new AbortController();
    server.use(http.get(`${api}/tasks`, ({ request }) => {
      expect(request.headers.get('authorization')).toBe('Bearer generated-client-token');
      expect(request.headers.has('x-tenant-id')).toBe(false);
      expect(request.headers.has('x-organization-id')).toBe(false);
      expect(request.headers.has('x-request-id')).toBe(false);
      expect(new URL(request.url).searchParams.get('page')).toBe('1');
      return HttpResponse.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrevious: false }, requestId: 'server-generated-request-id', timestamp: '2026-08-14T00:00:00.000Z' });
    }));

    const response = await tasksGet({ page: 1, limit: 20 }, { signal: controller.signal });
    expect(response.requestId).toBe('server-generated-request-id');
  });

  it('maps the generated company pagination response into the existing view model', async () => {
    server.use(http.get(`${api}/companies`, ({ request }) => {
      const url = new URL(request.url);
      expect(url.searchParams.get('ownershipScope')).toBe('all');
      expect(url.searchParams.get('includeArchived')).toBe('true');
      expect(url.searchParams.get('priority')).toBe('HIGH');
      return HttpResponse.json({
        success: true,
        data: [{ id: 'company-1', legalName: 'Example', brandName: null, industry: null, priority: 'HIGH', owner: null, headOfficeCity: null, centralPhone: null, updatedAt: '2026-08-14T00:00:00.000Z', archivedAt: null, archiveReason: null }],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrevious: false },
        requestId: 'company-request',
        timestamp: '2026-08-14T00:00:00.000Z',
      });
    }));

    const result = await companiesService.getCompanies({ page: 1, limit: 20, ownershipScope: 'all', archiveStatus: 'ALL', priority: 'HIGH' });
    expect(result.meta.total).toBe(1);
    expect(result.data[0]).toMatchObject({ id: 'company-1', priority: 'HIGH', isArchived: false });
  });

  it('maps task pagination and deletion through generated endpoints', async () => {
    server.use(
      http.get(`${api}/tasks`, ({ request }) => {
        expect(new URL(request.url).searchParams.get('overdueOnly')).toBe('true');
        expect(new URL(request.url).searchParams.get('status')).toBe('TODO');
        return HttpResponse.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 1, totalPages: 1, hasNext: false, hasPrevious: false }, requestId: 'task-list', timestamp: '2026-08-14T00:00:00.000Z' });
      }),
      http.delete(`${api}/tasks/task-1`, () => HttpResponse.json({ success: true, data: { id: 'task-1' }, requestId: 'task-delete', timestamp: '2026-08-14T00:00:00.000Z' })),
    );

    await expect(tasksService.list({ page: 1, limit: 1, overdueOnly: true, status: 'TODO' })).resolves.toMatchObject({ meta: { total: 0 } });
    await expect(tasksService.remove('task-1')).resolves.toBeUndefined();
  });

  it('exports representative enum, error, pagination, and nullable contracts', () => {
    const priority: CompanyListItem['priority'] = CompanyListItemPriority.HIGH;
    const nullablePhone: Pick<CompanyListItem, 'centralPhone'> = { centralPhone: null };
    const pagination: PaginationMeta = { total: 1, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrevious: false };
    const error: ErrorEnvelope = { success: false, error: { code: 'VALIDATION_ERROR', message: 'invalid' }, requestId: null, timestamp: '2026-08-14T00:00:00.000Z', path: '/api/tasks', method: 'GET', statusCode: 400 };
    expect({ priority, nullablePhone, pagination, error }).toBeTruthy();
  });

  it('exposes the selected generated endpoint functions', () => {
    expect(companiesGet).toBeTypeOf('function');
    expect(tasksGet).toBeTypeOf('function');
    expect(tasksDelete).toBeTypeOf('function');
  });
});
