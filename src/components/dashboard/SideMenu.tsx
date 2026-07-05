import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

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

const menuItems = [
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'شرکت‌ها', icon: <BusinessIcon />, path: '/companies' },
  { text: 'پایپ‌لاین', icon: <ViewKanbanIcon />, path: '/pipeline' },
];

interface SideMenuProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ mobileOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuContent = (
    <>
      <Toolbar />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
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
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        anchor="right"
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {menuContent}
      </StyledDrawer>
    </>
  );
}
