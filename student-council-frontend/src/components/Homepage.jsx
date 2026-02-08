import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Fab,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  LinearProgress,
  ThemeProvider
} from '@mui/material';
import {
  ArrowForward,
  Campaign,
  Event,
  Groups,
  Psychology,
  Diversity3,
  LocalLibrary,
  HealthAndSafety,
  Celebration,
  ChatBubble,
  School,
  Person,
  CalendarToday,
  TrendingUp,
  Group,
  EmojiPeople,
  Forum,
  Computer,
  HistoryEdu,
  Calculate,
  Translate,
  Restaurant as RestaurantIcon,
  Quiz,
  ConnectWithoutContact,
  Lightbulb,
  GroupWork,
  WorkspacePremium,
  Accessible,
  Update,
  Handshake,
  Nature,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import CouncilCarousel from './helpers/Carousal';
import axiosClient from '../api/axiosClient';
import Announcements from './Announcements';

// Main App Component
const Homepage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/council/fetch-council-members");
        
        if (response.data && response.data.success) {
          const members = response.data.members || [];
          
          // Transform data to match CouncilCarousel structure
          const transformedMembers = members.map(member => ({
            name: member.name,
            email: member.email,
            avatar: member.avatar || null,
            councilPosition: member.councilPosition,
            onlineStatus: member.onlineStatus,
            className: member.className || 'Class not assigned'
          }));
          
          setCouncilMembers(transformedMembers);
          setError(null);
        } else {
          setError('Failed to fetch council members data');
        }
      } catch (err) {
        console.error('Error fetching council members:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const HeroSection = () => (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
      py: { xs: 6, md: 10 },
      position: 'relative',
      overflow: 'hidden',
      color: 'white'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: 4
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'white',
            color: 'primary.main',
            mb: 2
          }}>
            <School sx={{ fontSize: 40 }} />
          </Box>
          
          <Typography variant="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 3, 
            color: 'white',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            Your Voice in Campus Life
          </Typography>
          
          <Typography variant="h5" sx={{ 
            mb: 4, 
            opacity: 0.9,
            maxWidth: 800,
            fontSize: { xs: '1.1rem', md: '1.5rem' }
          }}>
            Engage, Participate, and Shape Your University Experience
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              endIcon={<ArrowForward />}
              sx={{ 
                bgcolor: 'secondary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
              onClick={() => {
                const section = document.getElementById('announcements-section');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Announcements
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={() => navigate('/signup')}
            >
              Participate in Polls
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );

const OfficialAnnouncementsSection = () => (
  <Box id="announcements-section" sx={{ py: 8, bgcolor: 'background.default' }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3
        }}>
          <Box sx={{ 
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            color: 'white'
          }}>
            <Campaign sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            color: 'text.primary'
          }}>
            Campus Polls & Announcements
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ 
          textAlign: 'center', 
          maxWidth: 600,
          mb: 4
        }}>
          Latest polls and voting results from the Student Council
        </Typography>
      </Box>
      
      <Announcements />
    </Container>
  </Box>
);
  const StudentCouncilSection = () => (
    <Box id="council-section" sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ 
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              color: 'white'
            }}>
              <Groups sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              color: 'text.primary'
            }}>
              Meet the Student Council
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ 
            textAlign: 'center', 
            maxWidth: 600,
            mb: 4
          }}>
            Your elected representatives working to improve campus life
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : councilMembers.length === 0 ? (
          <Card sx={{ 
            p: 4,
            bgcolor: 'background.paper',
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No Council Members Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Council member information will be displayed here once available.
            </Typography>
          </Card>
        ) : (
          <CouncilCarousel members={councilMembers} />
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 6,
          gap: 3,
          flexWrap: 'wrap'
        }}>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<Handshake />}
            onClick={() => navigate('/join-council')}
            sx={{ 
              px: 4,
              py: 1.5
            }}
          >
            Join the Council
          </Button>
        </Box>
      </Container>
    </Box>
  );

  const Footer = () => (
    <Box sx={{ 
      bgcolor: 'secondary.main', 
      color: 'white', 
      py: 6,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              Student Council Portal
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
            © {new Date().getFullYear()} Student Council Portal. All rights reserved.
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'right' }}>
            Your Voice Matters
          </Typography>
        </Box>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%'
    }}>
      <Navbar />
      
      <Box sx={{ flexGrow: 1 }}>
        <HeroSection />
        <OfficialAnnouncementsSection />
        <StudentCouncilSection />
      </Box>
      
      <Footer />
      
      
      {successMsg && (
        <Alert 
          severity="success" 
          onClose={() => setSuccessMsg('')}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            minWidth: 300,
            boxShadow: 3,
            zIndex: 9999
          }}
        >
          {successMsg}
        </Alert>
      )}
    </Box>
  );
};

export default Homepage;