// ============================================================
// مسیر: src/theme.ts
// ============================================================

import { createTheme } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations } from './theme/customizations';
import { appTokens } from './theme/tokens';

const palette = {
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
};

const sharedComponents: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
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
      '*:focus-visible': {
        outline: '2px solid var(--color-secondary-main)',
        outlineOffset: 2,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        gap: theme.spacing(1),
        minHeight: '64px',
        [theme.breakpoints.down('sm')]: {
          minHeight: '56px',
          paddingInline: theme.spacing(1.5),
        },
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: appTokens.sizing.buttonHeight,
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: theme.shape.borderRadius,
        paddingInline: theme.spacing(2),
        whiteSpace: 'nowrap',
        flexShrink: 0,
        maxWidth: '100%',
        '& .MuiButton-startIcon': {
          marginInlineStart: theme.spacing(-0.5),
          marginInlineEnd: theme.spacing(1),
        },
        '& .MuiButton-endIcon': {
          marginInlineStart: theme.spacing(1),
          marginInlineEnd: theme.spacing(-0.5),
        },
      }),
      sizeSmall: {
        minHeight: 32,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        width: appTokens.sizing.iconButtonSize,
        height: appTokens.sizing.iconButtonSize,
      },
      sizeSmall: {
        width: 32,
        height: 32,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiAutocomplete: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        minWidth: 0,
      },
      inputRoot: ({ theme }) => ({
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        '& .MuiAutocomplete-input': {
          minWidth: 48,
          textAlign: 'start',
        },
        '& .MuiAutocomplete-input[dir="ltr"], & .MuiAutocomplete-input.ltr, & .MuiAutocomplete-input[data-ltr="true"]': {
          textAlign: 'start',
        },
      }),
      option: {
        justifyContent: 'flex-start',
        textAlign: 'start',
      },
      tag: {
        maxWidth: '100%',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        minWidth: 0,
      },
      input: {
        textAlign: 'start',
        minWidth: 0,
        '&::placeholder': {
          textAlign: 'start',
        },
        '&[dir="ltr"], &.ltr, &[data-ltr="true"]': {
          textAlign: 'start',
          '&::placeholder': {
            textAlign: 'start',
          },
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: appTokens.sizing.inputHeight,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      }),
      notchedOutline: {
        textAlign: 'start',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        textAlign: 'start',
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: ({ theme }) => ({
        textAlign: 'start',
        minWidth: 0,
        paddingInlineStart: theme.spacing(1.75),
        paddingInlineEnd: theme.spacing(4.5),
        '&[dir="ltr"], &.ltr, &[data-ltr="true"]': {
          textAlign: 'start',
        },
      }),
      icon: ({ theme }) => ({
        insetInlineEnd: theme.spacing(1),
        insetInlineStart: 'auto',
      }),
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        flexShrink: 0,
        '&.MuiInputAdornment-positionStart': {
          marginInlineStart: 0,
          marginInlineEnd: theme.spacing(1),
        },
        '&.MuiInputAdornment-positionEnd': {
          marginInlineStart: theme.spacing(1),
          marginInlineEnd: 0,
        },
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginInlineStart: theme.spacing(0.25),
        marginInlineEnd: theme.spacing(0.25),
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: 'var(--color-bg-paper)',
      },
      rounded: {
        borderRadius: appTokens.radius.md,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: 'var(--color-bg-paper)',
        borderColor: 'var(--color-divider)',
        boxShadow: appTokens.shadow.card,
      },
    },
  },
  MuiDialog: {
    defaultProps: {
      fullWidth: true,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: appTokens.radius.lg,
        margin: theme.spacing(2),
        backgroundImage: 'none',
        [theme.breakpoints.down('sm')]: {
          width: `calc(100% - ${theme.spacing(2)})`,
          maxHeight: `calc(100% - ${theme.spacing(2)})`,
          margin: theme.spacing(1),
        },
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2.25, 3, 1),
        fontWeight: 700,
        [theme.breakpoints.down('sm')]: {
          padding: theme.spacing(2, 2, 1),
        },
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2, 3),
        [theme.breakpoints.down('sm')]: {
          padding: theme.spacing(2),
        },
      }),
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        gap: theme.spacing(1),
        padding: theme.spacing(1, 3, 2.5),
        [theme.breakpoints.down('sm')]: {
          alignItems: 'stretch',
          flexDirection: 'column-reverse',
          padding: theme.spacing(1, 2, 2),
          '& > :not(style) ~ :not(style)': {
            marginInlineStart: 0,
          },
        },
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
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
  MuiTableContainer: {
    styleOverrides: {
      root: {
        overflowX: 'auto',
      },
    },
  },
  MuiTable: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
        paddingBlock: theme.spacing(1.25),
      }),
      head: {
        fontWeight: 700,
        color: palette.text.secondary,
        backgroundColor: palette.background.default,
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 48,
        paddingInline: theme.spacing(1),
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: 48,
        fontWeight: 700,
        textTransform: 'none',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        alignItems: 'center',
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        boxShadow: appTokens.shadow.popover,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        justifyContent: 'flex-start',
        textAlign: 'start',
      },
    },
  },
  MuiTablePagination: {
    defaultProps: {
      labelRowsPerPage: 'تعداد ردیف در صفحه',
      labelDisplayedRows: ({ from, to, count }) => `از ${from} تا ${to} از ${count === -1 ? `بیش از ${to}` : count}`,
    },
    styleOverrides: {
      toolbar: ({ theme }) => ({
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        justifyContent: 'flex-end',
      }),
      selectLabel: {
        margin: 0,
      },
      displayedRows: {
        margin: 0,
      },
      actions: {
        marginInlineStart: 0,
      },
    },
  },
  MuiPagination: {
    defaultProps: {
      showFirstButton: true,
      showLastButton: true,
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
  },
};

const theme = createTheme({
  direction: 'rtl',
  palette,
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"BYekan", "Vazirmatn", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, lineHeight: 1.35 },
    h5: { fontWeight: 800, lineHeight: 1.4 },
    h6: { fontWeight: 700, lineHeight: 1.45 },
    subtitle1: { fontWeight: 700 },
    button: { fontWeight: 700 },
    caption: { lineHeight: 1.7 },
  },
  shape: {
    borderRadius: appTokens.radius.md,
  },
  shadows: [
    'none',
    appTokens.shadow.card,
    '0 2px 8px rgba(15, 23, 42, 0.08)',
    '0 4px 14px rgba(15, 23, 42, 0.10)',
    appTokens.shadow.popover,
    '0 12px 32px rgba(15, 23, 42, 0.14)',
    '0 16px 40px rgba(15, 23, 42, 0.16)',
    '0 20px 48px rgba(15, 23, 42, 0.18)',
    ...Array(17).fill('0 20px 48px rgba(15, 23, 42, 0.18)'),
  ] as Theme['shadows'],
  components: {
    ...sharedComponents,
    ...dataGridCustomizations,
    ...chartsCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
  },
});

export default theme;
