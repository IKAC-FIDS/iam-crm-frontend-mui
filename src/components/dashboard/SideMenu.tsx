import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useAuthStore } from '@/store/authStore';
import { appTokens } from '@/theme/tokens';
import { getVisibleMenuRoutes, isMenuRouteActive } from '@/routes/routeNavigation';

const drawerWidth = appTokens.layout.drawerWidth;
const rtlDrawerAnchor = 'left';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderInlineEnd: `1px solid ${theme.palette.divider}`,
  },
}));

interface SideMenuProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ mobileOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const visibleMenuItems = getVisibleMenuRoutes(user);
  const groups = Array.from(new Set(visibleMenuItems.map((item) => item.menu!.group)));

  const menuContent = (
    <>
      <Toolbar />
      <List sx={{ mt: 1 }}>
        {groups.map((group, index) => (
          <List
            key={group}
            disablePadding
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent', lineHeight: 2.5 }}>
                {group}
              </ListSubheader>
            }
          >
            {index > 0 && <Divider sx={{ mx: 2, mb: 1 }} />}
            {visibleMenuItems.filter((item) => item.menu!.group === group).map((item) => {
              const Icon = item.menu!.icon;
              return <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={isMenuRouteActive(item.fullPath, location.pathname)}
                  onClick={() => {
                    navigate(item.fullPath);
                    onClose();
                  }}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    justifyContent: 'flex-start',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Icon /></ListItemIcon>
                  <ListItemText primary={item.menu!.label} />
                </ListItemButton>
              </ListItem>;
            })}
          </List>
        ))}
      </List>
    </>
  );

  return (
    <>
      <StyledDrawer
        variant="temporary"
        anchor={rtlDrawerAnchor}
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        anchor={rtlDrawerAnchor}
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {menuContent}
      </StyledDrawer>
    </>
  );
}
