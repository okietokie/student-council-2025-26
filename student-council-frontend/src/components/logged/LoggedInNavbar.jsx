import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Space, Drawer, Menu, Avatar, Tag, Divider, Grid } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  NotificationOutlined,
  TeamOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
  CloseOutlined,
  CrownOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { COLORS } from '../../utils/colors';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    const token = localStorage.getItem("token");
    await axiosClient.patch("/auth/logout", {
      headers: { Authorization: `Bearer ${token}`}
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getUser = async () => {
    const userString = localStorage.getItem("user");
    const userData = userString ? JSON.parse(userString) : null;
    setUser(userData);
    setIsLoggedIn(!!userData);
  };

  useEffect(() => {
    getUser();
  }, []);

  const isCouncil = user?.role === "STUDENT_COUNCIL";

  const navigationItems = [
    { 
      key: 'home', 
      label: 'Home', 
      icon: <HomeOutlined />, 
      link: "/logged-in/home" 
    },
    { 
      key: 'posts', 
      label: 'Posts/Announcements', 
      icon: <NotificationOutlined />, 
      link: "/logged-in/posts" 
    },
    { 
      key: 'polls', 
      label: 'Polls', 
      icon: <PieChartOutlined />, 
      link: "/logged-in/polls" 
    },
    { 
      key: 'requests', 
      label: 'Requests', 
      icon: <UserSwitchOutlined />, 
      link: "/logged-in/peers", 
      councilOnly: true 
    }
  ];

  const handleNavigation = (link) => {
    navigate(link);
    setDrawerOpen(false);
  };

  // Desktop Navigation
  const DesktopNav = () => (
    <Space size="middle" style={{ marginRight: '30px' }}>
      {navigationItems.map((item) => {
        if (item.councilOnly && !isCouncil) return null;
        
        return (
          <Button
            key={item.key}
            type="text"
            icon={item.icon}
            onClick={() => handleNavigation(item.link)}
            style={{
              color: COLORS.text,
              fontWeight: 500,
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${COLORS.secondary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {item.label}
          </Button>
        );
      })}
      
      {isLoggedIn && user ? (
        <Space size="small" style={{ 
          padding: '8px 12px', 
          borderRadius: '8px',
          backgroundColor: `${COLORS.surface}`,
          marginLeft: '16px'
        }}>
          <Avatar
            size="small"
            style={{ 
              background: COLORS.secondary,
              color: COLORS.background,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/profile')}
          >
            {user?.name?.[0] || 'U'}
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography.Text style={{ 
              color: COLORS.text, 
              fontSize: '13px', 
              fontWeight: 500,
              lineHeight: '1.2'
            }}>
              {user?.name || 'User'}
            </Typography.Text>
            <Tag
              color={COLORS.secondary}
              style={{ 
                border: 'none',
                fontSize: '10px',
                padding: '1px 6px',
                height: '18px',
                borderRadius: '9px',
                color: COLORS.background,
                fontWeight: 500,
                marginTop: '2px'
              }}
            >
              {user?.role?.replace('_', ' ') || 'Student'}
            </Tag>
          </div>
          <Button
            type="text"
            size="small"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ 
              color: `${COLORS.text}80`,
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              marginLeft: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${COLORS.action}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Logout
          </Button>
        </Space>
      ) : (
        <Space size="small" style={{ marginLeft: '16px' }}>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            style={{ 
              background: COLORS.action,
              border: 'none',
              height: '40px',
              fontWeight: 600,
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E04344';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.action}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.action;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Login
          </Button>
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={() => navigate('/register')}
            style={{ 
              color: COLORS.secondary,
              fontWeight: 500,
              height: '40px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${COLORS.secondary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Sign Up
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
        },
        mask: {
          backgroundColor: 'rgba(18, 24, 27, 0.8)'
        }
      }}
    >
      <div style={{ 
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${COLORS.secondary}20`
      }}>
        <Typography.Text strong style={{ 
          color: COLORS.text, 
          fontSize: '18px',
          fontWeight: 600
        }}>
          Menu
        </Typography.Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setDrawerOpen(false)}
          style={{ 
            color: COLORS.text,
            borderRadius: '6px'
          }}
        />
      </div>

      <div style={{ flex: 1, padding: '16px 0' }}>
        <Menu
          mode="vertical"
          items={navigationItems
            .filter(item => !item.councilOnly || isCouncil)
            .map(item => ({
              key: item.key,
              icon: item.icon,
              label: (
                <span style={{ fontSize: '15px', fontWeight: 500 }}>
                  {item.label}
                </span>
              ),
              onClick: () => handleNavigation(item.link),
              style: {
                height: '56px',
                margin: '0 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                color: COLORS.text
              }
            }))}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
          theme="dark"
        />
      </div>

      {isLoggedIn && user ? (
        <div style={{ 
          padding: '24px',
          borderTop: `1px solid ${COLORS.secondary}20`
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: `${COLORS.background}80`,
            marginBottom: '16px'
          }}>
            <Avatar
              size={40}
              style={{ 
                background: COLORS.secondary,
                color: COLORS.background,
                marginRight: '12px'
              }}
            >
              {user?.name?.[0] || 'U'}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Typography.Text style={{ 
                display: 'block',
                color: COLORS.text,
                fontWeight: 500,
                fontSize: '14px'
              }}>
                {user?.name || 'User'}
              </Typography.Text>
              <Tag
                color={COLORS.secondary}
                style={{ 
                  border: 'none',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  color: COLORS.background,
                  fontWeight: 500,
                  marginTop: '4px'
                }}
              >
                {user?.role?.replace('_', ' ') || 'Student'}
              </Tag>
            </div>
          </div>
          
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => {
              navigate('/profile');
              setDrawerOpen(false);
            }}
            block
            style={{
              height: '48px',
              fontWeight: 500,
              borderRadius: '8px',
              fontSize: '15px',
              color: COLORS.text,
              marginBottom: '8px',
              textAlign: 'left',
              justifyContent: 'flex-start',
              padding: '0 16px'
            }}
          >
            Profile
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            style={{
              height: '48px',
              fontWeight: 600,
              borderRadius: '8px',
              fontSize: '15px',
              marginTop: '8px'
            }}
          >
            Log Out
          </Button>
        </div>
      ) : (
        <div style={{ 
          padding: '24px',
          borderTop: `1px solid ${COLORS.secondary}20`
        }}>
          <Typography.Paragraph 
            style={{ 
              color: `${COLORS.text}80`,
              fontSize: '12px',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            Join our community today
          </Typography.Paragraph>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              navigate('/register');
              setDrawerOpen(false);
            }}
            block
            style={{
              background: COLORS.action,
              border: 'none',
              height: '48px',
              fontWeight: 600,
              borderRadius: '8px',
              fontSize: '15px',
              marginBottom: '8px'
            }}
          >
            Sign Up
          </Button>
          <Button
            type="text"
            icon={<LoginOutlined />}
            onClick={() => {
              navigate('/login');
              setDrawerOpen(false);
            }}
            block
            style={{
              color: COLORS.secondary,
              height: '40px',
              fontWeight: 500,
              borderRadius: '8px'
            }}
          >
            Login
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
        padding: '0',
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        backgroundColor: `${COLORS.background}dd`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 30px'
        }}>
          {/* Logo */}
          <Space
            onClick={() => navigate('/')}
            style={{ 
              cursor: 'pointer',
              userSelect: 'none',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.secondary}80)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 8px ${COLORS.secondary}30`
            }}>
              <CrownOutlined style={{ 
                fontSize: '18px',
                color: COLORS.text 
              }} />
            </div>
            <Typography.Title
              level={5}
              style={{
                margin: 0,
                color: COLORS.text,
                fontWeight: 600,
                lineHeight: 1,
                fontSize: '18px'
              }}
            >
              Student Council Portal
            </Typography.Title>
          </Space>

          {/* Desktop Navigation */}
          {!isMobile && <DesktopNav />}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              style={{ 
                color: COLORS.text,
                padding: '8px',
                borderRadius: '8px'
              }}
            />
          )}
        </div>
      </Header>
      <MobileDrawer />
      <Outlet />
    </>
  );
};

export default Navbar;