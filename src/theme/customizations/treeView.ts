import type { Theme } from '@mui/material/styles';
import type { TreeViewComponents } from '@mui/x-tree-view/themeAugmentation';

export const treeViewCustomizations: TreeViewComponents<Theme> = {
  MuiTreeItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(0, 1),
        '& .groupTransition': {
          marginLeft: theme.spacing(2),
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }),
      content: ({ theme }) => ({
        marginTop: theme.spacing(1),
        padding: theme.spacing(0.5, 1),
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        '&.selected': {
          backgroundColor: theme.palette.action.selected,
        },
      }),
    },
  },
};
