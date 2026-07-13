// ============================================================
// مسیر: src/app/App.tsx
// ============================================================

import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Toaster } from 'sonner';
import { CacheProvider } from '@emotion/react';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { rtlCache } from '@/lib/rtlCache';

function App() {
  return (
    <QueryProvider>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </CacheProvider>
    </QueryProvider>
  );
}

export default App;
