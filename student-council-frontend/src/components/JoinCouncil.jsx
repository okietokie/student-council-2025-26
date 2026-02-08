import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  Paper,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Handshake,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Celebration,
  HourglassEmpty,
  CalendarToday,
  Psychology,
  ErrorOutline,
  Gavel,
  HowToVote,
  TimerOff,
  Loop,
  ArrowBack,
  Close,
  ThumbDown,
  AccessTime,
  EventBusy,
  EventAvailable,
  NotInterested,
  DoNotDisturb,
  Block,
  PriorityHigh,
  QuestionMark,
  EmojiEvents,
  TagFaces,
  SentimentVerySatisfied,
  People,
  School,
  Warning,
  Info,
  CheckCircle,
  RemoveCircle,
  TouchApp,
  FiberManualRecord
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function JoinCouncil() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [mood, setMood] = useState('neutral');
  const [showExitButton, setShowExitButton] = useState(false);

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount > 2) {
      setMood('angry');
      setShowExitButton(true);
    } else if (clickCount > 1) {
      setMood('sad');
    }
  };

  const getSassyMessage = () => {
    if (clickCount === 0) {
      return (
        <>
          Want to know a secret? <PriorityHigh fontSize="small" />
        </>
      );
    } else if (clickCount === 1) {
      return (
        <>
          Still clicking? 
        </>
      );
    } else if (clickCount === 2) {
      return (
        <>
          Okay, you are officially obsessed 
        </>
      );
    } else {
      return (
        <>
          Seriously? How many times? 
        </>
      );
    }
  };

  const getMainMessage = () => {
    return (
      <>
        Elections Are Over! 
      </>
    );
  };

  const getSubMessage = () => {
    const messages = [
      "The council seats are as occupied as a library during finals week.",
      "Our election season ended faster than free pizza at a student event.",
      "The votes have been counted and unfortunately your name was not on the ballot.",
      "Democracy happened while you were sleeping. Better luck next year.",
      "The council throne room is currently throne-ful. No vacancies exist."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getFunnyTip = () => {
    const tips = [
      "Mark your calendar for next year. Set reminders just to be safe.",
      "Elections happen once a year. Unlike your attempts to join.",
      "Being fashionably late does not work for elections either.",
      "Remember: Early bird gets the worm. Late bird gets this message.",
      "Life lesson: Timing is everything. Your timing is questionable."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const MoodIcon = () => {
    switch(mood) {
      case 'angry':
        return (
          <SentimentVeryDissatisfied sx={{ fontSize: 80, color: theme.palette.error.main }} />
        );
      case 'sad':
        return (
          <SentimentDissatisfied sx={{ fontSize: 80, color: theme.palette.warning.main }} />
        );
      default:
        return (
          <SentimentVerySatisfied sx={{ fontSize: 80, color: theme.palette.primary.main }} />
        );
    }
  };

  // Stats data with color values instead of relying on icon props
  const statsData = [
    {
      icon: <CalendarToday />,
      color: theme.palette.error.main,
      label: "Elections Ended",
      value: "Last Month",
      subtext: "You missed it",
      icon2: <ThumbDown fontSize="small" />
    },
    {
      icon: <HourglassEmpty />,
      color: theme.palette.warning.main,
      label: "Next Chance",
      value: "12 Months",
      subtext: "Patience is key",
      icon2: <AccessTime fontSize="small" />
    },
    {
      icon: <Gavel />,
      color: theme.palette.success.main,
      label: "Council Seats",
      value: "All Full",
      subtext: "Zero vacancies",
      icon2: <People fontSize="small" />
    },
    {
      icon: <Warning />,
      color: theme.palette.info.main,
      label: "Your Timing",
      value: "Terrible",
      subtext: "Absolutely awful",
      icon2: <ErrorOutline fontSize="small" />
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.warning.light, 0.1)} 0%, 
        ${alpha(theme.palette.error.light, 0.05)} 100%)`,
      py: 8,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <Box sx={{ 
        position: 'absolute',
        top: 50,
        left: 50,
        color: alpha(theme.palette.error.main, 0.1)
      }}>
        <DoNotDisturb sx={{ fontSize: 100, transform: 'rotate(45deg)' }} />
      </Box>
      
      <Box sx={{ 
        position: 'absolute',
        bottom: 50,
        right: 50,
        color: alpha(theme.palette.warning.main, 0.1)
      }}>
        <TimerOff sx={{ fontSize: 100, transform: 'rotate(-45deg)' }} />
      </Box>

      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          Back to Reality
        </Button>

        <Card sx={{ 
          borderRadius: 3,
          overflow: 'visible',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          border: `2px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
          position: 'relative',
          mt: 2
        }}>
          {/* Warning Banner */}
          <Paper sx={{ 
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 3,
            py: 1,
            bgcolor: theme.palette.error.main,
            color: 'white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 1
          }}>
            <ErrorOutline />
            <Typography variant="subtitle2" fontWeight="bold">
              SASSY MESSAGE INCOMING
            </Typography>
          </Paper>

          <CardContent sx={{ p: 6 }}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              mb: 6
            }}>
              <Box sx={{ 
                position: 'relative',
                mb: 4
              }}>
                <Avatar sx={{ 
                  width: 120,
                  height: 120,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  border: `4px solid ${alpha(theme.palette.warning.main, 0.3)}`
                }}>
                  <MoodIcon />
                </Avatar>
                
                {clickCount > 0 && (
                  <Chip
                    icon={<FiberManualRecord />}
                    label={`Clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}`}
                    color="warning"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Box>
              
              <Typography variant="h1" sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                color: theme.palette.error.dark,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}>
                <Block sx={{ fontSize: 'inherit', mr: 1, verticalAlign: 'middle' }} />
                Elections Are Over!
              </Typography>
              
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                mb: 4,
                maxWidth: 600,
                lineHeight: 1.6,
                fontStyle: 'italic'
              }}>
                {getSubMessage()}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Chip 
                icon={<Psychology />} 
                label="SASS LEVEL: EXPERT" 
                color="warning" 
                variant="outlined"
              />
            </Divider>

            {/* Interactive Section */}
            <Box sx={{ 
              mb: 6,
              p: 4,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.info.light, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: theme.palette.info.dark
              }}>
                {getSassyMessage()}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                This button does absolutely nothing useful <RemoveCircle fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} /> 
                But go ahead, click it anyway <TouchApp fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} />
              </Typography>
              
              <Button
                variant="contained"
                color="warning"
                size="large"
                startIcon={clickCount > 2 ? <NotInterested /> : <HowToVote />}
                endIcon={clickCount > 0 ? <Loop /> : null}
                onClick={handleButtonClick}
                disabled={clickCount > 3}
                sx={{ 
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  transform: clickCount > 0 ? 'scale(0.95)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {clickCount === 0 && "Try to Join Council"}
                {clickCount === 1 && "Try Again"}
                {clickCount === 2 && "Seriously, Stop"}
                {clickCount === 3 && "Okay You Win"}
                {clickCount > 3 && "Done"}
              </Button>
              
              {showExitButton && (
                <Button
                  startIcon={<Close />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    mt: 3,
                    color: 'text.secondary'
                  }}
                >
                  I will leave now
                </Button>
              )}
            </Box>

            {/* Stats Section - FIXED VERSION */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 6
            }}>
              {statsData.map((stat, index) => (
                <Paper
                  key={index}
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                    bgcolor: alpha(stat.color, 0.05),
                    border: `1px solid ${alpha(stat.color, 0.1)}`
                  }}
                >
                  <Box sx={{ mb: 2, color: stat.color }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 40, color: stat.color } })}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mt: 0.5
                  }}>
                    {stat.subtext} {stat.icon2}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Funny Tip */}
            <Paper sx={{ 
              p: 4,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.success.light, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <TagFaces sx={{ 
                  fontSize: 40, 
                  color: theme.palette.success.main,
                  mt: 0.5
                }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {getFunnyTip()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    While you wait, maybe work on your campaign speech 
                    <School fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} /> 
                    Just a thought 
                    <Psychology fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} />
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center', 
              mt: 6,
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EventAvailable />}
                onClick={() => navigate('/')}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Attend Events Instead
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<EmojiEvents />}
                onClick={() => navigate('/council')}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Meet Current Council
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DoNotDisturb />}
                onClick={() => navigate('/')}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Accept Defeat
              </Button>
            </Box>
          </CardContent>

          {/* Footer */}
          <Paper sx={{ 
            py: 3,
            px: 4,
            bgcolor: alpha(theme.palette.grey[900], 0.8),
            color: 'white',
            borderTop: `1px solid ${alpha('#fff', 0.1)}`,
            textAlign: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <PriorityHigh sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                This page contains pure, unadulterated sass
              </Typography>
              <PriorityHigh sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              No council members were harmed 
              <CheckCircle fontSize="small" sx={{ mx: 0.5 }} />
              Except maybe your hopes 
              <SentimentDissatisfied fontSize="small" sx={{ mx: 0.5 }} />
            </Typography>
          </Paper>
        </Card>

        {/* Easter Egg */}
        {clickCount > 5 && (
          <Paper sx={{ 
            mt: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.error.main, 0.1),
            border: `2px solid ${theme.palette.error.main}`,
            textAlign: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Celebration sx={{ color: theme.palette.error.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                CONGRATULATIONS
              </Typography>
              <Celebration sx={{ color: theme.palette.error.main }} />
            </Box>
            <Typography>
              You have unlocked the Persistently Hopeless achievement
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
              That is not a real achievement 
              <QuestionMark fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} />
              Please stop clicking 
              <Close fontSize="small" sx={{ verticalAlign: 'middle', mx: 0.5 }} />
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}