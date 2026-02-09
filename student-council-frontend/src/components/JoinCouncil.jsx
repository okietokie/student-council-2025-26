import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Space, 
  Avatar, 
  Tag, 
  Divider, 
  Row, 
  Col, 
  Alert,
  Grid
} from 'antd';
import {
  LeftOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  CloseOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  BlockOutlined,
  ArrowLeftOutlined,
  FireOutlined,
  QuestionOutlined,
  BulbOutlined,
  StopOutlined,
  CheckOutlined,
  ExclamationOutlined,
  CrownOutlined,
  HeartOutlined,
  StarOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors.js';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function JoinCouncil() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
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
          Want to know a secret? <QuestionOutlined />
        </>
      );
    } else if (clickCount === 1) {
      return (
        <>
          Still clicking? Seriously? <ExclamationOutlined />
        </>
      );
    } else if (clickCount === 2) {
      return (
        <>
          Okay, you are officially obsessed <DislikeOutlined />
        </>
      );
    } else {
      return (
        <>
          Seriously? {clickCount} times? <ExclamationOutlined />
        </>
      );
    }
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
        return <FrownOutlined style={{ fontSize: '80px', color: COLORS.action }} />;
      case 'sad':
        return <MehOutlined style={{ fontSize: '80px', color: COLORS.secondary }} />;
      default:
        return <SmileOutlined style={{ fontSize: '80px', color: COLORS.text }} />;
    }
  };

  const statsData = [
    {
      icon: <CalendarOutlined />,
      color: COLORS.action,
      label: "Elections Ended",
      value: "Last Year",
      subtext: "You missed it",
      subicon: <CloseOutlined />
    },
    {
      icon: <ClockCircleOutlined />,
      color: COLORS.secondary,
      label: "Next Chance",
      value: "6 Months",
      subtext: "Patience is key",
      subicon: <SyncOutlined />
    },
    {
      icon: <CrownOutlined />,
      color: COLORS.secondary,
      label: "Council Seats",
      value: "All Full",
      subtext: "Zero vacancies",
      subicon: <TeamOutlined />
    },
    {
      icon: <ExclamationOutlined />,
      color: COLORS.action,
      label: "Your Timing",
      value: "Terrible",
      subtext: "Absolutely awful",
      subicon: <QuestionOutlined />
    }
  ];

  const getButtonText = () => {
    if (clickCount === 0) return "Try to Join Council";
    if (clickCount === 1) return "Try Again";
    if (clickCount === 2) return "Seriously, Stop";
    if (clickCount === 3) return "Okay You Win";
    return "Done";
  };

  const getButtonIcon = () => {
    if (clickCount === 0) return <TrophyOutlined />;
    if (clickCount === 1) return <SyncOutlined />;
    if (clickCount === 2) return <StopOutlined />;
    if (clickCount === 3) return <HeartOutlined />;
    return <CloseOutlined />;
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: COLORS.background,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <div style={{ 
        position: 'absolute',
        top: 50,
        left: 50,
        color: `${COLORS.action}15`,
        fontSize: '120px',
        transform: 'rotate(45deg)',
        opacity: 0.3
      }}>
        <BlockOutlined />
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: 50,
        right: 50,
        color: `${COLORS.secondary}15`,
        fontSize: '120px',
        transform: 'rotate(-45deg)',
        opacity: 0.3
      }}>
        <ClockCircleOutlined />
      </div>

      <Content style={{ 
        padding: screens.xs ? '40px 20px' : '80px 30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="text"
          style={{ 
            marginBottom: '32px',
            color: `${COLORS.text}CC`
          }}
        >
          Back to Reality
        </Button>

        <Card
          style={{
            borderRadius: '16px',
            border: `2px dashed ${COLORS.action}40`,
            background: COLORS.surface,
            position: 'relative',
            marginTop: '20px',
            overflow: 'visible'
          }}
          bodyStyle={{ 
            padding: screens.xs ? '24px' : '48px'
          }}
        >
          {/* Warning Banner */}
          <div style={{ 
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 24px',
            background: COLORS.action,
            color: COLORS.text,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1,
            whiteSpace: 'nowrap'
          }}>
            <WarningOutlined />
            <Text strong style={{ color: COLORS.text, fontSize: '14px' }}>
              SASSY MESSAGE INCOMING
            </Text>
          </div>

          {/* Header */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <div style={{ 
              position: 'relative',
              marginBottom: '32px'
            }}>
              <Avatar
                size={120}
                style={{ 
                  background: `${COLORS.action}20`,
                  border: `4px solid ${COLORS.action}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MoodIcon />
              </Avatar>
              
              {clickCount > 0 && (
                <Tag
                  icon={<FireOutlined />}
                  color={COLORS.action}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    background: COLORS.action,
                    color: COLORS.text,
                    border: 'none'
                  }}
                >
                  Clicked {clickCount} time{clickCount !== 1 ? 's' : ''}
                </Tag>
              )}
            </div>
            
            <Title level={1} style={{ 
              marginBottom: '24px',
              color: COLORS.action,
              fontSize: screens.xs ? '2.5rem' : '3.5rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <BlockOutlined />
              Elections Are Over!
            </Title>
            
            <Title level={4} style={{ 
              color: `${COLORS.text}CC`, 
              marginBottom: 0,
              maxWidth: '600px',
              lineHeight: 1.6,
              fontStyle: 'italic',
              fontWeight: 400
            }}>
              {getSubMessage()}
            </Title>
          </div>

          <Divider style={{ 
            borderColor: `${COLORS.secondary}40`,
            margin: '40px 0'
          }}>
            <Tag 
              icon={<BulbOutlined />} 
              color={COLORS.secondary}
              style={{ 
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                background: `${COLORS.secondary}20`,
                border: `1px solid ${COLORS.secondary}40`,
                color: COLORS.secondary
              }}
            >
              SASS LEVEL: EXPERT
            </Tag>
          </Divider>

          {/* Interactive Section */}
          <div style={{ 
            marginBottom: '48px',
            padding: '32px',
            borderRadius: '12px',
            background: `${COLORS.background}`,
            border: `1px solid ${COLORS.secondary}30`,
            textAlign: 'center'
          }}>
            <Title level={4} style={{ 
              marginBottom: '16px',
              color: COLORS.secondary,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {getSassyMessage()}
            </Title>
            
            <Paragraph style={{ 
              marginBottom: '32px',
              color: `${COLORS.text}CC`,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              This button does absolutely nothing useful
              <QuestionOutlined />
              But go ahead, click it anyway
              <EyeOutlined />
            </Paragraph>
            
            <Button
              type="primary"
              size="large"
              icon={getButtonIcon()}
              onClick={handleButtonClick}
              disabled={clickCount > 3}
              style={{ 
                padding: '16px 48px',
                height: 'auto',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                background: COLORS.action,
                border: 'none',
                transform: clickCount > 0 ? 'scale(0.95)' : 'none',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 20px ${COLORS.action}40`
              }}
            >
              {getButtonText()}
            </Button>
            
            {showExitButton && (
              <Button
                icon={<CloseOutlined />}
                onClick={() => navigate('/')}
                type="text"
                style={{ 
                  marginTop: '24px',
                  color: `${COLORS.text}CC`
                }}
              >
                I will leave now
              </Button>
            )}
          </div>

          {/* Stats Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
            {statsData.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    height: '100%',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: `${stat.color}10`,
                    border: `1px solid ${stat.color}30`
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ 
                    marginBottom: '16px',
                    color: stat.color,
                    fontSize: '40px'
                  }}>
                    {stat.icon}
                  </div>
                  <Title level={3} style={{ 
                    margin: '8px 0',
                    color: COLORS.text,
                    fontWeight: 700
                  }}>
                    {stat.value}
                  </Title>
                  <Text style={{ 
                    color: `${COLORS.text}CC`,
                    display: 'block',
                    marginBottom: '8px'
                  }}>
                    {stat.label}
                  </Text>
                  <Text style={{ 
                    color: `${COLORS.text}99`,
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '12px'
                  }}>
                    {stat.subtext}
                    <span style={{ fontSize: '10px' }}>
                      {stat.subicon}
                    </span>
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Funny Tip */}
          <Alert
            message={
              <div style={{ padding: '8px 0' }}>
                <Title level={5} style={{ margin: '0 0 8px 0', color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarOutlined />
                  {getFunnyTip()}
                </Title>
                <Text style={{ color: `${COLORS.text}CC`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  While you wait, maybe work on your campaign speech
                  <ThunderboltOutlined />
                  Just a thought
                  <BulbOutlined />
                </Text>
              </div>
            }
            type="info"
            icon={<SmileOutlined />}
            style={{
              marginBottom: '48px',
              borderRadius: '12px',
              background: `${COLORS.secondary}10`,
              border: `1px solid ${COLORS.secondary}30`
            }}
          />

          {/* Action Buttons */}
          <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '48px' }}>
            <Col xs={24} md={8}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => navigate('/')}
                block
                style={{
                  padding: '16px',
                  height: 'auto',
                  borderRadius: '8px',
                  background: COLORS.secondary,
                  border: 'none',
                  fontWeight: 500
                }}
              >
                Attend Events Instead
              </Button>
            </Col>
            
            <Col xs={24} md={8}>
              <Button
                type="default"
                icon={<TeamOutlined />}
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const councilSection = document.getElementById('council-section');
                    if (councilSection) {
                      councilSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                block
                style={{
                  padding: '16px',
                  height: 'auto',
                  borderRadius: '8px',
                  borderColor: COLORS.secondary,
                  color: COLORS.secondary,
                  fontWeight: 500
                }}
              >
                Meet Current Council
              </Button>
            </Col>
            
            <Col xs={24} md={8}>
              <Button
                type="default"
                icon={<BlockOutlined />}
                onClick={() => navigate('/')}
                block
                style={{
                  padding: '16px',
                  height: 'auto',
                  borderRadius: '8px',
                  borderColor: COLORS.action,
                  color: COLORS.action,
                  fontWeight: 500
                }}
              >
                Accept Defeat
              </Button>
            </Col>
          </Row>

          {/* Footer */}
          <div style={{ 
            padding: '24px',
            background: `${COLORS.background}CC`,
            borderTop: `1px solid ${COLORS.secondary}30`,
            borderRadius: '0 0 14px 14px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ExclamationOutlined style={{ color: `${COLORS.text}CC`, fontSize: '16px' }} />
                <Text style={{ color: `${COLORS.text}CC`, fontSize: '14px' }}>
                  This page contains pure, unadulterated sass
                </Text>
                <ExclamationOutlined style={{ color: `${COLORS.text}CC`, fontSize: '16px' }} />
              </div>
              <Text style={{ 
                color: `${COLORS.text}99`, 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>No council members were harmed</span>
                <CheckCircleOutlined style={{ fontSize: '12px' }} />
                <span>Except maybe your hopes</span>
                <FrownOutlined style={{ fontSize: '12px' }} />
              </Text>
            </Space>
          </div>
        </Card>

        {/* Easter Egg */}
        {clickCount > 5 && (
          <Alert
            message={
              <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <FireOutlined style={{ color: COLORS.action, fontSize: '24px' }} />
                  <Title level={4} style={{ margin: 0, color: COLORS.action }}>
                    CONGRATULATIONS
                  </Title>
                  <FireOutlined style={{ color: COLORS.action, fontSize: '24px' }} />
                </div>
                <Text style={{ color: COLORS.text, marginBottom: '4px' }}>
                  You have unlocked the Persistently Hopeless achievement
                </Text>
                <Text style={{ color: `${COLORS.text}99`, fontStyle: 'italic', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  That is not a real achievement
                  <QuestionOutlined style={{ fontSize: '10px' }} />
                  Please stop clicking
                  <CloseOutlined style={{ fontSize: '10px' }} />
                </Text>
              </Space>
            }
            type="warning"
            style={{
              marginTop: '32px',
              borderRadius: '12px',
              background: `${COLORS.action}10`,
              border: `2px solid ${COLORS.action}`
            }}
          />
        )}
      </Content>
    </Layout>
  );
}