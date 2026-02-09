import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
  CircularProgress,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import {
  HowToVote,
  BarChart,
  People,
  CheckCircle,
  TrendingUp,
  OpenInNew,
  EmojiEvents,
  Equalizer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Announcements = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState({
    active: [],
    completed: []
  });

  const fetchLatestPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/classes/get-polls');
      if (response.data && response.data.success) {
        setPolls({
          active: response.data.latestActivePolls || [],
          completed: response.data.latestCompletedPolls || []
        });
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPolls();
  }, []);

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getWinningOption = (poll) => {
    if (!poll.options || poll.options.length === 0) return null;
    return poll.options.reduce((prev, current) => 
      ((prev.votes || 0) > (current.votes || 0)) ? prev : current
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        py: 4
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3,
          borderRadius: 2
        }}
      >
        {error}
      </Alert>
    );
  }

  const totalPolls = polls.active.length + polls.completed.length;
  if (totalPolls === 0) {
    return (
      <Card sx={{ 
        p: 4,
        bgcolor: 'background.paper',
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 3,
        textAlign: 'center'
      }}>
        <HowToVote sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          No Polls Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Check back later for active polls and announcements.
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/polls')}
        >
          View All Polls
        </Button>
      </Card>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Active Polls Section */}
      {polls.active.length > 0 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 3
          }}>
            <Chip
              label="Active"
              color="success"
              icon={<HowToVote />}
              sx={{ 
                fontWeight: 'bold',
                px: 1,
                fontSize: '0.9rem'
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Active Polls
            </Typography>
          </Box>

          <Stack spacing={2}>
            {polls.active.map((poll) => {
              const totalVotes = poll.totalVotes || 0;
              const winningOption = getWinningOption(poll);
              
              return (
                <Card 
                  key={poll._id} 
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'success.light',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <HowToVote sx={{ color: 'success.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {poll.question}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {poll.options.slice(0, 2).map((option, idx) => {
                        const percentage = calculatePercentage(option.votes, totalVotes);
                        const isWinning = winningOption && option.text === winningOption.text;
                        
                        return (
                          <Box key={idx} sx={{ mb: 1.5 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 0.5
                            }}>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  fontWeight: isWinning ? 700 : 500,
                                  color: isWinning ? 'success.main' : 'text.primary'
                                }}
                              >
                                {option.text}
                                {isWinning && totalVotes > 0 && (
                                  <EmojiEvents sx={{ 
                                    ml: 0.5, 
                                    fontSize: 14,
                                    color: 'success.main',
                                    verticalAlign: 'middle'
                                  }} />
                                )}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: isWinning ? 'success.main' : 'text.secondary'
                                }}
                              >
                                {percentage}% ({option.votes})
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
                                  background: isWinning 
                                    ? 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)'
                                    : 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                                  boxShadow: isWinning ? '0 0 4px #4caf50' : 'none'
                                }
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {poll.votersCount} voter{poll.votersCount !== 1 ? 's' : ''}
                        </Typography>
                        {totalVotes > 0 && (
                          <>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Equalizer sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {totalVotes} total votes
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<OpenInNew />}
                        onClick={() => navigate('/login')}
                        sx={{ 
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: 1.5
                        }}
                      >
                        Vote Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Completed Polls Section */}
      {polls.completed.length > 0 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 3
          }}>
            <Chip
              label="Results"
              color="secondary"
              icon={<BarChart />}
              sx={{ 
                fontWeight: 'bold',
                px: 1,
                fontSize: '0.9rem'
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Recent Results
            </Typography>
          </Box>

          <Stack spacing={2}>
            {polls.completed.map((poll) => {
              const totalVotes = poll.totalVotes || 0;
              const winningOption = getWinningOption(poll);
              
              return (
                <Card 
                  key={poll._id} 
                  sx={{
                    boxShadow: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'secondary.light',
                    bgcolor: alpha(theme.palette.secondary.light, 0.05)
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BarChart sx={{ color: 'secondary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {poll.question}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {poll.options.slice(0, 3).map((option, idx) => {
                        const percentage = calculatePercentage(option.votes, totalVotes);
                        const isWinning = winningOption && option.text === winningOption.text;
                        
                        return (
                          <Box key={idx} sx={{ mb: 1 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 0.5
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {isWinning && totalVotes > 0 && (
                                  <EmojiEvents sx={{ 
                                    fontSize: 14,
                                    color: 'success.main'
                                  }} />
                                )}
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    fontWeight: isWinning ? 700 : 500,
                                    color: isWinning ? 'success.main' : 'text.primary'
                                  }}
                                >
                                  {option.text}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: isWinning ? 'success.main' : 'text.secondary'
                                }}
                              >
                                {percentage}% ({option.votes})
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentage}
                              sx={{ 
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 2,
                                  background: isWinning 
                                    ? 'linear-gradient(90deg, #ed6c02 0%, #ff9800 100%)'
                                    : 'linear-gradient(90deg, #9c27b0 0%, #7b1fa2 100%)',
                                  boxShadow: isWinning ? '0 0 3px #ff9800' : 'none'
                                }
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 1.5,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {poll.votersCount} participant{poll.votersCount !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(poll.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    
                    {winningOption && totalVotes > 0 && (
                      <Alert 
                        severity="success" 
                        icon={<CheckCircle />}
                        sx={{ 
                          mt: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'success.light',
                          color: 'success.dark',
                          '& .MuiAlert-icon': {
                            color: 'success.main'
                          }
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold">
                          Final Verdict: {winningOption.text} ({calculatePercentage(winningOption.votes, totalVotes)}%)
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* View All Button */}
      <Box sx={{ textAlign: 'center', pt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HowToVote />}
          onClick={() => navigate('/login')}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            boxShadow: 3
          }}
        >
          View All Polls & Results
        </Button>
      </Box>
    </Stack>
  );
};

export default Announcements;