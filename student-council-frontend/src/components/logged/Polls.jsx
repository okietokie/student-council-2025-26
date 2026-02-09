import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Avatar, 
  Tag, 
  Progress, 
  Modal, 
  Input, 
  Radio, 
  Alert, 
  Badge, 
  Divider, 
  Tooltip, 
  Skeleton,
  Grid,
  Popconfirm,
  message as antdMessage
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  CloseOutlined,
  CalendarOutlined,
  TeamOutlined,
  ReloadOutlined,
  CheckSquareOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { COLORS } from '../../utils/colors';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [editingPoll, setEditingPoll] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    endDate: ''
  });
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Fetch polls and user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchPolls();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get('/user/get-user-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response?.data?.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get('/admin/fetch-polls', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPolls(response.data.polls || []);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
      antdMessage.error('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has voted in a specific poll
  const hasUserVoted = (poll) => {
    if (!userData || !poll || !poll.voters) return false;
    return poll.voters.some(voter => voter.toString() === userData._id);
  };

  // Get user's previous vote index from userVotes array
  const getUserVoteIndex = (poll) => {
    if (!userData || !poll || !poll.userVotes) return null;
    const userVote = poll.userVotes.find(v => v.user.toString() === userData._id);
    return userVote ? userVote.option : null;
  };

  // Get user's vote change count
  const getUserVoteChanges = (poll) => {
    if (!userData || !poll || !poll.userVotes) return 0;
    const userVote = poll.userVotes.find(v => v.user.toString() === userData._id);
    return userVote ? (userVote.changes + 1 || 0) : 0;
  };

  // Get total votes from poll options
  const getTotalVotes = (poll) => {
    if (!poll || !poll.options) return 0;
    return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
  };

  const handleOpenVoteDialog = (poll) => {
    setSelectedPoll(poll);
    
    // Check if user already voted, pre-select their current vote
    const userVoteIndex = getUserVoteIndex(poll);
    setSelectedOption(userVoteIndex !== null ? userVoteIndex : null);
    
    setVoteDialogOpen(true);
  };

  const handleCloseVoteDialog = () => {
    setVoteDialogOpen(false);
    setSelectedPoll(null);
    setSelectedOption(null);
  };

  const handleSubmitVote = async () => {
    if (!selectedPoll || selectedOption === null) {
      antdMessage.warning('Please select an option to vote');
      return;
    }

    if (!userData) {
      antdMessage.error('Please login to vote');
      return;
    }

    setLoadingVote(true);
    try {
      const token = localStorage.getItem("token");
      
      // Always send optionIndex (backend handles both first vote and resubmission)
      const response = await axiosClient.post('/user/submit-vote', {
        pollId: selectedPoll._id,
        optionIndex: selectedOption
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userVoted = hasUserVoted(selectedPoll);
        const changes = getUserVoteChanges(selectedPoll);
        
        if (userVoted) {
          antdMessage.success(`Vote updated successfully! (${changes + 1}/3 changes used)`);
        } else {
          antdMessage.success('Vote submitted successfully!');
        }
        
        fetchPolls(); // Refresh polls to show updated votes
        handleCloseVoteDialog();
      } else {
        antdMessage.error(response.data.message || 'Failed to submit vote');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || 'Failed to submit vote');
    } finally {
      setLoadingVote(false);
    }
  };

  const handleOpenDialog = (poll = null) => {
    if (poll) {
      setEditingPoll(poll);
      setFormData({
        question: poll.question,
        options: poll.options.map(opt => opt.text),
        endDate: poll.endDate ? new Date(poll.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingPoll(null);
      setFormData({
        question: '',
        options: ['', ''],
        endDate: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPoll(null);
  };

  const handleFormChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'options' && index !== null) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      antdMessage.error('Poll question is required');
      return;
    }
    if (formData.options.some(opt => !opt.trim())) {
      antdMessage.error('All options must be filled');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (editingPoll) {
        await axiosClient.put(`/admin/edit-poll/${editingPoll._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        antdMessage.success('Poll updated successfully');
      } else {
        await axiosClient.post('/admin/create-poll', formData);
        antdMessage.success('Poll created successfully');
      }
      fetchPolls();
      handleCloseDialog();
    } catch (error) {
      antdMessage.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    
    try {
      await axiosClient.delete(`/admin/delete-poll/${pollId}`);
      antdMessage.success('Poll deleted successfully');
      fetchPolls();
    } catch (error) {
      antdMessage.error('Failed to delete poll');
    }
  };

  const handleReopenPoll = async (pollId) => {
    try {
      await axiosClient.put(`/admin/reopen-poll/${pollId}`);
      antdMessage.success('Poll reopened successfully');
      fetchPolls(); // refresh list
    } catch (error) {
      antdMessage.error('Failed to reopen poll');
    }
  };

  const handleFinishPoll = async (pollId) => {
    try {
      await axiosClient.post(`/admin/finish-poll/${pollId}`);
      antdMessage.success('Poll finished successfully');
      fetchPolls();
    } catch (error) {
      antdMessage.error('Failed to finish poll');
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const activePolls = polls.filter(poll => poll.isActive);
  const finishedPolls = polls.filter(poll => !poll.isActive);
  const isCouncil = userData?.role === "STUDENT_COUNCIL";
  const isAdmin = userData?.admin === true;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: COLORS.background,
      padding: isMobile ? '20px 16px' : '40px 30px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Card
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.secondary}30`,
            borderRadius: '16px',
            marginBottom: '30px'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Space size="large">
                <Avatar
                  size={64}
                  style={{
                    background: COLORS.secondary,
                    color: COLORS.background
                  }}
                  icon={<CheckSquareOutlined />}
                />
                <div>
                  <Title level={3} style={{ margin: 0, color: COLORS.text }}>
                    Student Council Polls
                  </Title>
                  <Text type="secondary">
                    {userData ? `Welcome, ${userData.name}` : 'Please login to vote'}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              {isCouncil && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleOpenDialog()}
                  disabled={!isAdmin}
                  style={{
                    background: COLORS.action,
                    border: 'none',
                    height: '48px',
                    padding: '0 24px',
                    borderRadius: '8px'
                  }}
                >
                  Create New Poll
                </Button>
              )}
            </Col>
          </Row>
        </Card>

        {/* Main Content */}
        <Row gutter={[30, 30]} wrap={isMobile}>
          {/* Ongoing Polls - Left Column */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <CheckSquareOutlined style={{ color: COLORS.secondary }} />
                  <Text strong style={{ color: COLORS.text, fontSize: '18px' }}>
                    Ongoing Polls
                  </Text>
                  <Tag color={COLORS.secondary}>{activePolls.length}</Tag>
                </Space>
              }
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                borderRadius: '16px',
                height: '100%'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : activePolls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckSquareOutlined style={{ 
                    fontSize: '64px', 
                    color: `${COLORS.text}30`,
                    marginBottom: '16px'
                  }} />
                  <Title level={4} style={{ color: `${COLORS.text}80`, marginBottom: '8px' }}>
                    No Active Polls
                  </Title>
                  <Text type="secondary">Create a new poll to get started</Text>
                </div>
              ) : (
                activePolls.map((poll) => {
                  const userVoted = hasUserVoted(poll);
                  const userVoteIndex = getUserVoteIndex(poll);
                  const userVoteChanges = getUserVoteChanges(poll);
                  const totalVotes = getTotalVotes(poll);
                  const votersCount = poll.voters ? poll.voters.length : 0;
                  
                  return (
                    <Card
                      key={poll._id}
                      style={{
                        border: userVoted ? `2px solid ${COLORS.secondary}` : `1px solid ${COLORS.secondary}30`,
                        borderRadius: '16px',
                        marginBottom: '16px',
                        background: COLORS.surface,
                        position: 'relative'
                      }}
                      hoverable
                    >
                      {userVoted && (
                        <Badge.Ribbon
                          text="Voted"
                          color={COLORS.secondary}
                          style={{
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        />
                      )}

                      <div style={{ padding: '24px' }}>
                        <Space style={{ width: '100%', marginBottom: '20px' }} direction="vertical" size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Title level={5} style={{ 
                              margin: 0, 
                              color: COLORS.text,
                              flex: 1,
                              marginRight: '16px'
                            }}>
                              {poll.question}
                            </Title>
                            <Tag color="success" icon={<CalendarOutlined />}>
                              Active
                            </Tag>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TeamOutlined style={{ color: `${COLORS.text}80`, fontSize: '14px' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {votersCount} voter{votersCount !== 1 ? 's' : ''} • {totalVotes} total votes
                            </Text>
                            {userVoted && userVoteChanges > 0 && (
                              <Tag color="warning" style={{ fontSize: '11px', padding: '0 6px' }}>
                                <ReloadOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
                                {userVoteChanges}/3 changes
                              </Tag>
                            )}
                          </div>
                        </Space>

                        <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }} size="middle">
                          {poll.options.map((option, idx) => {
                            const optionVotes = option.votes || 0;
                            const percentage = calculatePercentage(optionVotes, totalVotes);
                            const isUserVote = userVoted && userVoteIndex === idx;
                            
                            return (
                              <div key={idx}>
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '8px'
                                }}>
                                  <Space>
                                    <Text style={{ 
                                      color: isUserVote ? COLORS.secondary : COLORS.text,
                                      fontWeight: isUserVote ? 600 : 400
                                    }}>
                                      {option.text}
                                      {isUserVote && (
                                        <CheckCircleOutlined style={{ 
                                          marginLeft: '8px',
                                          color: COLORS.secondary,
                                          fontSize: '14px'
                                        }} />
                                      )}
                                    </Text>
                                  </Space>
                                  <Space>
                                    <BarChartOutlined style={{ 
                                      color: isUserVote ? COLORS.secondary : `${COLORS.text}80`,
                                      fontSize: '14px'
                                    }} />
                                    <Text style={{ 
                                      fontSize: '12px',
                                      color: isUserVote ? COLORS.secondary : `${COLORS.text}80`,
                                      fontWeight: 600
                                    }}>
                                      {percentage}% ({optionVotes})
                                    </Text>
                                  </Space>
                                </div>
                                <Progress
                                  percent={percentage}
                                  strokeColor={isUserVote ? COLORS.secondary : COLORS.action}
                                  trailColor={`${COLORS.secondary}20`}
                                  strokeWidth={8}
                                  showInfo={false}
                                  style={{ margin: 0 }}
                                />
                              </div>
                            );
                          })}
                        </Space>

                        <Divider style={{ margin: '16px 0', background: `${COLORS.secondary}20` }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space>
                            {userData && (
                              <Button
                                type={userVoted ? 'default' : 'primary'}
                                icon={userVoted ? <ReloadOutlined /> : <CheckSquareOutlined />}
                                onClick={() => handleOpenVoteDialog(poll)}
                                style={{
                                  background: userVoted ? 'transparent' : COLORS.action,
                                  borderColor: userVoted ? COLORS.secondary : COLORS.action,
                                  color: userVoted ? COLORS.secondary : COLORS.text
                                }}
                              >
                                {userVoted ? 'Change Vote' : 'Vote Now'}
                              </Button>
                            )}
                          </Space>

                          <Space>
                            {isAdmin && (
                              <>
                                <Tooltip title="Edit Poll">
                                  <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleOpenDialog(poll)}
                                    style={{ color: COLORS.secondary }}
                                  />
                                </Tooltip>
                                <Tooltip title="Finish Poll">
                                  <Button
                                    type="text"
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => handleFinishPoll(poll._id)}
                                    style={{ color: '#52c41a' }}
                                  />
                                </Tooltip>
                                <Popconfirm
                                  title="Delete Poll"
                                  description="Are you sure you want to delete this poll?"
                                  onConfirm={() => handleDelete(poll._id)}
                                  okText="Yes"
                                  cancelText="No"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Tooltip title="Delete Poll">
                                    <Button
                                      type="text"
                                      icon={<DeleteOutlined />}
                                      style={{ color: '#ff4d4f' }}
                                    />
                                  </Tooltip>
                                </Popconfirm>
                              </>
                            )}
                          </Space>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </Card>
          </Col>

          {/* Previous Polls - Right Column */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <HistoryOutlined style={{ color: COLORS.secondary }} />
                  <Text strong style={{ color: COLORS.text, fontSize: '18px' }}>
                    Previous Polls
                  </Text>
                  <Tag color={COLORS.action}>{finishedPolls.length}</Tag>
                </Space>
              }
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.secondary}30`,
                borderRadius: '16px',
                height: '100%'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              {finishedPolls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <HistoryOutlined style={{ 
                    fontSize: '48px', 
                    color: `${COLORS.text}30`,
                    marginBottom: '16px'
                  }} />
                  <Text type="secondary">No completed polls yet</Text>
                </div>
              ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {finishedPolls.map((poll) => {
                    const totalVotes = getTotalVotes(poll);
                    const votersCount = poll.voters ? poll.voters.length : 0;
                    const winningOption = poll.options.reduce((prev, current) => 
                      ((prev.votes || 0) > (current.votes || 0)) ? prev : current
                    );
                    
                    return (
                      <Card
                        key={poll._id}
                        style={{
                          border: `1px solid ${COLORS.secondary}30`,
                          borderRadius: '12px',
                          background: COLORS.surface
                        }}
                      >
                        <div style={{ padding: '16px' }}>
                          <Space style={{ width: '100%', marginBottom: '16px' }} direction="vertical" size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Title level={5} style={{ margin: 0, color: COLORS.text, flex: 1 }}>
                                {poll.question}
                              </Title>
                              {isAdmin && (
                                <Tooltip title="Reopen Poll">
                                  <Button
                                    type="text"
                                    icon={<ReloadOutlined />}
                                    onClick={() => handleReopenPoll(poll._id)}
                                    size="small"
                                    style={{ color: COLORS.secondary }}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </Space>

                          <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }} size="small">
                            {poll.options.map((option, idx) => {
                              const optionVotes = option.votes || 0;
                              const percentage = calculatePercentage(optionVotes, totalVotes);
                              const isWinner = option.text === winningOption.text;
                              
                              return (
                                <div key={idx}>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                  }}>
                                    <Space>
                                      <Text style={{ 
                                        color: isWinner ? COLORS.secondary : COLORS.text,
                                        fontWeight: isWinner ? 600 : 400,
                                        fontSize: '13px'
                                      }}>
                                        {option.text}
                                        {isWinner && (
                                          <CheckCircleOutlined style={{ 
                                            marginLeft: '6px',
                                            color: COLORS.secondary,
                                            fontSize: '12px'
                                          }} />
                                        )}
                                      </Text>
                                    </Space>
                                    <Text style={{ 
                                      fontSize: '11px',
                                      color: isWinner ? COLORS.secondary : `${COLORS.text}80`,
                                      fontWeight: 600
                                    }}>
                                      {percentage}% ({optionVotes})
                                    </Text>
                                  </div>
                                  <Progress
                                    percent={percentage}
                                    strokeColor={isWinner ? COLORS.secondary : COLORS.action}
                                    trailColor={`${COLORS.secondary}20`}
                                    strokeWidth={6}
                                    showInfo={false}
                                    style={{ margin: 0 }}
                                  />
                                </div>
                              );
                            })}
                          </Space>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            fontSize: '11px'
                          }}>
                            <Text type="secondary" style={{ fontStyle: 'italic' }}>
                              Ended: {new Date(poll.updatedAt).toLocaleDateString()}
                            </Text>
                            <Text type="secondary">
                              {votersCount} participants
                            </Text>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </Space>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Voting Modal */}
      <Modal
        title={
          <Space>
            <CheckSquareOutlined />
            <span>{selectedPoll && hasUserVoted(selectedPoll) ? 'Change Your Vote' : 'Cast Your Vote'}</span>
          </Space>
        }
        open={voteDialogOpen}
        onCancel={handleCloseVoteDialog}
        footer={[
          <Button key="cancel" onClick={handleCloseVoteDialog}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingVote}
            onClick={handleSubmitVote}
            disabled={selectedOption === null}
            style={{ background: COLORS.action, border: 'none' }}
          >
            {selectedPoll && hasUserVoted(selectedPoll) ? 'Change Vote' : 'Submit Vote'}
          </Button>
        ]}
        width={500}
      >
        {selectedPoll && (
          <>
            <div style={{ 
              background: `${COLORS.background}80`, 
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <Title level={5} style={{ margin: 0, color: COLORS.text }}>
                {selectedPoll.question}
              </Title>
            </div>

            {hasUserVoted(selectedPoll) && (
              <Alert
                type="warning"
                icon={<ExclamationCircleOutlined />}
                message="You have already voted"
                description={
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    You can change your vote up to 3 times. Changes used: {getUserVoteChanges(selectedPoll)}/3
                  </Text>
                }
                style={{ marginBottom: '16px' }}
              />
            )}

            <Radio.Group
              value={selectedOption}
              onChange={e => setSelectedOption(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {selectedPoll.options.map((option, index) => {
                  const optionVotes = option.votes || 0;
                  const totalVotes = getTotalVotes(selectedPoll);
                  const percentage = calculatePercentage(optionVotes, totalVotes);
                  const isCurrentVote = hasUserVoted(selectedPoll) && getUserVoteIndex(selectedPoll) === index;

                  return (
                    <Radio
                      key={index}
                      value={index}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1px solid ${isCurrentVote ? COLORS.secondary : `${COLORS.secondary}30`}`,
                        background: isCurrentVote ? `${COLORS.secondary}10` : 'transparent'
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                          <Text strong style={{ color: COLORS.text }}>
                            {option.text}
                            {isCurrentVote && (
                              <CheckCircleOutlined style={{ 
                                marginLeft: '8px',
                                color: COLORS.secondary
                              }} />
                            )}
                          </Text>
                        </Space>
                        <Space>
                          <BarChartOutlined style={{ fontSize: '12px', color: `${COLORS.text}80` }} />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {optionVotes} vote{optionVotes !== 1 ? 's' : ''} ({percentage}%)
                          </Text>
                        </Space>
                      </Space>
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>

            <Alert
              type="info"
              message="Your vote is anonymous"
              description={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {hasUserVoted(selectedPoll)
                    ? `You can change your vote ${3 - getUserVoteChanges(selectedPoll)} more time(s).`
                    : 'Once submitted, you can change it up to 3 times.'
                  }
                </Text>
              }
              style={{ marginTop: '16px' }}
            />
          </>
        )}
      </Modal>

      {/* Create/Edit Poll Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>{editingPoll ? 'Edit Poll' : 'Create New Poll'}</span>
          </Space>
        }
        open={dialogOpen}
        onCancel={handleCloseDialog}
        footer={null}
        width={600}
      >
        <div style={{ padding: '8px 0' }}>
          <Input
            placeholder="Poll Question"
            value={formData.question}
            onChange={(e) => handleFormChange(e)}
            name="question"
            style={{ 
              marginBottom: '16px'
            }}
            size="large"
          />

          <Title level={5} style={{ color: COLORS.text, marginBottom: '12px' }}>
            Poll Options *
          </Title>

          {formData.options.map((option, index) => (
            <Space key={index} style={{ width: '100%', marginBottom: '12px' }}>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleFormChange(e, index)}
                name="options"
                style={{ flex: 1 }}
              />
              {formData.options.length > 2 && (
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => removeOption(index)}
                  size="small"
                />
              )}
            </Space>
          ))}

          <Button
            type="dashed"
            onClick={addOption}
            block
            icon={<PlusOutlined />}
            style={{
              marginBottom: '16px'
            }}
          >
            Add Another Option
          </Button>

          <Input
            type="date"
            placeholder="End Date (Optional)"
            value={formData.endDate}
            onChange={(e) => handleFormChange(e)}
            name="endDate"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ background: COLORS.action, border: 'none' }}
            >
              {editingPoll ? 'Update Poll' : 'Create Poll'}
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}