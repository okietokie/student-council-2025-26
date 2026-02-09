import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Drawer, Menu, Avatar, Tag, Divider } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  NotificationOutlined,
  TeamOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
  CloseOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../utils/colors';

const { Header } = Layout;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState(null); 
  
  const navigate = useNavigate();
  const location = useLocation();

  // Common navigation handlers
  const handleNavigation = (path, scrollToId = null) => {
    if (location.pathname === '/') {
      if (scrollToId) {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      if (scrollToId) {
        setTimeout(() => {
          const element = document.getElementById(scrollToId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setDrawerOpen(false);
  };

  const handleAuth = (type) => {
    navigate(type === 'login' ? '/auth' : '/auth');
    setDrawerOpen(false);
  };

  // Navigation items configuration
  const navItems = [
    {
      key: 'home',
      label: 'Home',
      icon: <HomeOutlined />,
      onClick: () => handleNavigation('/', null)
    },
    {
      key: 'announcements',
      label: 'Announcements',
      icon: <NotificationOutlined />,
      onClick: () => handleNavigation('/', 'announcements-section')
    },
    {
      key: 'council',
      label: 'Council',
      icon: <TeamOutlined />,
      onClick: () => handleNavigation('/', 'council-section')
    }
  ];

  const drawerItems = [
    ...navItems,
    isLoggedIn
      ? {
          key: 'profile',
          label: 'Profile',
          icon: <UserOutlined />,
          onClick: () => navigate('/profile')
        }
      : null,
    isLoggedIn
      ? {
          key: 'logout',
          label: 'Logout',
          icon: <LoginOutlined />,
          onClick: () => {
            setIsLoggedIn(false);
            navigate('/');
            setDrawerOpen(false);
          }
        }
      : null
  ].filter(Boolean);

  // Desktop Navigation
  const DesktopNav = () => (
    <Space size="large">
      {navItems.map((item) => (
        <Button
          key={item.key}
          type="text"
          icon={item.icon}
          onClick={item.onClick}
          style={{
            color: COLORS.text,
            fontWeight: 500,
            padding: '0 8px'
          }}
        >
          {item.label}
        </Button>
      ))}
      
      {isLoggedIn ? (
        <Space size="small">
          <Avatar
            size="small"
            style={{ 
              background: COLORS.secondary,
              color: COLORS.text,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/profile')}
          >
            {user?.name?.[0] || 'U'}
          </Avatar>
          <Tag
            color={COLORS.secondary}
            style={{ 
              border: 'none',
              fontSize: '10px',
              padding: '0 6px',
              height: '18px'
            }}
          >
            {user?.role || 'Student'}
          </Tag>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setIsLoggedIn(false);
              navigate('/');
            }}
            style={{ 
              color: `${COLORS.text}80`,
              fontSize: '12px'
            }}
          >
            Logout
          </Button>
        </Space>
      ) : (
        <Space size="small">
          <Button
            type="text"
            icon={<LoginOutlined />}
            onClick={() => handleAuth('login')}
            style={{ 
              color: COLORS.secondary,
              fontWeight: 500
            }}
          >
            Login / Sign Up
          </Button>
        </Space>
      )}
    </Space>
  );

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      placement="right"
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      width={280}
      closable={false}
      styles={{
        body: {
          padding: 0,
          background: COLORS.surface,
          color: COLORS.text,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <div style={{ 
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${COLORS.secondary}20`
      }}>
        <Typography.Text strong style={{ color: COLORS.text, fontSize: '16px' }}>
          Navigation
        </Typography.Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setDrawerOpen(false)}
          style={{ color: COLORS.text }}
        />
      </div>

      <div style={{ flex: 1, padding: '8px 0' }}>
        <Menu
          mode="vertical"
          items={drawerItems}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
          theme="dark"
        />
      </div>

      {!isLoggedIn && (
        <div style={{ padding: '20px' }}>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => handleAuth('signup')}
            block
            style={{
              background: COLORS.action,
              border: 'none',
              height: '40px',
              fontWeight: 500
            }}
          >
            Create Account
          </Button>
        </div>
      )}
    </Drawer>
  );

  return (
    <>
      <Header style={{
        background: COLORS.background,
        borderBottom: `1px solid ${COLORS.secondary}20`,
        padding: '0 24px',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        backgroundColor: `${COLORS.background}dd`
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Space
            onClick={() => navigate('/')}
            style={{ 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.action})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CrownOutlined style={{ 
                fontSize: '16px',
                color: COLORS.text 
              }} />
            </div>
            <Typography.Title
              level={5}
              style={{
                margin: 0,
                color: COLORS.text,
                fontWeight: 600,
                lineHeight: 1
              }}
            >
              Student Council
            </Typography.Title>
          </Space>

          {/* Desktop Navigation */}
          <div style={{ display: { xs: 'none', lg: 'block' } }}>
            <DesktopNav />
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ 
              color: COLORS.text,
              display: { xs: 'block', lg: 'none' }
            }}
          />
        </div>
      </Header>
      <MobileDrawer />
    </>
  );
};

export default Navbar;