import { Theme } from '@mui/material/styles';
import { axisClasses, legendClasses, chartsGridClasses } from '@mui/x-charts';
import type { ChartsComponents } from '@mui/x-charts/themeAugmentation';

// از theme موجود استفاده می‌کنیم، نیازی به gray نداریم چون از theme.palette استفاده می‌کنیم
export const chartsCustomizations: ChartsComponents<Theme> = {
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${axisClasses.line}`]: {
          stroke: theme.palette.divider,
        },
        [`& .${axisClasses.tick}`]: { stroke: theme.palette.divider },
        [`& .${axisClasses.tickLabel}`]: {
          fill: theme.palette.text.secondary,
          fontWeight: 500,
        },
      }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      mark: ({ theme }) => ({
        ry: 6,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
      }),
      table: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        background: theme.palette.background.paper,
      }),
    },
  },
  MuiChartsLegend: {
    styleOverrides: {
      root: {
        [`& .${legendClasses.mark}`]: {
          ry: 6,
        },
      },
    },
  },
  MuiChartsGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${chartsGridClasses.line}`]: {
          stroke: theme.palette.divider,
          strokeDasharray: '4 2',
          strokeWidth: 0.8,
        },
      }),
    },
  },
};