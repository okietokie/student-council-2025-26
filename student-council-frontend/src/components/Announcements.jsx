import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Tag, 
  Progress, 
  Button, 
  Alert, 
  Space, 
  Divider, 
  Statistic,
  Row,
  Col,
  Spin
} from 'antd';
import {
  CheckSquareOutlined,
  BarChartOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { COLORS } from '../utils/colors.js';

const { Title, Text, Paragraph } = Typography;
const { Countdown } = Statistic;

const Announcements = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState({
    active: [],
    completed: []
  });

  const fetchLatestPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/classes/get-polls');
      if (response.data && response.data.success) {
        setPolls({
          active: response.data.latestActivePolls || [],
          completed: response.data.latestCompletedPolls || []
        });
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPolls();
  }, []);

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getWinningOption = (poll) => {
    if (!poll.options || poll.options.length === 0) return null;
    return poll.options.reduce((prev, current) => 
      ((prev.votes || 0) > (current.votes || 0)) ? prev : current
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '60px 0'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ 
          marginBottom: '24px',
          borderRadius: '8px',
          background: COLORS.surface,
          border: `1px solid ${COLORS.action}40`
        }}
      />
    );
  }

  const totalPolls = polls.active.length + polls.completed.length;
  if (totalPolls === 0) {
    return (
      <Card
        style={{
          padding: '48px 32px',
          background: COLORS.surface,
          border: `2px dashed ${COLORS.secondary}40`,
          borderRadius: '16px',
          textAlign: 'center'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <CheckSquareOutlined style={{ 
          fontSize: '64px', 
          color: `${COLORS.secondary}40`,
          marginBottom: '24px'
        }} />
        <Title level={4} style={{ 
          marginBottom: '12px',
          color: `${COLORS.text}CC`
        }}>
          No Polls Available
        </Title>
        <Paragraph style={{ 
          marginBottom: '32px',
          color: `${COLORS.text}99`
        }}>
          Check back later for active polls and announcements.
        </Paragraph>
        <Button
          type="default"
          onClick={() => navigate('/')}
          style={{ 
            borderColor: COLORS.secondary,
            color: COLORS.secondary,
            borderRadius: '8px'
          }}
        >
          View All Polls
        </Button>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Active Polls Section */}
      {polls.active.length > 0 && (
        <div>
          <Space align="center" style={{ marginBottom: '24px' }}>
            <Tag
              icon={<CheckSquareOutlined />}
              color="success"
              style={{
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px'
              }}
            >
              Active
            </Tag>
            <Title level={4} style={{ 
              margin: 0,
              color: COLORS.text
            }}>
              Active Polls
            </Title>
          </Space>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {polls.active.map((poll) => {
              const totalVotes = poll.totalVotes || 0;
              const winningOption = getWinningOption(poll);
              
              return (
                <Card
                  key={poll._id}
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${COLORS.secondary}40`,
                    background: COLORS.surface,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  hoverable
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Space align="center">
                      <CheckSquareOutlined style={{ color: COLORS.secondary }} />
                      <Text strong style={{ 
                        fontSize: '16px',
                        color: COLORS.text
                      }}>
                        {poll.question}
                      </Text>
                    </Space>

                    {poll.options.slice(0, 2).map((option, idx) => {
                      const percentage = calculatePercentage(option.votes, totalVotes);
                      const isWinning = winningOption && option.text === winningOption.text;
                      
                      return (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                          <Space style={{ 
                            width: '100%', 
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <Space align="center">
                              {isWinning && totalVotes > 0 && (
                                <TrophyOutlined style={{ 
                                  fontSize: '14px',
                                  color: COLORS.action,
                                  marginRight: '4px'
                                }} />
                              )}
                              <Text style={{ 
                                fontWeight: isWinning ? 600 : 400,
                                color: isWinning ? COLORS.action : COLORS.text
                              }}>
                                {option.text}
                              </Text>
                            </Space>
                            <Text style={{ 
                              fontWeight: 600,
                              color: isWinning ? COLORS.action : `${COLORS.text}CC`,
                              fontSize: '14px'
                            }}>
                              {percentage}% ({option.votes})
                            </Text>
                          </Space>
                          <Progress
                            percent={percentage}
                            strokeColor={isWinning ? COLORS.action : COLORS.secondary}
                            trailColor={`${COLORS.secondary}20`}
                            strokeWidth={6}
                            showInfo={false}
                            style={{ 
                              borderRadius: '3px',
                              boxShadow: isWinning ? `0 0 4px ${COLORS.action}40` : 'none'
                            }}
                          />
                        </div>
                      );
                    })}

                    <Divider style={{ 
                      margin: '16px 0',
                      borderColor: `${COLORS.secondary}20`
                    }} />

                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <TeamOutlined style={{ 
                            fontSize: '14px',
                            color: `${COLORS.text}80`
                          }} />
                          <Text style={{ 
                            color: `${COLORS.text}80`,
                            fontSize: '12px'
                          }}>
                            {poll.votersCount} voter{poll.votersCount !== 1 ? 's' : ''}
                          </Text>
                          {totalVotes > 0 && (
                            <>
                              <Divider type="vertical" style={{ 
                                borderColor: `${COLORS.secondary}30`
                              }} />
                              <LineChartOutlined style={{ 
                                fontSize: '14px',
                                color: `${COLORS.text}80`
                              }} />
                              <Text style={{ 
                                color: `${COLORS.text}80`,
                                fontSize: '12px'
                              }}>
                                {totalVotes} total votes
                              </Text>
                            </>
                          )}
                        </Space>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          icon={<ArrowRightOutlined />}
                          onClick={() => navigate('/')}
                          style={{
                            background: COLORS.action,
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 500,
                            boxShadow: `0 2px 8px ${COLORS.action}40`
                          }}
                        >
                          Vote Now
                        </Button>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              );
            })}
          </Space>
        </div>
      )}

      {/* Completed Polls Section */}
      {polls.completed.length > 0 && (
        <div>
          <Space align="center" style={{ marginBottom: '24px' }}>
            <Tag
              icon={<BarChartOutlined />}
              color={COLORS.secondary}
              style={{
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                background: COLORS.secondary,
                color: COLORS.background
              }}
            >
              Results
            </Tag>
            <Title level={4} style={{ 
              margin: 0,
              color: COLORS.text
            }}>
              Recent Results
            </Title>
          </Space>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {polls.completed.map((poll) => {
              const totalVotes = poll.totalVotes || 0;
              const winningOption = getWinningOption(poll);
              
              return (
                <Card
                  key={poll._id}
                  style={{
                    borderRadius: '12px',
                    border: `1px solid ${COLORS.secondary}30`,
                    background: `${COLORS.surface}CC`,
                    backdropFilter: 'blur(10px)'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Space align="center">
                      <BarChartOutlined style={{ color: COLORS.secondary }} />
                      <Text strong style={{ 
                        fontSize: '16px',
                        color: COLORS.text
                      }}>
                        {poll.question}
                      </Text>
                    </Space>

                    {poll.options.slice(0, 3).map((option, idx) => {
                      const percentage = calculatePercentage(option.votes, totalVotes);
                      const isWinning = winningOption && option.text === winningOption.text;
                      
                      return (
                        <div key={idx} style={{ marginBottom: '12px' }}>
                          <Space style={{ 
                            width: '100%', 
                            justifyContent: 'space-between',
                            marginBottom: '4px'
                          }}>
                            <Space align="center">
                              {isWinning && totalVotes > 0 && (
                                <TrophyOutlined style={{ 
                                  fontSize: '12px',
                                  color: COLORS.action,
                                  marginRight: '4px'
                                }} />
                              )}
                              <Text style={{ 
                                fontWeight: isWinning ? 600 : 400,
                                color: isWinning ? COLORS.action : COLORS.text,
                                fontSize: '14px'
                              }}>
                                {option.text}
                              </Text>
                            </Space>
                            <Text style={{ 
                              fontWeight: 600,
                              color: isWinning ? COLORS.action : `${COLORS.text}CC`,
                              fontSize: '13px'
                            }}>
                              {percentage}% ({option.votes})
                            </Text>
                          </Space>
                          <Progress
                            percent={percentage}
                            strokeColor={isWinning ? COLORS.action : '#9c27b0'}
                            trailColor={`${COLORS.secondary}20`}
                            strokeWidth={4}
                            showInfo={false}
                            style={{ borderRadius: '2px' }}
                          />
                        </div>
                      );
                    })}

                    <Divider style={{ 
                      margin: '12px 0',
                      borderColor: `${COLORS.secondary}20`
                    }} />

                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <TeamOutlined style={{ 
                            fontSize: '13px',
                            color: `${COLORS.text}80`
                          }} />
                          <Text style={{ 
                            color: `${COLORS.text}80`,
                            fontSize: '12px'
                          }}>
                            {poll.votersCount} participant{poll.votersCount !== 1 ? 's' : ''}
                          </Text>
                        </Space>
                      </Col>
                      <Col>
                        <Text style={{ 
                          color: `${COLORS.text}80`,
                          fontSize: '12px'
                        }}>
                          {formatDate(poll.updatedAt)}
                        </Text>
                      </Col>
                    </Row>

                    {winningOption && totalVotes > 0 && (
                      <Alert
                        message={
                          <Text style={{ fontSize: '13px', fontWeight: 600 }}>
                            Final Verdict: {winningOption.text} ({calculatePercentage(winningOption.votes, totalVotes)}%)
                          </Text>
                        }
                        type="success"
                        icon={<CheckCircleOutlined />}
                        style={{
                          marginTop: '12px',
                          borderRadius: '8px',
                          background: `${COLORS.action}10`,
                          border: `1px solid ${COLORS.action}30`
                        }}
                      />
                    )}
                  </Space>
                </Card>
              );
            })}
          </Space>
        </div>
      )}

      {/* View All Button */}
      <div style={{ textAlign: 'center', paddingTop: '16px' }}>
        <Button
          type="primary"
          icon={<CheckSquareOutlined />}
          onClick={() => navigate('/')}
          size="large"
          style={{
            background: `linear-gradient(135deg, ${COLORS.action}, #D22728)`,
            border: 'none',
            borderRadius: '8px',
            padding: '12px 32px',
            fontWeight: 600,
            boxShadow: `0 4px 16px ${COLORS.action}40`
          }}
        >
          View All Polls & Results
        </Button>
      </div>
    </Space>
  );
};

export default Announcements;