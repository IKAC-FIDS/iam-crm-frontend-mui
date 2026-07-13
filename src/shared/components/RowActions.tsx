import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { IconButtonProps } from '@mui/material/IconButton';

export interface RowAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  color?: IconButtonProps['color'];
  disabled?: boolean;
  loading?: boolean;
  visible?: boolean;
  menuOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export function RowActionButton({ action }: { action: RowAction }) {
  if (action.visible === false) return null;

  return (
    <Tooltip title={action.label}>
      <span>
        <IconButton
          size="small"
          color={action.color}
          disabled={action.disabled || action.loading}
          aria-label={action.label}
          {...(action.href ? { component: 'a' as const, href: action.href, target: action.target, rel: action.rel } : {})}
          onClick={(event) => {
            event.stopPropagation();
            action.onClick(event);
          }}
        >
          {action.loading ? <CircularProgress size={18} color="inherit" /> : action.icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export function RowActions({ actions, maxInline = 2 }: { actions: RowAction[]; maxInline?: number }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const visibleActions = actions.filter((action) => action.visible !== false);
  const directActions = visibleActions.filter((action) => !action.menuOnly).slice(0, maxInline);
  const directKeys = new Set(directActions.map((action) => action.key));
  const menuActions = visibleActions.filter((action) => action.menuOnly || !directKeys.has(action.key));
  const menuOpen = Boolean(anchorEl);

  if (visibleActions.length === 0) return null;

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {directActions.map((action) => (
        <RowActionButton key={action.key} action={action} />
      ))}
      {menuActions.length > 0 && (
        <>
          <Tooltip title="عملیات بیشتر">
            <span>
              <IconButton
                size="small"
                aria-label="عملیات بیشتر"
                aria-controls={menuOpen ? 'row-actions-menu' : undefined}
                aria-haspopup="menu"
                aria-expanded={menuOpen ? 'true' : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            id="row-actions-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            onClick={(event) => event.stopPropagation()}
            slotProps={{
              paper: {
                sx: { minWidth: 180 },
              },
            }}
          >
            {menuActions.map((action) => (
              <MenuItem
                key={action.key}
                disabled={action.disabled || action.loading}
                {...(action.href ? { component: 'a' as const, href: action.href, target: action.target, rel: action.rel } : {})}
                onClick={(event) => {
                  setAnchorEl(null);
                  action.onClick(event);
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: action.color ? `${action.color}.main` : 'inherit' }}>
                  {action.loading ? <CircularProgress size={18} color="inherit" /> : action.icon}
                </ListItemIcon>
                <ListItemText primary={action.label} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
}
