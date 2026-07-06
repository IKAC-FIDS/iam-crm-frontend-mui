// ============================================================
// مسیر: src/main.tsx
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/theme.css';
import './styles/globals.css';
import './index.css';

document.documentElement.dir = 'rtl';
document.documentElement.lang = 'fa';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);