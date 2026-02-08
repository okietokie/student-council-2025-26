import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Campaign,
  ArrowForward,
  Schedule,
  NotificationsActive,
  TrendingUp,
  Forum,
  Announcement
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Posts() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.light, 0.05)} 0%, 
        ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
      py: 8
    }}>
      <Container maxWidth="md">
        <Card sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.shadows[8],
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          {/* Header Section */}
          <Box sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            py: 6,
            px: 4,
            textAlign: 'center'
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'white',
              color: theme.palette.primary.main,
              mb: 3
            }}>
              <Campaign sx={{ fontSize: 48 }} />
            </Box>
            
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}>
              Posts & Announcements
            </Typography>
            
            <Typography variant="h5" sx={{ 
              color: alpha('#FFFFFF', 0.9),
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}>
              Stay tuned for the latest campus updates and important communications
            </Typography>
          </Box>

          {/* Content Section */}
          <CardContent sx={{ p: 6 }}>
            {/* Coming Soon Message */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              mb: 6
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.warning.light, 0.1),
                color: theme.palette.warning.main,
                mb: 4
              }}>
                <Schedule sx={{ fontSize: 60 }} />
              </Box>
              
              <Typography variant="h3" sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                color: theme.palette.text.primary
              }}>
                Feature Coming Soon!
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: 'text.secondary', 
                mb: 4,
                maxWidth: 600,
                lineHeight: 1.6
              }}>
                We're working hard to bring you an amazing experience for campus announcements, 
                discussions, and important updates. This feature will be available in the next update.
              </Typography>
              
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 4
                }} 
              />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Feature Preview */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 4,
                textAlign: 'center',
                color: theme.palette.text.primary
              }}>
                What to Expect
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                {[
                  {
                    icon: <Announcement sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                    title: 'Official Announcements',
                    description: 'Important updates from the Student Council and administration'
                  },
                  {
                    icon: <Forum sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
                    title: 'Discussion Posts',
                    description: 'Engage in campus discussions and share your thoughts'
                  },
                  {
                    icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main }} />,
                    title: 'Trending Topics',
                    description: 'See what topics are currently trending on campus'
                  },
                  {
                    icon: <NotificationsActive sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
                    title: 'Real-time Notifications',
                    description: 'Get instant notifications for new posts and updates'
                  }
                ].map((feature, index) => (
                  <Card 
                    key={index}
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                        borderColor: alpha(feature.icon.props.color || theme.palette.primary.main, 0.3)
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      mb: 2
                    }}>
                      <Box sx={{ 
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(feature.icon.props.color || theme.palette.primary.main, 0.1)
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Call to Action */}
            <Box sx={{ 
              textAlign: 'center',
              p: 4,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: theme.palette.primary.main
              }}>
                Stay Updated
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                We'll notify you as soon as the Posts feature is available. In the meantime, 
                you can explore other campus features.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/logged-in/home')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  Back to Home
                </Button>
                
                {/* <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/announcements')}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  View Official Announcements
                </Button> */}
              </Box>
            </Box>
          </CardContent>

          {/* Footer */}
          <Box sx={{ 
            py: 3,
            px: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Estimated Launch: Next Month • Follow us for updates
            </Typography>
          </Box>
        </Card>

        {/* Additional Info Card */}
        <Card sx={{ 
          mt: 4,
          p: 4,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.secondary.main, 0.03),
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
        }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <NotificationsActive sx={{ 
              fontSize: 40, 
              color: theme.palette.secondary.main 
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Want to be notified?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We'll send you an email when the Posts feature launches. 
                Make sure your notification settings are enabled.
              </Typography>
            </Box>
          </Box> */}
        </Card>
      </Container>
    </Box>
  );
}