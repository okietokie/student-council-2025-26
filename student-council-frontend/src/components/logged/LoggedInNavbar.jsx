import React, { useEffect, useState } from 'react';
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
  Poll,
  Login,
  HowToReg,
  Person,
  Close,
  Logout,
  RequestPage,
  RequestQuote,
  PersonAdd
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login")
  };

  const navigationItems = [
    { text: 'Home', icon: <Home />, link: "/logged-in/home" },
    { text: 'Posts/Announcements', icon: <Campaign />, link: "/logged-in/posts" },
    { text: 'Polls', icon: <Poll /> , link: "/logged-in/polls"},
    { text: 'Requests', icon: <PersonAdd /> , link: "/logged-in/peers", councilOnly: true}
  ];

  const handleClick = (link) =>{
    navigate(link);
  }
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const getUser = async () => {
    const userString = localStorage.getItem("user");
    // Convert it to an object
    const userData = userString ? JSON.parse(userString) : null;
    setUser(userData);
  }

  useEffect(() => {
    getUser();
  }, [])

  const isCouncil = user?.role === "STUDENT_COUNCIL";
  console.log("is council: ", isCouncil)

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
        {navigationItems.map((item) => {
          if (item.councilOnly && !isCouncil) return null;

          return (
            <ListItemButton
              key={item.text}
              onClick={() => handleClick(item.link)}
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
          );
        })}

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
              startIcon={<Logout />}
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
              Log Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Logout />}
              onClick={() => {
                toggleDrawer(false)();
                handleLogout();
              }}
              sx={{ 
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
            >
              Log Out
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
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2 }
          }}>
            {/* Left side: Logo and Site Name */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2
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
                {navigationItems.map((item) => {
                  if (item.councilOnly && !isCouncil) return null 
                  return (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleClick(item.link)}
                    sx={{ 
                      fontWeight: 'medium',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </Button>)
                })}
                
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
                      startIcon={<Logout />}
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
                      variant="contained"
                      startIcon={<Logout />}
                      onClick={handleLogout}
                      sx={{ 
                        bgcolor: 'secondary.light',
                        '&:hover': {
                          bgcolor: 'secondary.dark'
                        }
                      }}
                    >
                      Log Out
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
      <Outlet />
    </>
  );
};

export default Navbar;