import { describe, expect, it } from 'vitest';
import { migratePersistedAuthState, normalizeAuthUser } from './authStore';

describe('persisted auth compatibility', () => {
  it('migrates an old user without granting missing permissions', () => {
    const state = migratePersistedAuthState({
      user: { id: 'u-1', fullName: 'کاربر قدیمی', email: 'old@example.test', role: 'ADMIN', team: null },
    });
    expect(state.user).toMatchObject({
      permissions: [],
      teamId: null,
      teamCode: null,
      teamName: null,
      organizationId: null,
      roleId: null,
      roleCode: 'ADMIN',
      roleName: 'ADMIN',
    });
  });

  it('rejects malformed persisted users safely', () => {
    expect(normalizeAuthUser({ role: 'ADMIN', permissions: ['company:view'] })).toBeNull();
    expect(migratePersistedAuthState(null)).toEqual({ user: null });
  });
});
