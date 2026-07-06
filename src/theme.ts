// ============================================================
// مسیر: src/theme.ts
// ============================================================

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#001736',
      light: '#123B70',
      dark: '#000B1A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A6B2',
      light: '#33C5CF',
      dark: '#007C86',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
    success: {
      main: '#16A34A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      contrastText: '#0F172A',
    },
    error: {
      main: '#DC2626',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2563EB',
      contrastText: '#FFFFFF',
    },
    action: {
      hover: 'rgba(18, 59, 112, 0.08)',
      selected: 'rgba(18, 59, 112, 0.14)',
      disabled: 'rgba(15, 23, 42, 0.38)',
      disabledBackground: 'rgba(15, 23, 42, 0.12)',
    },
  },
  typography: {
    fontFamily: '"BYekan", "Vazirmatn", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          direction: 'rtl',
          backgroundColor: 'var(--color-bg-default)',
        },
        body: {
          backgroundColor: 'var(--color-bg-default)',
          color: 'var(--color-text-primary)',
        },
        '#root': {
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-default)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 'var(--radius-md)',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: 'var(--color-primary-main)',
            color: 'var(--color-primary-contrast)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-light)',
            },
            '&:active': {
              backgroundColor: 'var(--color-primary-dark)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: 'var(--color-secondary-main)',
            color: 'var(--color-secondary-contrast)',
            '&:hover': {
              backgroundColor: 'var(--color-secondary-light)',
            },
            '&:active': {
              backgroundColor: 'var(--color-secondary-dark)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: 'var(--color-primary-main)',
            color: 'var(--color-primary-main)',
            '&:hover': {
              borderColor: 'var(--color-primary-light)',
              backgroundColor: 'var(--color-action-hover)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            borderColor: 'var(--color-secondary-main)',
            color: 'var(--color-secondary-main)',
            '&:hover': {
              borderColor: 'var(--color-secondary-dark)',
              backgroundColor: 'rgba(0, 166, 178, 0.08)',
            },
          },
        },
      ],
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-md)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--color-bg-paper)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--color-bg-paper)',
          borderColor: 'var(--color-divider)',
          boxShadow: 'var(--shadow-card)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'var(--color-divider)',
        },
      },
    },
  },
});

export default theme;