import React, { useEffect, useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { 
  Card, 
  Typography, 
  Avatar, 
  Tag, 
  Divider, 
  Space, 
  Row, 
  Col, 
  Button, 
  Progress,
  Modal,
  message,
  Alert,
  Badge,
  Grid,
  Skeleton,
  Spin
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  DeleteOutlined,
  CameraOutlined,
  LoadingOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { COLORS } from '../../utils/colors';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Models array - same as yours
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

// 3D Model Loader Component
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={3} position={[0, 0, 0]} rotation={[0, 0, 0]} />;
}

// Loading fallback for 3D
function ThreeLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      background: COLORS.surface
    }}>
      <Spin size="large" />
    </div>
  );
}

// 3D Model Viewer Component
const ModelViewer = ({ modelUrl, description }) => {
  return (
    <div style={{
      height: '400px',
      borderRadius: '16px',
      overflow: 'hidden',
      background: COLORS.surface,
      position: 'relative'
    }}>
      <Suspense fallback={<ThreeLoader />}>
        <Canvas 
          camera={{ position: [0, 2, 5], fov: 50 }}
          style={{ background: COLORS.background }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <Model url={modelUrl}/>
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
      
      <div style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        background: 'rgba(18, 24, 27, 0.8)',
        backdropFilter: 'blur(4px)',
        borderTop: `1px solid ${COLORS.secondary}30`
      }}>
        <Text style={{ 
          color: COLORS.text, 
          fontSize: '12px',
          display: 'block',
          textAlign: 'center'
        }}>
          Drag to rotate • Scroll to zoom • Model: {description}
        </Text>
      </div>
    </div>
  );
};

const UserHomepage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const fileInputRef = useRef(null);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * models.length);
    setSelectedModel(models[randomIndex]);
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/user/get-user-data", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res?.data?.success) {
        setUser(res.data.user);
      } else {
        message.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      message.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
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
        // Update the user data with the new avatar
        await fetchUser(); // Refresh user data to get updated avatar
        message.success('Avatar updated successfully!');
        setPreviewVisible(false);
        setPreviewImage('');
      } else {
        message.error(response.data.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to upload avatar. Please try again.';
      message.error(errorMsg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      
      // Log to debug
      console.log('Deleting avatar with token:', token ? 'Token present' : 'No token');
      
      const response = await axiosClient.delete('/user/delete-avatar', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response:', response.data);

      if (response.data.success) {
        await fetchUser();
        message.success('Avatar removed successfully!');
        setDeleteModalVisible(false);
      } else {
        message.error(response.data.message || 'Failed to remove avatar');
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Delete error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'No avatar to delete or invalid request');
      } else {
        message.error('Failed to remove avatar. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      message.error('File size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setPreviewVisible(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current.click();
    }
  };

  // Confirm upload
  const confirmUpload = () => {
    if (fileInputRef.current?.files?.[0] && previewImage) {
      handleAvatarUpload(fileInputRef.current.files[0]);
    }
  };

  useEffect(() => { 
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        background: COLORS.background
      }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const isCouncil = user?.role === "STUDENT_COUNCIL";

  return (
    <div style={{ 
      minHeight: '100vh',
      background: COLORS.background,
      padding: isMobile ? '20px 16px' : '40px 30px'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Header */}
        <Card
          style={{
            marginBottom: '30px',
            background: COLORS.surface,
            border: `1px solid ${COLORS.secondary}30`,
            borderRadius: '16px'
          }}
          bodyStyle={{ padding: isMobile ? '20px' : '30px' }}
        >
          <Row gutter={[30, 30]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Badge
                  dot
                  color={user?.onlineStatus === 'active' ? '#52c41a' : '#f5222d'}
                  offset={[-5, 60]}
                >
                  <Avatar
                    size={isMobile ? 80 : 120}
                    src={user?.avatar ? `${user.avatar}?v=${Date.now()}` : null}
                    icon={!user?.avatar && <UserOutlined />}
                    style={{
                      background: COLORS.secondary,
                      border: `4px solid ${COLORS.secondary}40`,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.7 : 1
                    }}
                    onClick={handleAvatarClick}
                  />
                </Badge>
                
                {/* Camera icon overlay */}
                {!uploading && (
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<CameraOutlined />}
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: COLORS.action,
                      border: `2px solid ${COLORS.surface}`,
                      cursor: 'pointer'
                    }}
                    onClick={handleAvatarClick}
                  />
                )}
              </div>
              
              {uploading && (
                <div style={{ marginTop: '16px' }}>
                  <Progress 
                    percent={uploadProgress} 
                    size="small" 
                    strokeColor={COLORS.secondary}
                  />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Uploading...
                  </Text>
                </div>
              )}
            </Col>
            
            <Col xs={24} md={18}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  <Title level={isMobile ? 3 : 2} style={{ 
                    margin: 0, 
                    color: COLORS.text
                  }}>
                    Welcome, {user?.name?.split(' ')[0] || 'User'}
                  </Title>
                  <Space size="small" style={{ marginTop: '8px' }}>
                    <Tag 
                      color={isCouncil ? COLORS.action : COLORS.secondary}
                      icon={isCouncil ? <TeamOutlined /> : <UserOutlined />}
                      style={{ 
                        borderRadius: '20px',
                        padding: '4px 12px'
                      }}
                    >
                      {isCouncil ? 'Council Member' : 'Student'}
                    </Tag>
                    <Tag 
                      color={user?.approvalStatus === 'APPROVED' ? '#52c41a' : '#faad14'}
                      style={{ 
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px'
                      }}
                    >
                      {user?.approvalStatus || 'PENDING'}
                    </Tag>
                  </Space>
                </div>
                
                <Divider style={{ 
                  background: `${COLORS.secondary}20`,
                  margin: '16px 0'
                }} />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: `${COLORS.background}80`,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.secondary}20`
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Email</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <MailOutlined style={{ color: COLORS.secondary }} />
                        <Text style={{ color: COLORS.text, fontSize: '14px' }}>{user?.email}</Text>
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: `${COLORS.background}80`,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.secondary}20`
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Class</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <BookOutlined style={{ color: COLORS.secondary }} />
                        <Text style={{ color: COLORS.text, fontSize: '14px' }}>
                          {user?.className || 'N/A'} {user?.department ? `(${user.department})` : ''}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ 
                      background: `${COLORS.background}80`,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.secondary}20`
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Academic Year</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <CalendarOutlined style={{ color: COLORS.secondary }} />
                        <Text style={{ color: COLORS.text, fontSize: '14px' }}>{user?.academicYear || 'N/A'}</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main Content */}
        <Row gutter={[30, 30]}>
          {/* Left Column - User Details */}
          <Col xs={24} md={12}>
            <Card
              title="Profile Information"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                borderRadius: '16px',
                height: '100%'
              }}
              bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Full Name
                  </Text>
                  <div style={{ 
                    background: `${COLORS.background}80`,
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.secondary}20`
                  }}>
                    <Text style={{ color: COLORS.text, fontSize: '16px' }}>
                      {user?.name || 'Not provided'}
                    </Text>
                  </div>
                </div>
                
                {isCouncil && user?.councilPosition && (
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                      Council Position
                    </Text>
                    <div style={{ 
                      background: `${COLORS.background}80`,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${COLORS.action}30`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <TeamOutlined style={{ color: COLORS.action }} />
                        <Text style={{ color: COLORS.text, fontSize: '16px' }}>
                          {user.councilPosition.replace(/_/g, ' ') || 'Not specified'}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Status
                  </Text>
                  <div style={{ 
                    background: `${COLORS.background}80`,
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.secondary}20`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CalendarOutlined style={{ 
                          color: user?.onlineStatus === 'active' ? COLORS.secondary : '#f5222d'
                        }} />
                        <Text style={{ color: COLORS.text }}>
                          {user?.onlineStatus === 'active' ? 'Online' : 'Offline'}
                        </Text>
                      </div>
                      <Tag color={user?.onlineStatus === 'active' ? '#52c41a' : '#f5222d'} style={{ borderRadius: '20px' }}>
                        {user?.onlineStatus?.toUpperCase() || 'OFFLINE'}
                      </Tag>
                    </div>
                  </div>
                </div>
                
                {user?.avatar && (
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                      Avatar Actions
                    </Text>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        icon={<DeleteOutlined />}
                        danger
                        block
                        size="large"
                        onClick={() => setDeleteModalVisible(true)}
                        loading={uploading}
                        style={{ height: '40px' }}
                      >
                        Remove Avatar
                      </Button>
                    </Space>
                  </div>
                )}
              </Space>
            </Card>
          </Col>

          {/* Right Column - 3D Model */}
          <Col xs={24} md={12}>
            <Card
              title="Daily 3D Model"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                borderRadius: '16px',
                height: '100%'
              }}
              bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
            >
              {selectedModel ? (
                <>
                  <ModelViewer 
                    modelUrl={selectedModel.url}
                    description={selectedModel.description}
                  />
                  
                  <Divider style={{ 
                    background: `${COLORS.secondary}20`,
                    margin: '16px 0'
                  }} />
                  
                  <Text style={{ 
                    color: COLORS.text, 
                    fontSize: '14px',
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}>
                    {selectedModel.description}
                  </Text>
                </>
              ) : (
                <ThreeLoader />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Delete Avatar Modal */}
      <Modal
        title="Remove Avatar"
        open={deleteModalVisible}
        onCancel={() => !uploading && setDeleteModalVisible(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setDeleteModalVisible(false)}
            disabled={uploading}
          >
            Cancel
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            onClick={handleDeleteAvatar}
            loading={uploading}
            icon={uploading ? <LoadingOutlined /> : <DeleteOutlined />}
          >
            {uploading ? 'Removing...' : 'Remove Avatar'}
          </Button>
        ]}
      >
        <Alert
          message="Warning"
          description="Are you sure you want to remove your profile picture? This action cannot be undone."
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      </Modal>

      {/* Avatar Preview Modal */}
      <Modal
        open={previewVisible}
        title="Avatar Preview"
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setPreviewVisible(false)}
            disabled={uploading}
          >
            Cancel
          </Button>,
          <Button 
            key="upload" 
            type="primary"
            onClick={confirmUpload}
            loading={uploading}
            icon={uploading ? <LoadingOutlined /> : <CheckCircleOutlined />}
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </Button>
        ]}
        onCancel={() => !uploading && setPreviewVisible(false)}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Avatar
            size={160}
            src={previewImage}
            style={{ marginBottom: '20px' }}
          />
          <Text type="secondary">
            This will replace your current profile picture
          </Text>
        </div>
      </Modal>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default UserHomepage;