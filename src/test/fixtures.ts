import type { AuthUser } from '@/store/authStore';
import type { Organization } from '@/features/organizations/types/organization.types';
import type { LatestActivity } from '@/features/activities/types/activity.types';

export const tenantA: Organization = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'TENANT_A',
  name: 'سازمان آزمایشی الف',
  status: 'ACTIVE',
  timezone: 'Asia/Tehran',
  locale: 'fa-IR',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const tenantB: Organization = {
  ...tenantA,
  id: '22222222-2222-4222-8222-222222222222',
  code: 'TENANT_B',
  name: 'سازمان آزمایشی ب',
};

export function testUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    fullName: 'کاربر آزمایشی',
    email: 'user@example.test',
    role: 'REP',
    team: 'تیم آزمایشی',
    teamId: null,
    teamCode: null,
    teamName: 'تیم آزمایشی',
    permissions: [],
    organizationId: tenantA.id,
    roleId: null,
    roleCode: 'REP',
    roleName: 'کارشناس فروش',
    ...overrides,
  };
}

export const latestActivity: LatestActivity = {
  id: '33333333-3333-4333-8333-333333333333',
  type: 'CALL',
  title: 'CALL',
  activityDate: '2026-07-30T08:30:00.000Z',
  person: { id: '44444444-4444-4444-8444-444444444444', fullName: 'مخاطب آزمایشی' },
  company: { id: '55555555-5555-4555-8555-555555555555', legalName: 'شرکت آزمایشی' },
  createdBy: { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', fullName: 'کاربر آزمایشی' },
};
