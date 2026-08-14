// ============================================================
// مسیر: src/store/authStore.ts
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '@/lib/queryClient';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  team: string | null;
  teamId: string | null;
  teamCode: string | null;
  teamName: string | null;
  permissions: string[];
  organizationId: string | null;
  roleId: string | null;
  roleCode: string;
  roleName: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.fullName !== 'string' || typeof candidate.email !== 'string' || typeof candidate.role !== 'string') return null;
  const permissions = Array.isArray(candidate.permissions)
    ? candidate.permissions.filter((permission): permission is string => typeof permission === 'string')
    : [];
  const team = nullableString(candidate.team);
  return {
    id: candidate.id,
    fullName: candidate.fullName,
    email: candidate.email,
    role: candidate.role,
    team,
    teamId: nullableString(candidate.teamId),
    teamCode: nullableString(candidate.teamCode),
    teamName: nullableString(candidate.teamName) ?? team,
    permissions,
    organizationId: nullableString(candidate.organizationId),
    roleId: nullableString(candidate.roleId),
    roleCode: typeof candidate.roleCode === 'string' ? candidate.roleCode : candidate.role,
    roleName: typeof candidate.roleName === 'string' ? candidate.roleName : candidate.role,
  };
}

export function migratePersistedAuthState(value: unknown): Pick<AuthState, 'user'> {
  if (!value || typeof value !== 'object') return { user: null };
  return { user: normalizeAuthUser((value as Record<string, unknown>).user) };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        localStorage.removeItem('accessToken');
        queryClient.clear();
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      version: 2,
      migrate: (persistedState) => migratePersistedAuthState(persistedState),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...migratePersistedAuthState(persistedState),
      }),
    }
  )
);
