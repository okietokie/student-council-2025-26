import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  Chip, Stack, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Badge, Divider, Tooltip, IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle, Cancel, Person, Groups, HowToReg,
  PersonAdd, Warning, School, AdminPanelSettings,
  PendingActions, VerifiedUser, Block,
  Delete, Security, Shield, PersonRemove,
  KeyOff, Key, Star, StarBorder
} from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Peers() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, user: null, action: '', title: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();

  // Check authorization
  const isChairPerson = userData?.councilPosition === 'CHAIRPERSON' || userData?.councilPosition === 'CHAIRMAN';
  const canMakeAdmin = userData?.role === 'STUDENT_COUNCIL' && isChairPerson;
  const canRemovePeer = userData?.admin;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user || user?.role !== "STUDENT_COUNCIL") {
      navigate('/logged-in/403');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchPeers();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get('/user/get-user-data');
      setUserData(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchPeers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/user/get-peers');
      setPeers(response.data.peers || []);
    } catch (error) {
      console.error('Failed to fetch peers:', error);
      setError('Failed to fetch peers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openActionDialog = (user, action) => {
    let title = '';
    let message = '';
    
    switch(action) {
      case 'approve':
        title = 'Approve User';
        message = `Are you sure you want to approve ${user.name}?`;
        break;
      case 'reject':
        title = 'Reject User Request';
        message = `Are you sure you want to reject ${user.name}'s request?`;
        break;
      case 'remove':
        title = 'Remove User';
        message = `Are you sure you want to remove ${user.name} from the system? This action cannot be undone.`;
        break;
      case 'make-admin':
        title = 'Make Admin';
        message = `Are you sure you want to give admin privileges to ${user.name}?`;
        break;
      case 'remove-admin':
        title = 'Remove Admin';
        message = `Are you sure you want to remove admin privileges from ${user.name}?`;
        break;
    }
    
    setActionDialog({ open: true, user, action, title, message });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, user: null, action: '', title: '', message: '' });
  };

  const handleAction = async () => {
    if (!actionDialog.user) return;
    
    setActionLoading(true);
    try {
      let response;
      
      switch(actionDialog.action) {
        case 'approve':
          response = await axiosClient.post(`/admin/approve-user/${actionDialog.user._id}`);
          showSnackbar(`Approved ${actionDialog.user.name} successfully!`);
          break;
        case 'reject':
          response = await axiosClient.post(`/admin/reject-user/${actionDialog.user._id}`);
          showSnackbar(`Rejected ${actionDialog.user.name}'s request`);
          break;
        case 'remove':
          response = await axiosClient.delete(`/admin/remove/${actionDialog.user._id}`);
          showSnackbar(`Removed ${actionDialog.user.name} from the system`);
          break;
        case 'make-admin':
          response = await axiosClient.patch(`/admin/make-admin/${actionDialog.user._id}`);
          showSnackbar(`Made ${actionDialog.user.name} an admin`);
          break;
        case 'remove-admin':
          response = await axiosClient.patch(`/admin/remove-admin/${actionDialog.user._id}`);
          showSnackbar(`Removed admin privileges from ${actionDialog.user.name}`);
          break;
      }

      // Update local state
      if (actionDialog.action === 'remove') {
        setPeers(prevPeers => prevPeers.filter(user => user._id !== actionDialog.user._id));
      } else {
        setPeers(prevPeers => 
          prevPeers.map(user => {
            if (user._id === actionDialog.user._id) {
              const updatedUser = { ...user };
              switch(actionDialog.action) {
                case 'approve':
                  updatedUser.approvalStatus = 'APPROVED';
                  updatedUser.approvedBy = userData?._id;
                  break;
                case 'reject':
                  updatedUser.approvalStatus = 'REJECTED';
                  updatedUser.approvedBy = userData?._id;
                  break;
                case 'make-admin':
                  updatedUser.admin = true;
                  break;
                case 'remove-admin':
                  updatedUser.admin = false;
                  break;
              }
              return updatedUser;
            }
            return user;
          })
        );
      }
      
      closeActionDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || `Failed to ${actionDialog.action} user`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter peers
  const pendingPeers = peers.filter(user => user.approvalStatus === 'PENDING');
  const approvedPeers = peers.filter(user => user.approvalStatus === 'APPROVED');
  const rejectedPeers = peers.filter(user => user.approvalStatus === 'REJECTED');
  const adminPeers = peers.filter(user => user?.admin);
  const allPeers = peers;

  console.log("peers: ", peers);
  // Button styling with 3D effects
  const getButtonStyle = (color) => ({
    fontWeight: 600,
    borderRadius: 3,
    px: 2,
    py: 1,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows[3],
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6],
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: theme.shadows[2],
    }
  });

  const getIconButtonStyle = (color) => ({
    borderRadius: 2,
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows[2],
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: theme.shadows[1],
    }
  });

  const renderUserRoleChip = (user) => {
    const getRoleConfig = () => {
      if (user.role === 'STUDENT_COUNCIL') {
        if (user.councilPosition === 'CLASS_REP') return { label: 'Class Rep', color: 'primary', icon: <School /> };
        if (user.councilPosition === 'CHAIRMAN') return { label: 'Chairman', color: 'info', icon: <Shield /> };
        if (user.councilPosition === 'SPORTS_SECRETARY') return { label: 'Sports Secretary', color: 'success', icon: <Person /> };
        if (user.councilPosition === 'ARTS_SECRETARY') return { label: 'Arts Secretary', color: 'warning', icon: <Person /> };
        return { label: 'CHAIRPERSON', color: 'info', icon: <Shield /> };
      }
      return { label: 'Student', color: 'default', icon: <Person /> };
    };

    const config = getRoleConfig();
    return (
      <Chip
        size="small"
        label={config.label}
        color={config.color}
        icon={config.icon}
        sx={{ 
          ml: 1,
          fontWeight: 600,
          boxShadow: theme.shadows[1]
        }}
      />
    );
  };

  const renderApprovalStatusChip = (user) => {
    switch (user.approvalStatus) {
      case 'PENDING':
        return (
          <Chip
            size="small"
            label="Pending"
            color="warning"
            icon={<PendingActions />}
            sx={{ 
              ml: 1,
              fontWeight: 600,
              boxShadow: theme.shadows[1]
            }}
          />
        );
      case 'APPROVED':
        return (
          <Chip
            size="small"
            label="Approved"
            color="success"
            icon={<VerifiedUser />}
            sx={{ 
              ml: 1,
              fontWeight: 600,
              boxShadow: theme.shadows[1]
            }}
          />
        );
      case 'REJECTED':
        return (
          <Chip
            size="small"
            label="Rejected"
            color="error"
            icon={<Block />}
            sx={{ 
              ml: 1,
              fontWeight: 600,
              boxShadow: theme.shadows[1]
            }}
          />
        );
      default:
        return null;
    }
  };

  const getUserInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (user) => {
    if (user?.admin) return theme.palette.error.main;
    if (user?.approvalStatus === 'PENDING') return theme.palette.warning.main;
    if (user?.approvalStatus === 'APPROVED') return theme.palette.success.main;
    if (user?.approvalStatus === 'REJECTED') return theme.palette.error.main;
    return theme.palette.primary.main;
  };

  const canApproveReject = (user) => {
    if (!userData) return false;
    if (userData.admin) return true;
    
    if (
      userData.role === 'STUDENT_COUNCIL' && 
      userData.councilPosition === 'CLASS_REP' &&
      user.className === userData.className &&
      user.role !== 'STUDENT_COUNCIL'
    ) {
      return true;
    }

    if (userData.role === "STUDENT_COUNCIL" && userData.councilPosition !== "CLASS_REP"){
      return true;
    }
    return false;
  };

  const canManageUser = (user) => {
    if (user._id === userData?._id) return false;
    return true;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header with 3D effect */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: theme.shadows[4],
        color: 'white'
      }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <Groups sx={{ mr: 2, verticalAlign: 'middle', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          Student Management
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {userData?.councilPosition === 'CLASS_REP' 
            ? `Manage students in ${userData?.className}`
            : userData?.admin 
              ? 'Manage all students'
              : 'View your peers'}
        </Typography>
      </Box>

      {/* Enhanced Tabs with 3D effect */}
      <Box sx={{ 
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: theme.shadows[2],
        overflow: 'hidden'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              minHeight: 60,
              '&.Mui-selected': {
                bgcolor: 'action.hover',
              }
            }
          }}
        >
          <Tab 
            icon={
              <Badge badgeContent={pendingPeers.length} color="error">
                <PersonAdd />
              </Badge>
            }
            label="Pending Requests"
          />
          <Tab 
            icon={
              <Badge badgeContent={approvedPeers.length} color="success">
                <CheckCircle />
              </Badge>
            }
            label="Approved"
          />
          <Tab 
            icon={
              <Badge badgeContent={rejectedPeers.length} color="error">
                <Cancel />
              </Badge>
            }
            label="Rejected"
          />
          <Tab 
            icon={
              <Badge badgeContent={adminPeers.length} color="warning">
                <Security />
              </Badge>
            }
            label="Admins"
          />
          <Tab 
            icon={
              <Badge badgeContent={allPeers.length} color="info">
                <Groups />
              </Badge>
            }
            label="All Peers"
          />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2, boxShadow: theme.shadows[1] }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Pending Requests Tab */}
          <TabPanel value={tabValue} index={0}>
            {pendingPeers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
                No pending approval requests at the moment
              </Alert>
            ) : (
              <Stack spacing={2}>
                {pendingPeers.map((user) => (
                  <Card key={user._id} sx={{ 
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[6],
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user),
                              width: 60,
                              height: 60,
                              mr: 3,
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
                              boxShadow: theme.shadows[3]
                            }}
                          >
                            {getUserInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                size="small"
                                label={user.className || 'No Class'}
                                sx={{ 
                                  bgcolor: theme.palette.secondary.main,
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              {renderUserRoleChip(user)}
                              {renderApprovalStatusChip(user)}
                            </Box>
                          </Box>
                        </Box>
                        
                        {canApproveReject(user) && canManageUser(user) && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Approve User">
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => openActionDialog(user, 'approve')}
                                sx={getButtonStyle('success')}
                              >
                                Approve
                              </Button>
                            </Tooltip>
                            <Tooltip title="Reject Request">
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => openActionDialog(user, 'reject')}
                                sx={getButtonStyle('error')}
                              >
                                Reject
                              </Button>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </TabPanel>

          {/* Approved Peers Tab */}
          <TabPanel value={tabValue} index={1}>
            {approvedPeers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
                No approved peers yet
              </Alert>
            ) : (
              <Box>
                {userData?.councilPosition !== "CLASS_REP" ? (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" gutterBottom>
                      Grouped by Class
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    {Object.entries(
                      approvedPeers.reduce((acc, user) => {
                        const className = user.className || 'Unassigned';
                        if (!acc[className]) acc[className] = [];
                        acc[className].push(user);
                        return acc;
                      }, {})
                    ).map(([className, classUsers]) => (
                      <Box key={className} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {className}
                          <Chip 
                            label={`${classUsers.length} members`} 
                            size="small" 
                            sx={{ ml: 2, fontWeight: 600 }}
                          />
                        </Typography>
                        <Stack spacing={1}>
                          {classUsers.map((user) => (
                            <Card key={user._id} variant="outlined" sx={{ borderRadius: 2 }}>
                              <CardContent sx={{ py: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: getAvatarColor(user),
                                        width: 45,
                                        height: 45,
                                        mr: 2,
                                        fontSize: '0.875rem',
                                        boxShadow: theme.shadows[1]
                                      }}
                                    >
                                      {getUserInitials(user.name)}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body1" fontWeight="medium">
                                        {user.name}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                        {renderUserRoleChip(user)}
                                        {user.admin && (
                                          <Chip
                                            size="small"
                                            label="Admin"
                                            color="error"
                                            icon={<Security />}
                                            sx={{ fontWeight: 600 }}
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {canMakeAdmin && !user.admin && canManageUser(user) && (
                                      <Tooltip title="Make Admin">
                                        <IconButton
                                          size="small"
                                          color="warning"
                                          onClick={() => openActionDialog(user, 'make-admin')}
                                          sx={getIconButtonStyle('warning')}
                                        >
                                          <StarBorder />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {canRemovePeer && canManageUser(user) && (
                                      <Tooltip title="Remove User">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => openActionDialog(user, 'remove')}
                                          sx={getIconButtonStyle('error')}
                                        >
                                          <Delete />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </>
                ) :(
                                    <Stack spacing={2}>
                    {approvedPeers.map((user) => (
                      <Card key={user._id} sx={{ 
                        borderRadius: 2,
                        boxShadow: theme.shadows[1],
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[3],
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              <Avatar
                                sx={{
                                  bgcolor: getAvatarColor(user),
                                  width: 56,
                                  height: 56,
                                  mr: 2,
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  boxShadow: theme.shadows[2]
                                }}
                              >
                                {getUserInitials(user.name)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {user.email}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                  <Chip
                                    size="small"
                                    label={user.className || 'No Class'}
                                    sx={{ 
                                      bgcolor: theme.palette.secondary.main,
                                      color: 'white',
                                      fontWeight: 600
                                    }}
                                  />
                                  {renderUserRoleChip(user)}
                                  {user.admin && (
                                    <Chip
                                      size="small"
                                      label="Admin"
                                      color="error"
                                      icon={<Security />}
                                      sx={{ fontWeight: 600 }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </TabPanel>

          {/* Rejected Peers Tab */}
          <TabPanel value={tabValue} index={2}>
            {rejectedPeers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
                No rejected peers
              </Alert>
            ) : (
              <Stack spacing={2}>
                {rejectedPeers.map((user) => (
                  <Card key={user._id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user),
                              width: 56,
                              height: 56,
                              mr: 2,
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {getUserInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                size="small"
                                label={user.className || 'No Class'}
                                sx={{ 
                                  bgcolor: theme.palette.secondary.main,
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              {renderUserRoleChip(user)}
                              {renderApprovalStatusChip(user)}
                            </Box>
                          </Box>
                        </Box>
                        {canRemovePeer && canManageUser(user) && (
                          <Tooltip title="Remove User">
                            <IconButton
                              color="error"
                              onClick={() => openActionDialog(user, 'remove')}
                              sx={getIconButtonStyle('error')}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </TabPanel>

          {/* Admins Tab */}
          <TabPanel value={tabValue} index={3}>
            {adminPeers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
                No admin users found
              </Alert>
            ) : (
              <Stack spacing={2}>
                {adminPeers.map((user) => (
                  <Card key={user._id} sx={{ 
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                    bgcolor: 'action.hover',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[5],
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user),
                              width: 60,
                              height: 60,
                              mr: 3,
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
                              boxShadow: theme.shadows[3]
                            }}
                          >
                            {getUserInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {user.name}
                              </Typography>
                              <Chip
                                size="small"
                                label="Admin"
                                color="error"
                                icon={<Security />}
                                sx={{ fontWeight: 700, boxShadow: theme.shadows[1] }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                size="small"
                                label={user.className || 'No Class'}
                                sx={{ 
                                  bgcolor: theme.palette.secondary.main,
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              {renderUserRoleChip(user)}
                              {renderApprovalStatusChip(user)}
                            </Box>
                          </Box>
                        </Box>
                        
                        {canMakeAdmin && canManageUser(user) && (
                          <Tooltip title="Remove Admin">
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<KeyOff />}
                              onClick={() => openActionDialog(user, 'remove-admin')}
                              sx={getButtonStyle('error')}
                            >
                              Remove Admin
                            </Button>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </TabPanel>

          {/* All Peers Tab */}
          <TabPanel value={tabValue} index={4}>
            {allPeers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
                No peers found
              </Alert>
            ) : (
              <Stack spacing={2}>
                {allPeers.map((user) => (
                  <Card key={user._id} sx={{ 
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[4],
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user),
                              width: 56,
                              height: 56,
                              mr: 2,
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              boxShadow: theme.shadows[2]
                            }}
                          >
                            {getUserInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                size="small"
                                label={user.className || 'No Class'}
                                sx={{ 
                                  bgcolor: theme.palette.secondary.main,
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              {renderUserRoleChip(user)}
                              {renderApprovalStatusChip(user)}
                              {user.admin && (
                                <Chip
                                  size="small"
                                  label="Admin"
                                  color="error"
                                  icon={<Security />}
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Show approve/reject for pending users */}
                          {user.approvalStatus === 'PENDING' && canApproveReject(user) && canManageUser(user) && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  color="success"
                                  onClick={() => openActionDialog(user, 'approve')}
                                  sx={getIconButtonStyle('success')}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  color="error"
                                  onClick={() => openActionDialog(user, 'reject')}
                                  sx={getIconButtonStyle('error')}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {/* Show make admin for non-admins (if canMakeAdmin) */}
                          {canMakeAdmin && !user.admin && canManageUser(user) && (
                            <Tooltip title="Make Admin">
                              <IconButton
                                color="warning"
                                onClick={() => openActionDialog(user, 'make-admin')}
                                sx={getIconButtonStyle('warning')}
                              >
                                <Star />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {/* Show remove admin for admins (if canMakeAdmin) */}
                          {canMakeAdmin && user.admin && canManageUser(user) && (
                            <Tooltip title="Remove Admin">
                              <IconButton
                                color="error"
                                onClick={() => openActionDialog(user, 'remove-admin')}
                                sx={getIconButtonStyle('error')}
                              >
                                <KeyOff />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {/* Show remove user for admins */}
                          {canRemovePeer && canManageUser(user) && (
                            <Tooltip title="Remove User">
                              <IconButton
                                color="error"
                                onClick={() => openActionDialog(user, 'remove')}
                                sx={getIconButtonStyle('error')}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </TabPanel>
        </>
      )}

      {/* Enhanced Action Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={closeActionDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: actionDialog.action === 'remove' ? 'error.main' : 
                  actionDialog.action.includes('admin') ? 'warning.main' : 'primary.main',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          py: 2
        }}>
          <Typography variant="h6" fontWeight="bold">
            {actionDialog.title}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: getAvatarColor(actionDialog.user),
                width: 50,
                height: 50,
                mr: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: theme.shadows[2]
              }}
            >
              {actionDialog.user && getUserInitials(actionDialog.user.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {actionDialog.user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {actionDialog.user?.email}
              </Typography>
            </Box>
          </Box>
          
          <Typography gutterBottom>
            {actionDialog.message}
          </Typography>
          
          {(actionDialog.action === 'remove' || actionDialog.action === 'remove-admin') && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              This action cannot be undone!
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={closeActionDialog}
            disabled={actionLoading}
            sx={{ 
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            color={
              actionDialog.action === 'remove' || actionDialog.action === 'reject' ? 'error' :
              actionDialog.action === 'make-admin' || actionDialog.action === 'remove-admin' ? 'warning' :
              'success'
            }
            variant="contained"
            disabled={actionLoading}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[5],
              }
            }}
            startIcon={
              actionLoading ? <CircularProgress size={20} color="inherit" /> :
              actionDialog.action === 'approve' ? <CheckCircle /> :
              actionDialog.action === 'reject' ? <Cancel /> :
              actionDialog.action === 'remove' ? <Delete /> :
              actionDialog.action === 'make-admin' ? <Star /> :
              actionDialog.action === 'remove-admin' ? <KeyOff /> :
              null
            }
          >
            {actionLoading ? 'Processing...' : 
             actionDialog.action === 'approve' ? 'Approve' :
             actionDialog.action === 'reject' ? 'Reject' :
             actionDialog.action === 'remove' ? 'Remove User' :
             actionDialog.action === 'make-admin' ? 'Make Admin' :
             actionDialog.action === 'remove-admin' ? 'Remove Admin' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            zIndex: 1000,
            minWidth: 300,
            borderRadius: 2,
            boxShadow: theme.shadows[6],
            animation: 'slideIn 0.3s ease'
          }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
}