import { describe, expect, it } from 'vitest';
import { queryClient } from '@/lib/queryClient';
import { testUser } from '@/test/fixtures';
import { useAuthStore } from './authStore';

describe('authStore session state', () => {
  it('stores an authenticated session user', () => {
    const user = testUser();
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clears token, user, and shared query cache on session clear or refresh failure', () => {
    localStorage.setItem('accessToken', 'expired-token');
    useAuthStore.getState().setUser(testUser());
    queryClient.setQueryData(['sensitive'], { secret: 'synthetic' });
    useAuthStore.getState().clearUser();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(queryClient.getQueryData(['sensitive'])).toBeUndefined();
  });
});
