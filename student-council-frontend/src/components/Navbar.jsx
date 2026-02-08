import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
  ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  Home,
  Campaign,
  Groups,
  Login,
  HowToReg,
  Person,
  Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // If already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Otherwise navigate to homepage
      navigate('/');
    }
  };

  const handleAnnouncementsClick = () => {
    if (location.pathname === '/') {
      // If on homepage, scroll to announcements section
      const announcementsSection = document.getElementById('announcements-section');
      if (announcementsSection) {
        announcementsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise navigate to homepage and then scroll to announcements
      navigate('/');
      setTimeout(() => {
        const announcementsSection = document.getElementById('announcements-section');
        if (announcementsSection) {
          announcementsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleCouncilClick = () => {
    if (location.pathname === '/') {
      // If on homepage, scroll to council section
      const councilSection = document.getElementById('council-section');
      if (councilSection) {
        councilSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise navigate to homepage and then scroll to council
      navigate('/');
      setTimeout(() => {
        const councilSection = document.getElementById('council-section');
        if (councilSection) {
          councilSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogin = () => {
    if(!isLoggedIn){
      navigate('/login');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const navigationItems = [
    { 
      text: 'Home', 
      icon: <Home />, 
      onClick: handleHomeClick,
      isScroll: false
    },
    { 
      text: 'Announcements', 
      icon: <Campaign />, 
      onClick: handleAnnouncementsClick,
      isScroll: true,
      sectionId: 'announcements-section'
    },
    { 
      text: 'Meet the Council', 
      icon: <Groups />, 
      onClick: handleCouncilClick,
      isScroll: true,
      sectionId: 'council-section'
    }
  ];

  const handleDrawerItemClick = (item) => {
    item.onClick();
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const MobileDrawer = () => (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box sx={{ 
        width: 280, 
        p: 3, 
        bgcolor: 'primary.dark', 
        color: 'white', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
        <List sx={{ flexGrow: 1 }}>
          {navigationItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleDrawerItemClick(item)}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Box sx={{ mr: 2, color: 'white' }}>{item.icon}</Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ color: 'white' }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />
        {isLoggedIn ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)'
            }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'secondary.light',
                mr: 2,
                color: 'white'
              }}>
                {user?.name?.[0] || 'U'}
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'white' }}>
                  {user?.name || 'User'}
                </Typography>
                <Chip
                  label={user?.role || 'Student'}
                  size="small"
                  sx={{ 
                    mt: 0.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '0.65rem',
                    height: 20
                  }}
                />
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Person />}
              onClick={() => {
                toggleDrawer(false)();
                // Navigate to profile
              }}
              sx={{ 
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Login />}
              onClick={() => {
                toggleDrawer(false)();
                handleLogout();
              }}
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Login />}
              onClick={() => {
                toggleDrawer(false)();
                handleLogin();
              }}
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<HowToReg />}
              onClick={() => {
                toggleDrawer(false)();
                handleSignUp();
              }}
              sx={{ 
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ 
        bgcolor: 'primary.main',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        zIndex: theme.zIndex.drawer + 1
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2 }
          }}>
            {/* Left side: Logo and Site Name */}
            <Box 
            onClick={() => navigate("/")}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              "&:hover": {
                cursor: "grab"
              }
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'white',
                color: 'primary.main'
              }}>
                <School sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: 0.5
              }}>
                Student Council Portal
              </Typography>
            </Box>

            {/* Right side: Navigation Items */}
            {!isMobile ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2
              }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={item.onClick}
                    sx={{ 
                      fontWeight: 'medium',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {isLoggedIn ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    ml: 2,
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }}>
                    <Avatar sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'secondary.light',
                      color: 'white'
                    }}>
                      {user?.name?.[0] || 'U'}
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'white' }}>
                        {user?.name || 'User'}
                      </Typography>
                      <Chip
                        label={user?.role || 'Student'}
                        size="small"
                        sx={{ 
                          bgcolor: 'primary.light',
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 18
                        }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Login />}
                      onClick={handleLogout}
                      sx={{ 
                        ml: 1,
                        color: 'white',
                        borderColor: 'white',
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Login />}
                      onClick={handleLogin}
                      sx={{ 
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<HowToReg />}
                      onClick={handleSignUp}
                      sx={{ 
                        bgcolor: 'secondary.light',
                        '&:hover': {
                          bgcolor: 'secondary.dark'
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <IconButton 
                color="inherit" 
                onClick={toggleDrawer(true)}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <MobileDrawer />
    </>
  );
};

export default Navbar;