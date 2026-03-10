import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MonitorHeart as BiometricIcon,
  Psychology as RecommendationIcon,
  EmojiEvents as GoalsIcon,
  Group as CommunityIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Profile',
    icon: <PersonIcon />,
    path: '/profile',
  },
  {
    text: 'Biometric Data',
    icon: <BiometricIcon />,
    path: '/biometric-data',
  },
  {
    text: 'Recommendations',
    icon: <RecommendationIcon />,
    path: '/recommendations',
  },
  {
    text: 'Goals',
    icon: <GoalsIcon />,
    path: '/goals',
  },
  {
    text: 'Community',
    icon: <CommunityIcon />,
    path: '/community',
  },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const displayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'User';

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      {/* User Info Section */}
      <Box sx={{ p: 2, mt: 8 }}>
        <Typography variant="h6" noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Level {user?.level || 1} • {user?.points || 0} points
        </Typography>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Navigation */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;