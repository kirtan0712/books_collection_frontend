// src/App.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Toolbar, Typography, Button } from '@mui/material';
import AppRoutes from './config/route';
import { logoutUser } from './services/UserServices';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(false); // Default to 'false' (no tab selected)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Check for a token to determine login status first
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    // 2. Define which paths are valid tabs
    const validTabPaths = isLoggedIn 
      ? ['/', '/profile'] 
      : ['/', '/login', '/signup'];
      
    // 3. Set the active tab value only if the current path is a valid tab
    if (validTabPaths.includes(location.pathname)) {
      setValue(location.pathname);
    } else {
      setValue(false); // Otherwise, no tab is active
    }
  }, [location.pathname, isLoggedIn]); // Add isLoggedIn as a dependency

  const handleChange = (event, newValue) => {
    // We don't need to setValue here anymore, as the useEffect will handle it on navigation
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) await logoutUser(refreshToken);
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false); // This will trigger the useEffect to re-evaluate tabs
        navigate('/login');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book App
          </Typography>
          
          {/* 4. Simplified Navigation Section */}
          <Tabs 
            value={value} 
            onChange={handleChange} 
            textColor="inherit" 
            indicatorColor="white"
          >
            {/* Common Tab */}
            <Tab label="Home" value="/" to="/" component={Link} />

            {isLoggedIn ? (
              // Logged-in Tabs
              <Tab label="Profile" value="/profile" to="/profile" component={Link} />
              
            ) : (
              // Logged-out Tabs
              [
                <Tab key="login" label="Login" value="/login" to="/login" component={Link} />,
                <Tab key="signup" label="Sign Up" value="/signup" to="/signup" component={Link} />
              ]
            )}
          </Tabs>

          {/* Logout button appears only when logged in */}
          {isLoggedIn && (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                ml: 2, // margin-left to create space between tabs and button
                backgroundColor: '#ffffff', // white background
                color: '#1976d2', // primary blue text color
                border: '1px solid #1976d2', // optional border
                '&:hover': {
                  backgroundColor: '#e0e0e0', // light grey background on hover
                },
              }}
            >
              Logout
            </Button>
          )}

        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 1, backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
        <AppRoutes />
      </Box>
    </Box>
  );
}

export default App;