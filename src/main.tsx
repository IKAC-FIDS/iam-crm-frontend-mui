// ============================================================
// مسیر: src/main.tsx
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './app/App';
import theme from './theme';
import './index.css'; // ← اضافه کنید
import './styles/globals.css'; // ← اگر globals.css حاوی فونت‌هاست، آن را هم نگه دارید

document.documentElement.dir = 'rtl';
document.documentElement.lang = 'fa';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
