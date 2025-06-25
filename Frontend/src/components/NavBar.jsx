import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed"  sx={{ top:0 }} style={{marginBottom:'10px'}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Journal
        </Typography>

        {isAuthenticated && (
          <>
            <Tooltip title="Profile">
              <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#1976d2',border: '1px solid white' }}>
                  {localStorage.getItem('token') ? 'U' : '?'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {/* Future: Add "My Profile" or "Settings" here */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}

        {!isAuthenticated && (
          <Typography
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer' }}
          >
            Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
