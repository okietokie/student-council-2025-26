import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Statistic,
  Tag,
  Space,
  Divider,
  Alert,
  Spin,
  Grid,
  Timeline,
  Avatar
} from 'antd';
import {
  TeamOutlined,
  NotificationOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  MessageOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  CrownOutlined,
  StarOutlined,
  SafetyOutlined,
  GlobalOutlined,
  BulbOutlined,
  LineChartOutlined,
  UserOutlined,
  AuditOutlined,
  BankOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Announcements from './Announcements';
import CouncilCarousel from './helpers/Carousal';
import Navbar from '../../src/components/Navbar';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;
import { COLORS } from '../utils/colors.js';

// Container width (1100px to 1200px)
const CONTAINER_WIDTH = 1140;

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    fetchCouncilMembers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/classes/stats");
      if (response?.data?.success){
        setStats(response?.data?.stats);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  const fetchCouncilMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/council/fetch-council-members");
      
      if (response.data?.success) {
        const members = response.data.members || [];
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
        setError('Failed to fetch council members');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Container style with proper margins
  const containerStyle = {
    maxWidth: CONTAINER_WIDTH,
    margin: '0 auto',
    padding: screens.xs ? '0 20px' : '0 30px'
  };

  // Section spacing (80px to 120px vertical)
  const sectionStyle = {
    paddingTop: screens.xs ? '60px' : '100px',
    paddingBottom: screens.xs ? '60px' : '100px'
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: COLORS.background,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Content style={{ 
        ...sectionStyle,
        background: COLORS.background,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.secondary}20, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        
        <div style={containerStyle}>
          <Row gutter={[80, 80]} align="middle">
            <Col xs={24} lg={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Tag 
                  style={{ 
                    padding: '8px 20px', 
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '20px',
                    border: 'none',
                    background: `${COLORS.secondary}20`,
                    color: COLORS.text,
                    marginBottom: '8px',
                    width: 'fit-content'
                  }}
                >
                  <BulbOutlined style={{ marginRight: 8 }} /> Student Governance Platform
                </Tag>
                
                <Title 
                  level={1} 
                  style={{ 
                    fontSize: screens.xs ? '2.5rem' : '3.5rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    margin: 0,
                    color: COLORS.text
                  }}
                >
                  Your Voice,
                  <span style={{ color: COLORS.secondary, display: 'block' }}>
                    Amplified
                  </span>
                </Title>
                
                <Paragraph 
                  style={{ 
                    fontSize: '18px',
                    lineHeight: 1.6,
                    color: `${COLORS.text}CC`,
                    marginBottom: 0,
                    maxWidth: '600px'
                  }}
                >
                  A professional platform for democratic participation, 
                  transparent governance, and student leadership at your institution.
                </Paragraph>
                
                <Space size="middle" wrap style={{ marginTop: 32 }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => {
                      const section = document.getElementById('announcements-section');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ 
                      height: '48px',
                      padding: '12px 32px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      background: COLORS.action,
                      border: 'none',
                      boxShadow: `0 4px 20px ${COLORS.action}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 6px 25px ${COLORS.action}60`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 20px ${COLORS.action}40`;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    View Current Polls
                  </Button>
                  
                  <Button
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate('/')}
                    style={{ 
                      height: '48px',
                      padding: '12px 32px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      border: `2px solid ${COLORS.secondary}`,
                      color: COLORS.secondary,
                      background: 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${COLORS.secondary}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Get Started
                  </Button>
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: '16px',
                  border: `1px solid ${COLORS.surface}`,
                  background: COLORS.surface,
                  maxWidth: '500px',
                  margin: '0 auto',
                  transition: 'transform 0.3s ease'
                }}
                bodyStyle={{ padding: '40px' }}
                hoverable
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.action})`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <CrownOutlined style={{ fontSize: '36px', color: COLORS.text }} />
                </div>
                
                <Title level={3} style={{ 
                  marginBottom: '24px',
                  color: COLORS.text,
                  textAlign: 'center'
                }}>
                  Student Council Dashboard
                </Title>
                
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic 
                        title="Active Members" 
                        value={stats?.activeUsers} 
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: COLORS.secondary }}
                        titleStyle={{ color: `${COLORS.text}CC` }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="Ongoing Polls" 
                        value={stats?.activePolls}
                        prefix={<NotificationOutlined />}
                        valueStyle={{ color: COLORS.secondary }}
                        titleStyle={{ color: `${COLORS.text}CC` }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="Resolved Issues" 
                        value={0}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: COLORS.secondary }}
                        titleStyle={{ color: `${COLORS.text}CC` }}
                      />
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Stats Section */}
      <Content style={{ 
        ...sectionStyle,
        background: `${COLORS.background}`
      }}>
        <div style={containerStyle}>
          <Row gutter={[32, 32]}>
            {[
              { 
                icon: <TeamOutlined />, 
                value: stats?.activeUsers, 
                label: 'Student Participants', 
              },
              { 
                icon: <CheckCircleOutlined />, 
                value: '100%', 
                label: 'Issue Resolution', 
              },
              { 
                icon: <TrophyOutlined />, 
                value: stats?.activeEvents, 
                label: 'Events Hosted', 
              },
              { 
                icon: <GlobalOutlined />, 
                value: '24/7', 
                label: 'Platform Access', 
              }
            ].map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{ 
                    textAlign: 'center',
                    background: COLORS.surface,
                    borderRadius: '12px',
                    border: `1px solid ${COLORS.surface}`,
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: `${COLORS.secondary}20`,
                    marginBottom: '20px'
                  }}>
                    <div style={{ 
                      fontSize: '28px', 
                      color: COLORS.secondary
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                  <Title level={2} style={{ 
                    margin: '8px 0', 
                    color: COLORS.text,
                    fontSize: '2.5rem'
                  }}>
                    {stat.value}
                  </Title>
                  <Text style={{ 
                    color: `${COLORS.text}CC`,
                    fontSize: '14px',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    {stat.label}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Announcements Section */}
      <Content 
        id="announcements-section"
        style={{ 
          ...sectionStyle,
          background: COLORS.background
        }}
      >
        <div style={containerStyle}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `${COLORS.secondary}20`,
                marginBottom: '24px'
              }}>
                <NotificationOutlined style={{ 
                  fontSize: '28px', 
                  color: COLORS.secondary 
                }} />
              </div>
              <Title level={2} style={{ 
                marginBottom: '16px',
                color: COLORS.text,
                fontSize: '2rem'
              }}>
                Campus Announcements & Polls
              </Title>
              <Paragraph style={{ 
                fontSize: '18px',
                color: `${COLORS.text}CC`,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Stay updated with the latest decisions, voting results, and campus news
              </Paragraph>
            </div>
            
            <Card
              style={{ 
                borderRadius: '16px',
                border: `1px solid ${COLORS.surface}`,
                background: COLORS.surface,
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Announcements />
            </Card>
          </Space>
        </div>
      </Content>

      {/* Council Section */}
      <Content 
      id='council-section'
      style={{ 
        ...sectionStyle,
        background: COLORS.background
      }}>
        <div style={containerStyle}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `${COLORS.secondary}20`,
                marginBottom: '24px'
              }}>
                <TeamOutlined style={{ 
                  fontSize: '28px', 
                  color: COLORS.secondary 
                }} />
              </div>
              <Title level={2} style={{ 
                marginBottom: '16px',
                color: COLORS.text,
                fontSize: '2rem'
              }}>
                Student Council Leadership
              </Title>
              <Paragraph style={{ 
                fontSize: '18px',
                color: `${COLORS.text}CC`,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Meet your elected representatives working to improve campus life
              </Paragraph>
            </div>

            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 0',
                background: COLORS.surface,
                borderRadius: '16px'
              }}>
                <Spin size="large" />
              </div>
            ) : error ? (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ 
                  marginBottom: '24px',
                  borderRadius: '8px',
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.action}40`,
                  color: COLORS.text
                }}
              />
            ) : councilMembers.length === 0 ? (
              <Card
                style={{ 
                  textAlign: 'center',
                  padding: '60px 40px',
                  background: COLORS.surface,
                  borderRadius: '16px',
                  border: `2px dashed ${COLORS.secondary}30`
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `${COLORS.secondary}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <UserOutlined style={{ fontSize: '36px', color: COLORS.secondary }} />
                </div>
                <Title level={4} style={{ 
                  color: COLORS.text,
                  marginBottom: '16px'
                }}>
                  Council Assembly in Progress
                </Title>
                <Paragraph style={{ color: `${COLORS.text}CC`, marginBottom: 0 }}>
                  Leadership positions will be announced shortly
                </Paragraph>
              </Card>
            ) : (
              <CouncilCarousel members={councilMembers} />
            )}

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/join-council')}
                style={{ 
                  height: '48px',
                  padding: '12px 40px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: `2px solid ${COLORS.secondary}`,
                  color: COLORS.secondary,
                  background: 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${COLORS.secondary}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Join Leadership Team
              </Button>
            </div>
          </Space>
        </div>
      </Content>

      {/* Features Section */}
      <Content style={{ 
        ...sectionStyle,
        background: COLORS.background
      }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `${COLORS.secondary}20`,
              marginBottom: '24px'
            }}>
              <SettingOutlined style={{ 
                fontSize: '28px', 
                color: COLORS.secondary 
              }} />
            </div>
            <Title level={2} style={{ 
              marginBottom: '16px',
              color: COLORS.text,
              fontSize: '2rem'
            }}>
              Platform Features
            </Title>
            <Paragraph style={{ 
              fontSize: '18px',
              color: `${COLORS.text}CC`,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Everything you need for effective student governance
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {[
              {
                icon: <NotificationOutlined />,
                title: 'Live Polling',
                description: 'Real-time voting with instant results and analytics'
              },
              {
                icon: <MessageOutlined />,
                title: 'Transparent Discussions',
                description: 'Open forums for campus-wide dialogue and feedback'
              },
              {
                icon: <CalendarOutlined />,
                title: 'Event Management',
                description: 'Coordinate and promote campus events seamlessly'
              },
              {
                icon: <LineChartOutlined />,
                title: 'Analytics Dashboard',
                description: 'Data-driven insights into student engagement'
              },
              {
                icon: <SafetyOutlined />,
                title: 'Secure Platform',
                description: 'Enterprise-grade security and privacy protection'
              },
              {
                icon: <StarOutlined />,
                title: 'Recognition System',
                description: 'Acknowledge contributions and achievements'
              }
            ].map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Card
                  hoverable
                  style={{ 
                    borderRadius: '12px',
                    border: `1px solid ${COLORS.surface}`,
                    background: COLORS.surface,
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '32px' }}
                >
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: `${COLORS.secondary}20`,
                    marginBottom: '24px'
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      color: COLORS.secondary
                    }}>
                      {feature.icon}
                    </div>
                  </div>
                  <Title level={4} style={{ 
                    marginBottom: '12px',
                    color: COLORS.text,
                    fontSize: '18px'
                  }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ 
                    margin: 0,
                    color: `${COLORS.text}CC`,
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Timeline Section */}
      <Content style={{ 
        ...sectionStyle,
        background: COLORS.background
      }}>
        <div style={containerStyle}>
          <Card
            style={{ 
              borderRadius: '16px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.surface}`,
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '48px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `${COLORS.secondary}20`,
                marginBottom: '24px'
              }}>
                <AuditOutlined style={{ 
                  fontSize: '28px', 
                  color: COLORS.secondary 
                }} />
              </div>
              <Title level={3} style={{ 
                marginBottom: '16px',
                color: COLORS.text
              }}>
                How It Works
              </Title>
              <Paragraph style={{ 
                color: `${COLORS.text}CC`,
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Four simple steps to make your voice heard
              </Paragraph>
            </div>
            
            <Timeline
              mode="alternate"
              style={{ marginTop: 40 }}
              items={[
                {
                  children: (
                    <Card
                      style={{ 
                        background: `${COLORS.background}CC`,
                        border: `1px solid ${COLORS.secondary}30`,
                        borderRadius: '12px'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <Title level={5} style={{ margin: '0 0 8px 0', color: COLORS.text }}>
                        Submit Your Idea
                      </Title>
                      <Text style={{ color: `${COLORS.text}CC`, lineHeight: 1.6 }}>
                        Propose changes or improvements through our platform
                      </Text>
                    </Card>
                  ),
                  color: COLORS.secondary
                },
                {
                  children: (
                    <Card
                      style={{ 
                        background: `${COLORS.background}CC`,
                        border: `1px solid ${COLORS.secondary}30`,
                        borderRadius: '12px'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <Title level={5} style={{ margin: '0 0 8px 0', color: COLORS.text }}>
                        Council Review
                      </Title>
                      <Text style={{ color: `${COLORS.text}CC`, lineHeight: 1.6 }}>
                        Student council evaluates and prioritizes proposals
                      </Text>
                    </Card>
                  ),
                  color: COLORS.secondary
                },
                {
                  children: (
                    <Card
                      style={{ 
                        background: `${COLORS.background}CC`,
                        border: `1px solid ${COLORS.secondary}30`,
                        borderRadius: '12px'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <Title level={5} style={{ margin: '0 0 8px 0', color: COLORS.text }}>
                        Campus Voting
                      </Title>
                      <Text style={{ color: `${COLORS.text}CC`, lineHeight: 1.6 }}>
                        Entire student body votes on important decisions
                      </Text>
                    </Card>
                  ),
                  color: COLORS.secondary
                },
                {
                  children: (
                    <Card
                      style={{ 
                        background: `${COLORS.background}CC`,
                        border: `1px solid ${COLORS.secondary}30`,
                        borderRadius: '12px'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      <Title level={5} style={{ margin: '0 0 8px 0', color: COLORS.text }}>
                        Implementation
                      </Title>
                      <Text style={{ color: `${COLORS.text}CC`, lineHeight: 1.6 }}>
                        Council works with administration to implement changes
                      </Text>
                    </Card>
                  ),
                  color: COLORS.secondary
                }
              ]}
            />
          </Card>
        </div>
      </Content>

      {/* Footer */}
      <Content style={{ 
        padding: '80px 24px 40px 24px', 
        background: COLORS.surface,
        color: COLORS.text
      }}>
        <div style={{ maxWidth: CONTAINER_WIDTH, margin: '0 auto' }}>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size="middle">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${COLORS.secondary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BankOutlined style={{ fontSize: '24px', color: COLORS.secondary }} />
                  </div>
                  <Title level={3} style={{ 
                    color: COLORS.text, 
                    margin: 0, 
                    fontSize: '24px',
                    fontWeight: 600
                  }}>
                    Student Council Portal
                  </Title>
                </div>
                <Paragraph style={{ 
                  color: `${COLORS.text}CC`,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  marginBottom: 0
                }}>
                  Empowering student voices through transparent governance and democratic participation.
                </Paragraph>
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Title level={5} style={{ 
                color: COLORS.text, 
                marginBottom: '24px', 
                fontSize: '16px',
                fontWeight: 600
              }}>
                Quick Links
              </Title>
              <Space direction="vertical">
                {['About Us', 'Contact'].map((link) => (
                  <Button 
                    key={link} 
                    type="link" 
                    style={{ 
                      color: `${COLORS.text}CC`,
                      padding: 0,
                      height: 'auto',
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 400
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = `${COLORS.text}CC`;
                    }}
                  >
                    {link}
                  </Button>
                ))}
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Title level={5} style={{ 
                color: COLORS.text, 
                marginBottom: '24px', 
                fontSize: '16px',
                fontWeight: 600
              }}>
                Contact Information
              </Title>
              <Space direction="vertical">
                <Text style={{ 
                  color: `${COLORS.text}CC`, 
                  fontSize: '14px',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  stdccl2526@outlook.com
                </Text>
                <Text style={{ 
                  color: `${COLORS.text}CC`, 
                  fontSize: '14px',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  +1 (555) 123-4567
                </Text>
                <Text style={{ 
                  color: `${COLORS.text}CC`, 
                  fontSize: '14px'
                }}>
                  Times Education, Abu Dhabi
                </Text>
              </Space>
            </Col>
          </Row>
          
          <Divider style={{ 
            borderColor: `${COLORS.secondary}30`, 
            margin: '48px 0 32px 0' 
          }} />
          
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{ 
                color: `${COLORS.text}80`,
                fontSize: '12px'
              }}>
                © {new Date().getFullYear()} Student Council Portal. All rights reserved.
              </Text>
            </Col>
            <Col>
              <Text style={{ 
                color: COLORS.secondary,
                fontSize: '14px',
                fontWeight: 500
              }}>
                Your Voice Matters
              </Text>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Homepage;