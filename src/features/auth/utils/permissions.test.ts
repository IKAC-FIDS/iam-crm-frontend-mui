import { describe, expect, it } from 'vitest';
import { testUser } from '@/test/fixtures';
import { can, canAll, canAny } from './permissions';

describe('permission utilities', () => {
  it('allows declared permissions and rejects unknown permissions safely', () => {
    const user = testUser({ permissions: ['activity:view'] });
    expect(can(user, 'activity:view')).toBe(true);
    expect(can(user, 'unknown:permission')).toBe(false);
  });

  it('matches backend any/all permission semantics', () => {
    const user = testUser({ permissions: ['activity:view', 'company:view'] });
    expect(canAny(user, ['missing', 'company:view'])).toBe(true);
    expect(canAll(user, ['activity:view', 'company:view'])).toBe(true);
    expect(canAll(user, ['activity:view', 'missing'])).toBe(false);
    expect(canAny(user, ['missing-a', 'missing-b'])).toBe(false);
  });

  it('does not grant an unconditional shortcut to ADMIN or legacy fallback roles', () => {
    expect(can(testUser({ role: 'ADMIN', permissions: [] }), 'company:view')).toBe(false);
    expect(can(testUser({ role: 'ADMIN', permissions: ['company:view'] }), 'company:view')).toBe(true);
    expect(can(testUser({ role: 'MANAGER', permissions: [] }), 'company:view', ['MANAGER'])).toBe(false);
  });
});
