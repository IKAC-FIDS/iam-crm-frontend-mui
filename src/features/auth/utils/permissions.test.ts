import { describe, expect, it } from 'vitest';
import { testUser } from '@/test/fixtures';
import { can, canAll, canAny } from './permissions';

describe('permission utilities', () => {
  it('allows declared permissions and rejects unknown permissions safely', () => {
    const user = testUser({ permissions: ['activity:view'] });
    expect(can(user, 'activity:view')).toBe(true);
    expect(can(user, 'unknown:permission')).toBe(false);
  });

  it('supports any/all checks and existing ADMIN behavior', () => {
    const user = testUser({ permissions: ['activity:view', 'company:view'] });
    expect(canAny(user, ['missing', 'company:view'])).toBe(true);
    expect(canAll(user, ['activity:view', 'company:view'])).toBe(true);
    expect(can(testUser({ role: 'ADMIN' }), 'unknown:permission')).toBe(true);
  });
});
