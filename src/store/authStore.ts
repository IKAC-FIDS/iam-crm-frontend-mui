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
  permissions: string[];
  organizationId?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
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
    }
  )
);
