import type { ReactElement, ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rtlCache } from '@/lib/rtlCache';
import theme from '@/theme';
import { useAuthStore, type AuthUser } from '@/store/authStore';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface TestRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  user?: AuthUser | null;
  queryClient?: QueryClient;
}

export function renderWithProviders(ui: ReactElement, options: TestRenderOptions = {}) {
  const { route = '/', user = null, queryClient = createTestQueryClient(), ...renderOptions } = options;
  useAuthStore.setState({ user });
  if (user) localStorage.setItem('accessToken', 'synthetic-access-token');

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>;
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
