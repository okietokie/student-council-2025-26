// ForbiddenPage.jsx
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Block, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            width: '100%',
          }}
        >
          <Block
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 3,
            }}
          />
          
          <Typography variant="h3" gutterBottom fontWeight="bold" color="error">
            403
          </Typography>
          
          <Typography variant="h5" gutterBottom color="text.primary">
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this page. This area is restricted to authorized personnel only.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/logged-in/home')}
              size="large"
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForbiddenPage;