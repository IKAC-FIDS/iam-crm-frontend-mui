import type { Theme } from '@mui/material/styles';
import type { PickerComponents } from '@mui/x-date-pickers/themeAugmentation';

export const datePickersCustomizations: PickerComponents<Theme> = {
  MuiPickerPopper: {
    styleOverrides: {
      paper: ({ theme }) => ({
        marginTop: 4,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
      }),
    },
  },
  // می‌توانید بقیه استایل‌ها را هم اضافه کنید
};
