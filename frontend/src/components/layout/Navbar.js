import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'primary.main',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Health & Wellness Companion
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.firstName?.charAt(0) || <AccountCircle />}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.firstName || 'User'}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;