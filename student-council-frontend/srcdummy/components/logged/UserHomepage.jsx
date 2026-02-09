import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { 
  Box, 
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { 
  School, 
  Groups,
  Person,
  Email,
  Class as ClassIcon,
  CalendarToday,
  Star,
  Edit,
  PhotoCamera,
  Delete,
  Check,
  Close
} from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import axiosClient from '../../api/axiosClient';

function ChecklistModel({ url }) {
  // Use the full URL path assuming models are in public/models folder
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={3} position={[0, 0, 0]} rotation={[0, 0, 0]} />;
}

const models = [
  {
    url: "/models/checklist.glb",
    description: "You've unlocked the Checklist! Stay organized and productive!"
  },
  {
    url: "/models/Ginger The Skull.glb",
    description: "Spooky! You've found Ginger the Skull. Perfect for Halloween!"
  },
  {
    url: "/models/hamburger.glb",
    description: "Yum! You've got a delicious hamburger. Time for a snack break!"
  },
  {
    url: "/models/Jack The Red Panda.glb",
    description: "Adorable! You've unlocked Jack the Red Panda. Enjoy your new furry friend!"
  },
  {
    url: "/models/Jaz The Tiger.glb",
    description: "Roar! You've earned Jaz the Tiger. Feel the power of the jungle!"
  },
  {
    url: "/models/Lucky Clover.glb",
    description: "You have gotten the lucky clover. Have a good day!"
  },
  {
    url: "/models/Lucky Mug.glb",
    description: "Cheers! You've found the Lucky Mug. May your coffee always be perfect!"
  },
  {
    url: "/models/mushroom.glb",
    description: "Magical! You've discovered a mysterious mushroom. Is it magical?"
  },
  {
    url: "/models/prettyboy.glb",
    description: "Stylish! You've unlocked Pretty Boy. Looking sharp!"
  },
  {
    url: "/models/Terry The Teddy.glb",
    description: "Cuddly! You've got Terry the Teddy. Your new bedtime companion!"
  },
  {
    url: "/models/Tinkle Panda.glb",
    description: "Cute! You've found Tinkle Panda. The cutest panda around!"
  },
  {
    url: "/models/Tinku The Alien.glb",
    description: "Out of this world! You've encountered Tinku the Alien. Greetings from space!"
  }
];

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
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const fileInputRef = useRef(null);
  const theme = useTheme();

  // Initialize random model on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * models.length);
    setSelectedModel(models[randomIndex]);
  }, []);

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
      showSnackbar('Failed to fetch user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAvatarClick = () => {
    if (!uploading) {
      setIsEditingAvatar(true);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    // Validate file size (max 2MB for Cloudflare R2)
    if (file.size > 2 * 1024 * 1024) {
      showSnackbar('File size should be less than 2MB for Cloudflare R2', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Show preview instead of auto-uploading
    // User will click confirm to upload
  };

  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosClient.post('/user/upload-avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        // Update user with new avatar - add cache buster
        const avatarUrl = response.data.avatarUrl || response.data.avatar;
        const timestamp = Date.now();
        const updatedAvatarUrl = avatarUrl.includes('?') 
          ? `${avatarUrl}&v=${timestamp}`
          : `${avatarUrl}?v=${timestamp}`;
        
        setUser(prev => ({ ...prev, avatar: updatedAvatarUrl }));
        showSnackbar('Avatar updated successfully!', 'success');
        resetAvatarEdit();
      } else {
        showSnackbar(response.data.message || 'Failed to upload avatar', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Failed to upload avatar. Please try again.', 'error');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const confirmUpload = () => {
    if (fileInputRef.current?.files?.[0] && previewUrl) {
      uploadAvatar(fileInputRef.current.files[0]);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      
      const response = await axiosClient.delete('/user/delete-avatar', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(prev => ({ ...prev, avatar: null }));
        showSnackbar('Avatar removed successfully!', 'success');
        setDeleteDialogOpen(false);
        resetAvatarEdit();
      } else {
        showSnackbar(response.data.message || 'Failed to remove avatar', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar('Failed to remove avatar. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetAvatarEdit = () => {
    setIsEditingAvatar(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
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
        {/* Profile Header with Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={previewUrl || (user?.avatar ? `${user.avatar}?v=${Date.now()}` : null)}
              sx={{ 
                width: 120, 
                height: 120, 
                fontSize: '3rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: theme.shadows[4],
                opacity: uploading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: isEditingAvatar 
                    ? theme.palette.warning.main 
                    : theme.palette.primary.main,
                  transform: uploading ? 'none' : 'scale(1.05)'
                }
              }}
              onClick={handleAvatarClick}
            >
              {(!previewUrl && !user?.avatar) && user?.name?.charAt(0)}
            </Avatar>
            
            {isEditingAvatar && !uploading && (
              <Box sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                bgcolor: theme.palette.background.paper,
                borderRadius: '50%',
                p: 0.5,
                boxShadow: theme.shadows[3],
                display: 'flex',
                gap: 0.5,
                zIndex: 2
              }}>
                <IconButton
                  size="small"
                  onClick={handleFileInputClick}
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                  title="Upload new avatar"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
                
                {user?.avatar && (
                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ 
                      bgcolor: theme.palette.error.main,
                      color: 'white',
                      '&:hover': { bgcolor: theme.palette.error.dark }
                    }}
                    title="Remove avatar"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
                
                <IconButton
                  size="small"
                  onClick={resetAvatarEdit}
                  sx={{ 
                    bgcolor: theme.palette.grey[500],
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.grey[700] }
                  }}
                  title="Cancel"
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}

            {!isEditingAvatar && !uploading && (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { 
                    bgcolor: theme.palette.primary.dark,
                    transform: 'scale(1.1)'
                  },
                  width: 36,
                  height: 36,
                  transition: 'all 0.2s ease',
                  boxShadow: theme.shadows[2]
                }}
                onClick={handleAvatarClick}
                title="Edit avatar"
              >
                <Edit fontSize="small" />
              </IconButton>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleFileSelect}
            />

            {/* Upload Progress */}
            {uploading && (
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.7)',
                borderRadius: '50%'
              }}>
                <CircularProgress 
                  variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
                  value={uploadProgress}
                  size={60}
                  sx={{ color: 'white' }}
                />
              </Box>
            )}
          </Box>

          <Box>
            <Typography 
              variant="h2" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 0.5
              }}
            >
              Welcome, {user?.name?.split(' ')[0] || 'User'}
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
          </Box>
        </Box>

        {/* Preview and Confirm Section */}
        {previewUrl && !uploading && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2,
            background: alpha(theme.palette.warning.light, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <Typography variant="subtitle2" fontWeight="bold" color="warning.main" sx={{ mb: 1 }}>
              Preview New Avatar
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={previewUrl} 
                sx={{ width: 60, height: 60 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Click confirm to upload this as your new avatar
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={confirmUpload}
                    startIcon={<Check />}
                  >
                    Confirm Upload
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setPreviewUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    startIcon={<Close />}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

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
                  {user.councilPosition?.replace(/_/g, ' ')}
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
          boxShadow: theme.shadows[3]
        }}>
          {selectedModel ? (
            <>
              <Suspense fallback={<ThreeLoader />}>
                <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <pointLight position={[-5, -5, -5]} intensity={0.5} />
                  
                  <Suspense fallback={null}>
                    <ChecklistModel url={selectedModel.url}/>
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
                p: 2, 
                textAlign: 'center',
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.8)
              }}>
                <Typography variant="caption" color="text.secondary">
                  Drag to rotate • Scroll to zoom
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium', color: theme.palette.primary.main }}>
                  {selectedModel.description}
                </Typography>
              </Box>
            </>
          ) : (
            <ThreeLoader />
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Avatar</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove your profile picture? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAvatar}
            color="error"
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <Delete />}
          >
            {uploading ? 'Removing...' : 'Remove Avatar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}