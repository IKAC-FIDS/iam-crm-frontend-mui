import type { Theme } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';
import type { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';

export const dataGridCustomizations: DataGridComponents<Theme> = {
  MuiDataGrid: {
    defaultProps: {
      localeText: {
        noRowsLabel: 'داده‌ای برای نمایش وجود ندارد.',
        noResultsOverlayLabel: 'نتیجه‌ای یافت نشد.',
        footerTotalRows: 'کل ردیف‌ها:',
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '--DataGrid-overlayHeight': '300px',
        overflow: 'clip',
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.default,
        [`& .${gridClasses.columnHeader}`]: {
          backgroundColor: theme.palette.background.paper,
        },
        [`& .${gridClasses.columnHeaderTitleContainer}`]: {
          justifyContent: 'flex-start',
        },
        [`& .${gridClasses.columnHeaderTitle}`]: {
          textAlign: 'start',
        },
        [`& .${gridClasses.footerContainer}`]: {
          backgroundColor: theme.palette.background.paper,
        },
        [`& .${gridClasses.cell}`]: {
          textAlign: 'start',
          justifyContent: 'flex-start',
        },
        [`& .${gridClasses.cell}.MuiDataGrid-cell--textCenter`]: {
          justifyContent: 'center',
          textAlign: 'center',
        },
      }),
      cell: ({ theme }) => ({
        borderTopColor: theme.palette.divider,
      }),
      row: ({ theme }) => ({
        '&:last-of-type': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-selected': {
          background: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }),
    },
  },
};
