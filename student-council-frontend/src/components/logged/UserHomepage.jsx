import React, { useEffect, useState, Suspense } from 'react';
import { 
  Box, 
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { 
  School, 
  Groups,
  Person,
  Email,
  Class as ClassIcon,
  CalendarToday,
  Star
} from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import axiosClient from '../../api/axiosClient';

function ChecklistModel() {
  const { scene } = useGLTF('/checklist.glb');
  return <primitive object={scene} scale={3} position={[0, 0, 0]} rotation={[0, 0, 0]} />;
}

// Loading fallback for 3D
function ThreeLoader() {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: 400 
    }}>
      <CircularProgress size={30} />
    </Box>
  );
}

export default function UserHomepage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/user/get-user-data", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res?.data?.success) {
        setUser(res?.data?.user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      gap: { xs: 3, md: 6 },
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.03)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
    }}>
      {/* Left side - User Info */}
      <Box sx={{ 
        flex: 1,
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography 
          variant="h2" 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 1
          }}
        >
          Welcome, {user?.name.split(' ')[0]}
        </Typography>
        
        {/* Role Badge */}
        <Chip
          icon={user?.role === 'STUDENT_COUNCIL' ? <Groups /> : <School />}
          label={user?.role === 'STUDENT_COUNCIL' ? 'Council Member' : 'Student'}
          color={user?.role === 'STUDENT_COUNCIL' ? 'secondary' : 'primary'}
          sx={{ 
            width: 'fit-content',
            fontSize: '0.9rem',
            py: 0.5
          }}
        />

        <Divider sx={{ my: 1 }} />

        {/* User Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user?.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Email sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ClassIcon sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user?.className} ({user?.department})
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarToday sx={{ color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Academic Year
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user?.academicYear}
              </Typography>
            </Box>
          </Box>

          {user?.role === 'STUDENT_COUNCIL' && user?.councilPosition && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Star sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.primary">
                  Council Position
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="text.secondary">
                  {user.councilPosition.replace(/_/g, ' ')}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Status Info */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: 2,
          background: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Typography variant="body2" color="text.secondary">
            Status: <span style={{ 
              color: user?.approvalStatus === 'APPROVED' ? theme.palette.success.main : theme.palette.warning.main,
              fontWeight: 'bold'
            }}>
              {user?.approvalStatus}
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Online: <span style={{ 
              color: user?.onlineStatus === 'active' ? theme.palette.success.main : theme.palette.text.secondary,
              fontWeight: 'bold'
            }}>
              {user?.onlineStatus?.toUpperCase()}
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Right side - 3D Checklist Model */}
      <Box sx={{ 
        flex: 1,
        maxWidth: 500,
        height: 400
      }}>
        <Box sx={{ 
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',

        }}>

          <Suspense fallback={<ThreeLoader />}>
            <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              
              <Suspense fallback={null}>
                <ChecklistModel />
              </Suspense>
              
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                maxPolarAngle={Math.PI}
                minPolarAngle={0}
                autoRotate
                autoRotateSpeed={0.5}
                enableDamping
                dampingFactor={0.05}
              />
              
              <Environment preset="city" />
            </Canvas>
          </Suspense>

          <Box sx={{ 
            p: 1, 
            textAlign: 'center',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8)
          }}>
            <Typography variant="caption" color="text.secondary">
              Drag to rotate • Scroll to zoom
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}