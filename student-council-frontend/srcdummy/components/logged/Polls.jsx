import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent,
  IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Snackbar,
  useTheme, useMediaQuery, Stack, Avatar, LinearProgress,
  Radio, RadioGroup, FormControlLabel, FormControl
} from '@mui/material';
import {
  Add, Edit, Delete, CheckCircle, BarChart,
  HowToVote, Close, Schedule, People, AddCircleOutline,
  Autorenew, DoneAll, Refresh,
  Replay
} from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

export default function Polls() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [polls, setPolls] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [editingPoll, setEditingPoll] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    endDate: ''
  });

  // Fetch polls and user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchPolls();
  }, []);

  const fetchUserData = async () => {
    try {
        const token = localStorage.getItem("token");
      const response = await axiosClient.get('/user/get-user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("user_id: ", response?.data?.user?._id);
      setUserData(response?.data?.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchPolls = async () => {
    setLoading(true);
    try {
                const token = localStorage.getItem("token");
      const response = await axiosClient.get('/admin/fetch-polls', {
        headers: { Authorization: `Bearer ${token}`}
      });
      setPolls(response.data.polls || []);
    } catch (error) {
      showSnackbar('Failed to fetch polls', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Check if user has voted in a specific poll
  const hasUserVoted = (poll) => {
    if (!userData || !poll || !poll.voters) return false;
    console.log("has voted: ", poll.voters.some(voter => voter === userData._id))
    return poll.voters.some(voter => voter.toString() === userData._id);
  };

  // Get user's previous vote index from userVotes array
  const getUserVoteIndex = (poll) => {
    if (!userData || !poll || !poll.userVotes) return null;
    const userVote = poll.userVotes.find(v => v.user.toString() === userData._id);
    return userVote ? userVote.option : null;
  };

  // Get user's vote change count
  const getUserVoteChanges = (poll) => {
    if (!userData || !poll || !poll.userVotes) return 0;
    const userVote = poll.userVotes.find(v => v.user.toString() === userData._id);
    return userVote ? (userVote.changes+1 || 0) : 0;
  };

  // Get total votes from poll options
  const getTotalVotes = (poll) => {
    if (!poll || !poll.options) return 0;
    return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
  };

  const handleOpenVoteDialog = (poll) => {
    setSelectedPoll(poll);
    
    // Check if user already voted, pre-select their current vote
    const userVoteIndex = getUserVoteIndex(poll);
    setSelectedOption(userVoteIndex !== null ? userVoteIndex : null);
    
    setVoteDialogOpen(true);
  };

  const handleCloseVoteDialog = () => {
    setVoteDialogOpen(false);
    setSelectedPoll(null);
    setSelectedOption(null);
  };

  const handleSubmitVote = async () => {
    if (!selectedPoll || selectedOption === null) {
      showSnackbar('Please select an option to vote', 'warning');
      return;
    }

    if (!userData) {
      showSnackbar('Please login to vote', 'error');
      return;
    }

    setLoadingVote(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post('/user/submit-vote', {
        pollId: selectedPoll._id,
        optionIndex: selectedOption
      }, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (response.data.success) {
        showSnackbar('Vote submitted successfully!');
        fetchPolls(); // Refresh polls to show updated votes
        handleCloseVoteDialog();
      } else {
        showSnackbar(response.data.message || 'Failed to submit vote', 'error');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to submit vote', 'error');
    } finally {
      setLoadingVote(false);
    }
  };

  const handleResubmitVote = async () => {
    if (!selectedPoll || selectedOption === null) {
      showSnackbar('Please select a new option', 'warning');
      return;
    }

    const userVoteIndex = getUserVoteIndex(selectedPoll);
    if (userVoteIndex === null) {
      showSnackbar('You need to vote first before changing your vote', 'error');
      return;
    }

    if (userVoteIndex === selectedOption) {
      showSnackbar('Please select a different option to change your vote', 'warning');
      return;
    }

    const changes = getUserVoteChanges(selectedPoll);
    if (changes >= 3) {
      showSnackbar('You have reached the maximum vote change limit (3 times)', 'error');
      return;
    }

    setLoadingVote(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axiosClient.post('/user/submit-vote', {
        pollId: selectedPoll._id,
        newOptionIndex: selectedOption
      }, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (response.data.success) {
        showSnackbar(`Vote updated successfully! (${changes + 1}/3 changes used)`);
        fetchPolls();
        handleCloseVoteDialog();
      } else {
        showSnackbar(response.data.message || 'Failed to update vote', 'error');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to update vote', 'error');
    } finally {
      setLoadingVote(false);
    }
  };

  const handleOpenDialog = (poll = null) => {
    if (poll) {
      setEditingPoll(poll);
      setFormData({
        question: poll.question,
        options: poll.options.map(opt => opt.text),
        endDate: poll.endDate ? new Date(poll.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingPoll(null);
      setFormData({
        question: '',
        options: ['', ''],
        endDate: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPoll(null);
  };

  const handleFormChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'options' && index !== null) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      showSnackbar('Poll question is required', 'error');
      return;
    }
    if (formData.options.some(opt => !opt.trim())) {
      showSnackbar('All options must be filled', 'error');
      return;
    }

    try {
      if (editingPoll) {
                const token = localStorage.getItem("token");
        await axiosClient.put(`/admin/edit-poll/${editingPoll._id}`, formData, {
            headers: {Authorization: `Bearer ${token}`}
        });
        showSnackbar('Poll updated successfully');
      } else {
        await axiosClient.post('/admin/create-poll', formData);
        showSnackbar('Poll created successfully');
      }
      fetchPolls();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    
    try {
      await axiosClient.delete(`/admin/delete-poll/${pollId}`);
      showSnackbar('Poll deleted successfully');
      fetchPolls();
    } catch (error) {
      showSnackbar('Failed to delete poll', 'error');
    }
  };
  const handleReopenPoll = async (pollId) => {
    try {
        await axiosClient.put(`/admin/reopen-poll/${pollId}`);
        showSnackbar('Poll reopened successfully');
        fetchPolls(); // refresh list
    } catch (error) {
        showSnackbar('Failed to reopen poll', 'error');
    }
    };

  const handleFinishPoll = async (pollId) => {
    try {
      await axiosClient.post(`/admin/finish-poll/${pollId}`);
      showSnackbar('Poll finished successfully');
      fetchPolls();
    } catch (error) {
      showSnackbar('Failed to finish poll', 'error');
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };
  console.log("user: ", userData);
  console.log("polls: ", polls);
  const activePolls = polls.filter(poll => poll.isActive);
  const finishedPolls = polls.filter(poll => !poll.isActive);
  const isCouncil = userData?.role === "STUDENT_COUNCIL";
  const isAdmin = userData?.admin === true;
  
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <HowToVote sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Student Council Polls
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData ? `Welcome, ${userData.name}` : 'Please login to vote'}
            </Typography>
          </Box>
        </Box>
        {isCouncil && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          disabled={!isAdmin}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { 
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: 4
            },
            boxShadow: 3,
            transition: 'all 0.2s',
            px: 3,
            py: 1
          }}
        >
          Create New Poll
        </Button>)}
      </Box>

      {/* Main Content - Two Sections */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        minHeight: '70vh'
      }}>
        {/* Ongoing Polls - Right/Top Section */}
        <Box sx={{
          flex: { xs: 1, md: 2 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          order: { xs: 1, md: 2 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2 
          }}>
            <Box sx={{
              p: 1,
              bgcolor: 'primary.light',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <HowToVote sx={{ 
                fontSize: 28,
                color: 'primary.main',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Ongoing Polls
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activePolls.length} active poll{activePolls.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 300 
            }}>
              <CircularProgress />
            </Box>
          ) : activePolls.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              p: 6, 
              bgcolor: 'background.default',
              boxShadow: 2,
              borderRadius: 3
            }}>
              <HowToVote sx={{ 
                fontSize: 80, 
                color: 'text.secondary',
                mb: 2,
                opacity: 0.5
              }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Active Polls
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create a new poll to get started
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {activePolls.map((poll) => {
                const userVoted = hasUserVoted(poll);
                const userVoteIndex = getUserVoteIndex(poll);
                const userVoteChanges = getUserVoteChanges(poll);
                const totalVotes = getTotalVotes(poll);
                const votersCount = poll.voters ? poll.voters.length : 0;
                
                return (
                  <Card 
                    key={poll._id} 
                    sx={{
                      boxShadow: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      },
                      border: '1px solid',
                      borderColor: userVoted ? 'success.main' : 'divider',
                      overflow: 'visible',
                      position: 'relative'
                    }}
                  >
                    {userVoted && (
                      <Chip
                        label="Voted"
                        color="success"
                        size="small"
                        icon={<DoneAll />}
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 12,
                          zIndex: 10,
                          fontWeight: 'bold',
                          boxShadow: 3,
                          borderRadius: 2
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ p: 3, pt: userVoted ? 5 : 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        mb: 3
                      }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          sx={{ 
                            lineHeight: 1.3,
                            flex: 1,
                            mr: 2
                          }}
                        >
                          {poll.question}
                        </Typography>
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small"
                          icon={<Schedule sx={{ fontSize: 16 }} />}
                          sx={{ 
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                      
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {poll.options.map((option, idx) => {
                          const optionVotes = option.votes || 0;
                          const percentage = calculatePercentage(optionVotes, totalVotes);
                          const isUserVote = userVoted && userVoteIndex === idx;
                          
                          return (
                            <Box key={idx}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 0.5
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      fontWeight: 500,
                                      color: isUserVote ? 'success.main' : 'text.primary'
                                    }}
                                  >
                                    {option.text}
                                    {isUserVote && (
                                      <CheckCircle sx={{ 
                                        ml: 0.5, 
                                        fontSize: 16, 
                                        verticalAlign: 'middle',
                                        color: 'success.main'
                                      }} />
                                    )}
                                  </Typography>
                                </Box>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  minWidth: 120
                                }}>
                                  <BarChart sx={{ 
                                    fontSize: 18,
                                    color: isUserVote ? 'success.main' : 'primary.main'
                                  }} />
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: isUserVote ? 'success.main' : 'text.primary'
                                    }}
                                  >
                                    {percentage}% ({optionVotes})
                                  </Typography>
                                </Box>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={percentage}
                                sx={{ 
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: 'action.hover',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: isUserVote 
                                      ? 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)'
                                      : 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
                                  }
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 2,
                        borderTop: 1,
                        borderColor: 'divider'
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ 
                            fontSize: 18,
                            color: 'text.secondary'
                          }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {votersCount} voter{votersCount !== 1 ? 's' : ''} • {totalVotes} total votes
                          </Typography>
                          {userVoted && userVoteChanges > 0 && (
                            <Chip
                              label={`${userVoteChanges}/3 changes`}
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{ ml: 1 }}
                              icon={<Refresh sx={{ fontSize: 14 }} />}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {userData && (
                            <Button
                              variant={userVoted ? "outlined" : "contained"}
                              size="small"
                              startIcon={userVoted ? <Autorenew /> : <HowToVote />}
                              onClick={() => handleOpenVoteDialog(poll)}
                              sx={{ mr: 1 }}
                              color={userVoted ? "warning" : "primary"}
                            >
                              {userVoted ? `Change Vote` : 'Vote Now'}
                            </Button>
                          )}
                          {isAdmin && (
                            <>
                                                      <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(poll)}
                            sx={{ 
                              bgcolor: 'primary.light',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleFinishPoll(poll._id)}
                            sx={{ 
                              bgcolor: 'success.light',
                              '&:hover': { bgcolor: 'success.main', color: 'white' }
                            }}
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            
                            onClick={() => handleDelete(poll._id)}
                            sx={{ 
                              bgcolor: 'error.light',
                              '&:hover': { bgcolor: 'error.main', color: 'white' }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>

        {/* Existing/Finished Polls - Left/Bottom Section */}
        <Box sx={{
          flex: { xs: 1, md: 1 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          order: { xs: 2, md: 1 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2 
          }}>
            <Box sx={{
              p: 1,
              bgcolor: 'secondary.light',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <BarChart sx={{ 
                fontSize: 28,
                color: 'secondary.main',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold" color={theme.palette.text.primary}>
                Previous Polls
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {finishedPolls.length} completed poll{finishedPolls.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          {finishedPolls.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              p: 4, 
              bgcolor: 'background.default',
              boxShadow: 2,
              borderRadius: 3
            }}>
              <BarChart sx={{ 
                fontSize: 60, 
                color: 'text.secondary',
                mb: 2,
                opacity: 0.5
              }} />
              <Typography color="text.secondary">
                No completed polls yet
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {finishedPolls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                const votersCount = poll.voters ? poll.voters.length : 0;
                const winningOption = poll.options.reduce((prev, current) => 
                  ((prev.votes || 0) > (current.votes || 0)) ? prev : current
                );
                
                return (
                  <Card 
                    key={poll._id} 
                    sx={{ 
                      boxShadow: 2, 
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                        <Stack 
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            paddingBottom={1.9}
                            >
                        <Typography 
                            variant="subtitle1" 
                            fontWeight="bold" 
                            gutterBottom
                            sx={{ lineHeight: 1.3 }}
                        >
                            {poll.question}
                        </Typography>
                            {isAdmin && (
                              <IconButton 
                                size="small" 
                                onClick={() => handleReopenPoll(poll._id)}
                                sx={{ 
                                    bgcolor: 'success.light',
                                    '&:hover': { bgcolor: 'success.main', color: 'white' }
                                }}
                                >
                                <Replay fontSize="small" />
                            </IconButton>
                            )}
                        </Stack>
                      
                      <Stack spacing={1.5} sx={{ mb: 2 }}>
                        {poll.options.map((option, idx) => {
                          const optionVotes = option.votes || 0;
                          const percentage = calculatePercentage(optionVotes, totalVotes);
                          const isWinner = option.text === winningOption.text;
                          
                          return (
                            <Box key={idx}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 0.5
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography 
                                    variant="body2"
                                    sx={{ 
                                      fontWeight: isWinner ? 600 : 400,
                                      color: isWinner ? 'success.main' : 'text.primary'
                                    }}
                                  >
                                    {option.text}
                                    {isWinner && (
                                      <CheckCircle sx={{ 
                                        ml: 0.5, 
                                        fontSize: 16, 
                                        color: 'success.main',
                                        verticalAlign: 'middle'
                                      }} />
                                    )}
                                  </Typography>
                                </Box>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {percentage}% ({optionVotes})
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={percentage}
                                sx={{ 
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: 'action.hover',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    bgcolor: isWinner ? 'success.main' : 'secondary.main'
                                  }
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            fontStyle: 'italic'
                          }}
                        >
                          Ended on: {new Date(poll.updatedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {votersCount} participants
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Voting Dialog */}
      <Dialog 
        open={voteDialogOpen} 
        onClose={handleCloseVoteDialog}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h5" fontWeight="bold">
            {selectedPoll && hasUserVoted(selectedPoll) ? 'Change Your Vote' : 'Cast Your Vote'}
          </Typography>
          <IconButton onClick={handleCloseVoteDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {selectedPoll && (
            <>
              <Typography variant="h6" gutterBottom color="primary">
                {selectedPoll.question}
              </Typography>
              
              {hasUserVoted(selectedPoll) && (
                <Alert 
                  severity="warning" 
                  sx={{ mb: 2 }}
                  icon={<Refresh />}
                >
                  <Typography variant="body2">
                    You have already voted in this poll. You can change your vote up to 3 times.
                    <br />
                    <strong>Changes used: {getUserVoteChanges(selectedPoll)}/3</strong>
                  </Typography>
                </Alert>
              )}
              
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedOption !== null ? selectedOption.toString() : ''}
                  onChange={(e) => setSelectedOption(parseInt(e.target.value))}
                >
                  {selectedPoll.options.map((option, index) => {
                    const optionVotes = option.votes || 0;
                    const isCurrentVote = hasUserVoted(selectedPoll) && getUserVoteIndex(selectedPoll) === index;
                    const totalVotes = getTotalVotes(selectedPoll);
                    const percentage = calculatePercentage(optionVotes, totalVotes);
                    
                    return (
                      <Card
                        key={index}
                        sx={{
                          mb: 1,
                          border: selectedOption === index ? '2px solid' : '1px solid',
                          borderColor: selectedOption === index 
                            ? 'primary.main' 
                            : isCurrentVote 
                              ? 'success.main' 
                              : 'divider',
                          bgcolor: selectedOption === index 
                            ? 'primary.light' 
                            : isCurrentVote
                              ? 'success.light'
                              : 'background.paper',
                          transition: 'all 0.2s'
                        }}
                      >
                        <FormControlLabel
                          value={index.toString()}
                          control={<Radio />}
                          label={
                            <Box sx={{ ml: 1, width: '100%' }}>
                              <Typography variant="body1" fontWeight={500}>
                                {option.text}
                                {isCurrentVote && (
                                  <CheckCircle sx={{ 
                                    ml: 0.5, 
                                    fontSize: 16, 
                                    color: 'success.main',
                                    verticalAlign: 'middle'
                                  }} />
                                )}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <BarChart sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {optionVotes} vote{optionVotes !== 1 ? 's' : ''} ({percentage}%)
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ 
                            width: '100%',
                            m: 0,
                            p: 1.5
                          }}
                        />
                      </Card>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Your vote is anonymous. 
                  {hasUserVoted(selectedPoll) 
                    ? ` You can change your vote ${3 - getUserVoteChanges(selectedPoll)} more time(s).` 
                    : ' Once submitted, you can change it up to 3 times.'
                  }
                </Typography>
              </Alert>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseVoteDialog}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmitVote()}
            variant="contained" 
            color={hasUserVoted(selectedPoll) ? "warning" : "primary"}
            disabled={selectedOption === null || loadingVote}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            {loadingVote ? (
              <CircularProgress size={24} color="inherit" />
            ) : hasUserVoted(selectedPoll) ? (
              `Change Vote (${getUserVoteChanges(selectedPoll)}/3)`
            ) : (
              'Submit Vote'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Poll Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h5" fontWeight="bold">
            {editingPoll ? 'Edit Poll' : 'Create New Poll'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Poll Question"
            name="question"
            value={formData.question}
            onChange={handleFormChange}
            margin="normal"
            required
            multiline
            rows={2}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
            Poll Options *
          </Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {formData.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  name='options'
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleFormChange(e, index)}
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
                {formData.options.length > 2 && (
                  <IconButton 
                    onClick={() => removeOption(index)} 
                    color="error"
                    size="small"
                    sx={{ 
                      bgcolor: 'error.light',
                      '&:hover': { bgcolor: 'error.main', color: 'white' }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
          
          <Button 
            startIcon={<AddCircleOutline />} 
            onClick={addOption}
            variant="outlined"
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
          >
            Add Another Option
          </Button>
          
          <TextField
            fullWidth
            label="End Date (Optional)"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleFormChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            {editingPoll ? 'Update Poll' : 'Create Poll'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}