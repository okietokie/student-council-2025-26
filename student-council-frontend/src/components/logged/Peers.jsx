import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Avatar,
  Tag,
  Table,
  Tabs,
  Badge,
  Alert,
  Modal,
  message,
  Row,
  Col,
  Space,
  Divider,
  Tooltip,
  Dropdown,
  Menu,
  Spin,
  Statistic,
  Grid,
  List,
  Drawer
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  WarningOutlined,
  ReadOutlined ,
  SecurityScanOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  DeleteOutlined,
  SafetyOutlined,
  UserDeleteOutlined,
  KeyOutlined,
  StarOutlined,
  StarFilled,
  MoreOutlined,
  GroupOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  MobileOutlined,
  TabletOutlined,
  DesktopOutlined
} from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

// Custom palette from your criteria
const palette = {
  mainBg: '#12181B',
  surface: '#1E262C',
  secondary: '#2D93AD',
  text: '#F4D8CD',
  action: '#F15152'
};

export default function Peers() {
  const [activeTab, setActiveTab] = useState('pending');
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [mobileActionUser, setMobileActionUser] = useState(null);
  
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // Responsive settings
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;
  const isDesktop = screens.lg;

  // Check authorization
  const isChairPerson = userData?.councilPosition === 'CHAIRPERSON' || userData?.councilPosition === 'CHAIRMAN';
  const canMakeAdmin = userData?.role === 'STUDENT_COUNCIL' && isChairPerson;
  const canRemovePeer = userData?.admin;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user || user.role !== "STUDENT_COUNCIL") {
      navigate('/logged-in/403');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchPeers();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get('/user/get-user-data');
      setUserData(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchPeers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/user/get-peers');
      setPeers(response.data.peers || []);
    } catch (error) {
      console.error('Failed to fetch peers:', error);
      setError('Failed to fetch peers. Please try again.');
      message.error('Failed to fetch peers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const showModal = (user, action) => {
    let title = '';
    let content = '';
    let icon = null;
    
    switch(action) {
      case 'approve':
        title = 'Approve User';
        content = `Are you sure you want to approve ${user.name}?`;
        icon = <CheckCircleOutlined style={{ color: palette.secondary }} />;
        break;
      case 'reject':
        title = 'Reject User Request';
        content = `Are you sure you want to reject ${user.name}'s request?`;
        icon = <CloseCircleOutlined style={{ color: palette.action }} />;
        break;
      case 'remove':
        title = 'Remove User';
        content = `Are you sure you want to remove ${user.name} from the system? This action cannot be undone.`;
        icon = <DeleteOutlined style={{ color: palette.action }} />;
        break;
      case 'make-admin':
        title = 'Make Admin';
        content = `Are you sure you want to give admin privileges to ${user.name}?`;
        icon = <StarOutlined style={{ color: palette.secondary }} />;
        break;
      case 'remove-admin':
        title = 'Remove Admin';
        content = `Are you sure you want to remove admin privileges from ${user.name}?`;
        icon = <KeyOutlined style={{ color: palette.action }} />;
        break;
    }
    
    setModalConfig({ 
      visible: true, 
      user, 
      action, 
      title, 
      content, 
      icon 
    });
  };

  const handleAction = async () => {
    if (!modalConfig.user) return;
    
    setActionLoading(true);
    try {
      let response;
      
      switch(modalConfig.action) {
        case 'approve':
          response = await axiosClient.post(`/admin/approve-user/${modalConfig.user._id}`);
          message.success(`Approved ${modalConfig.user.name} successfully!`);
          break;
        case 'reject':
          response = await axiosClient.post(`/admin/reject-user/${modalConfig.user._id}`);
          message.success(`Rejected ${modalConfig.user.name}'s request`);
          break;
        case 'remove':
          response = await axiosClient.delete(`/admin/remove/${modalConfig.user._id}`);
          message.success(`Removed ${modalConfig.user.name} from the system`);
          break;
        case 'make-admin':
          response = await axiosClient.patch(`/admin/make-admin/${modalConfig.user._id}`);
          message.success(`Made ${modalConfig.user.name} an admin`);
          break;
        case 'remove-admin':
          response = await axiosClient.patch(`/admin/remove-admin/${modalConfig.user._id}`);
          message.success(`Removed admin privileges from ${modalConfig.user.name}`);
          break;
      }

      // Update local state
      if (modalConfig.action === 'remove') {
        setPeers(prevPeers => prevPeers.filter(user => user._id !== modalConfig.user._id));
      } else {
        setPeers(prevPeers => 
          prevPeers.map(user => {
            if (user._id === modalConfig.user._id) {
              const updatedUser = { ...user };
              switch(modalConfig.action) {
                case 'approve':
                  updatedUser.approvalStatus = 'APPROVED';
                  updatedUser.approvedBy = userData?._id;
                  break;
                case 'reject':
                  updatedUser.approvalStatus = 'REJECTED';
                  updatedUser.approvedBy = userData?._id;
                  break;
                case 'make-admin':
                  updatedUser.admin = true;
                  break;
                case 'remove-admin':
                  updatedUser.admin = false;
                  break;
              }
              return updatedUser;
            }
            return user;
          })
        );
      }
      
      setModalConfig({ ...modalConfig, visible: false });
    } catch (error) {
      message.error(error.response?.data?.message || `Failed to ${modalConfig.action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  const canApproveReject = (user) => {
    if (!userData) return false;
    if (userData.admin) return true;
    
    if (
      userData.role === 'STUDENT_COUNCIL' && 
      userData.councilPosition === 'CLASS_REP' &&
      user.className === userData.className &&
      user.role !== 'STUDENT_COUNCIL'
    ) {
      return true;
    }

    if (userData.role === "STUDENT_COUNCIL" && userData.councilPosition !== "CLASS_REP"){
      return true;
    }
    return false;
  };

  const canManageUser = (user) => {
    if (user._id === userData?._id) return false;
    return true;
  };

  // Filter peers
  const pendingPeers = peers.filter(user => user.approvalStatus === 'PENDING');
  const approvedPeers = peers.filter(user => user.approvalStatus === 'APPROVED');
  const rejectedPeers = peers.filter(user => user.approvalStatus === 'REJECTED');
  const adminPeers = peers.filter(user => user?.admin);

  // Responsive table columns
  const getTableColumns = () => {
    const baseColumns = [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        width: isMobile ? 150 : 200,
        render: (text, record) => (
          <Space direction={isMobile ? "vertical" : "horizontal"} align={isMobile ? "start" : "center"}>
            <Avatar
              size={isMobile ? 40 : 48}
              style={{
                backgroundColor: getAvatarColor(record),
                color: palette.text,
                fontWeight: 'bold',
                boxShadow: `0 2px 8px rgba(0,0,0,0.3)`
              }}
            >
              {getUserInitials(record.name)}
            </Avatar>
            <div>
              <Text 
                strong 
                style={{ 
                  color: palette.text,
                  fontSize: isMobile ? '14px' : '16px'
                }}
                ellipsis={{ tooltip: text }}
              >
                {text}
              </Text>
              <br />
              <Text 
                type="secondary" 
                style={{ 
                  color: `${palette.text}99`,
                  fontSize: isMobile ? '12px' : '14px'
                }}
                ellipsis={{ tooltip: record.email }}
              >
                {record.email}
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: 'Class',
        dataIndex: 'className',
        key: 'className',
        responsive: ['md'],
        width: 120,
        render: (text) => (
          <Tag 
            color={palette.secondary} 
            style={{ 
              borderRadius: '4px',
              fontWeight: 600,
              border: 'none',
              margin: isMobile ? '2px 0' : '0'
            }}
          >
            {text || 'No Class'}
          </Tag>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        responsive: ['sm'],
        width: 140,
        render: (_, record) => renderUserRoleTag(record),
      },
      {
        title: 'Status',
        dataIndex: 'approvalStatus',
        key: 'approvalStatus',
        width: 120,
        render: (_, record) => renderApprovalStatusTag(record),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: isMobile ? 80 : 150,
        fixed: isMobile ? 'right' : false,
        render: (_, record) => renderActionButtons(record),
      },
    ];

    return baseColumns;
  };

  const getUserInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (user) => {
    if (user?.admin) return palette.action;
    if (user?.approvalStatus === 'PENDING') return '#faad14';
    if (user?.approvalStatus === 'APPROVED') return '#52c41a';
    if (user?.approvalStatus === 'REJECTED') return '#ff4d4f';
    return palette.secondary;
  };

  const renderUserRoleTag = (user) => {
    const getRoleConfig = () => {
      if (user.role === 'STUDENT_COUNCIL') {
        if (user.councilPosition === 'CLASS_REP') return { label: 'Class Rep', color: 'blue', icon: <ReadOutlined  /> };
        if (user.councilPosition === 'CHAIRMAN') return { label: 'Chairman', color: 'cyan', icon: <SecurityScanOutlined /> };
        if (user.councilPosition === 'SPORTS_SECRETARY') return { label: 'Sports Secretary', color: 'green', icon: <UserOutlined /> };
        if (user.councilPosition === 'ARTS_SECRETARY') return { label: 'Arts Secretary', color: 'orange', icon: <UserOutlined /> };
        return { label: 'CHAIRPERSON', color: 'cyan', icon: <SecurityScanOutlined /> };
      }
      return { label: 'Student', color: 'default', icon: <UserOutlined /> };
    };

    const config = getRoleConfig();
    return (
      <Tag
        color={config.color}
        icon={isMobile ? null : config.icon}
        style={{ 
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: isMobile ? '11px' : '12px',
          padding: isMobile ? '2px 6px' : '4px 8px',
          margin: '2px',
          boxShadow: `0 1px 3px rgba(0,0,0,0.2)`
        }}
      >
        {isMobile ? config.label.charAt(0) : config.label}
      </Tag>
    );
  };

  const renderApprovalStatusTag = (user) => {
    const getStatusConfig = () => {
      switch (user.approvalStatus) {
        case 'PENDING':
          return { label: 'Pending', color: 'warning', icon: <ClockCircleOutlined /> };
        case 'APPROVED':
          return { label: 'Approved', color: 'success', icon: <SafetyCertificateOutlined /> };
        case 'REJECTED':
          return { label: 'Rejected', color: 'error', icon: <StopOutlined /> };
        default:
          return { label: 'Unknown', color: 'default', icon: <InfoCircleOutlined /> };
      }
    };

    const config = getStatusConfig();
    return (
      <Tag
        color={config.color}
        icon={isMobile ? null : config.icon}
        style={{ 
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: isMobile ? '11px' : '12px',
          padding: isMobile ? '2px 6px' : '4px 8px',
          margin: '2px',
          boxShadow: `0 1px 3px rgba(0,0,0,0.2)`
        }}
      >
        {isMobile ? config.label.charAt(0) : config.label}
      </Tag>
    );
  };

  const renderActionButtons = (user) => {
    const actionItems = [];
    
    if (user.approvalStatus === 'PENDING' && canApproveReject(user) && canManageUser(user)) {
      actionItems.push(
        {
          key: 'approve',
          label: 'Approve',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          onClick: () => showModal(user, 'approve')
        },
        {
          key: 'reject',
          label: 'Reject',
          icon: <CloseCircleOutlined style={{ color: palette.action }} />,
          onClick: () => showModal(user, 'reject')
        }
      );
    }
    
    if (canMakeAdmin && !user.admin && canManageUser(user)) {
      actionItems.push({
        key: 'make-admin',
        label: 'Make Admin',
        icon: <StarOutlined style={{ color: '#faad14' }} />,
        onClick: () => showModal(user, 'make-admin')
      });
    }
    
    if (canMakeAdmin && user.admin && canManageUser(user)) {
      actionItems.push({
        key: 'remove-admin',
        label: 'Remove Admin',
        icon: <KeyOutlined style={{ color: palette.action }} />,
        onClick: () => showModal(user, 'remove-admin')
      });
    }
    
    if (canRemovePeer && canManageUser(user)) {
      actionItems.push({
        key: 'remove',
        label: 'Remove User',
        icon: <DeleteOutlined style={{ color: palette.action }} />,
        danger: true,
        onClick: () => showModal(user, 'remove')
      });
    }

    if (actionItems.length === 0) {
      return <Text type="secondary" style={{ fontSize: '12px' }}>No actions</Text>;
    }

    // On mobile, show a menu button that opens actions in a drawer
    if (isMobile) {
      return (
        <Button
          type="text"
          icon={<MoreOutlined />}
          size="small"
          onClick={() => {
            setMobileActionUser(user);
            setMobileDrawerVisible(true);
          }}
          style={{
            color: palette.text,
            padding: '4px'
          }}
        />
      );
    }

    // On tablet/desktop, show buttons or dropdown
    if (actionItems.length <= 2 || isTablet) {
      return (
        <Space wrap size={isTablet ? 4 : 8}>
          {actionItems.map(item => (
            <Tooltip key={item.key} title={item.label}>
              <Button
                type={item.key.includes('remove') || item.key === 'reject' ? 'default' : 'primary'}
                danger={item.key.includes('remove') || item.key === 'reject'}
                icon={item.icon}
                onClick={item.onClick}
                size="small"
                style={{
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: isTablet ? '11px' : '12px',
                  padding: isTablet ? '4px 6px' : '6px 8px',
                  minWidth: isTablet ? 'auto' : '80px',
                  height: 'auto',
                  boxShadow: `0 2px 4px rgba(0,0,0,0.3)`
                }}
              >
                {isTablet ? null : item.label}
              </Button>
            </Tooltip>
          ))}
        </Space>
      );
    }

    // Desktop with many actions - use dropdown
    return (
      <Dropdown
        menu={{
          items: actionItems
        }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button
          icon={<MoreOutlined />}
          size="small"
          style={{
            borderRadius: '4px',
            fontWeight: 600,
            padding: '6px 12px',
            boxShadow: `0 2px 4px rgba(0,0,0,0.3)`
          }}
        >
          Actions
        </Button>
      </Dropdown>
    );
  };

  const renderUserCard = (user) => {
    return (
      <Card
        key={user._id}
        style={{
          marginBottom: '12px',
          backgroundColor: palette.surface,
          borderRadius: '8px',
          border: `1px solid ${palette.secondary}33`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Avatar
                size={48}
                style={{
                  backgroundColor: getAvatarColor(user),
                  color: palette.text,
                  fontWeight: 'bold',
                  boxShadow: `0 2px 6px rgba(0,0,0,0.3)`
                }}
              >
                {getUserInitials(user.name)}
              </Avatar>
              <div>
                <Text strong style={{ color: palette.text, fontSize: '16px' }}>
                  {user.name}
                </Text>
                <br />
                <Text type="secondary" style={{ color: `${palette.text}99`, fontSize: '14px' }}>
                  {user.email}
                </Text>
              </div>
            </Space>
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={() => {
                setMobileActionUser(user);
                setMobileDrawerVisible(true);
              }}
            />
          </Space>
          
          <Space wrap style={{ marginTop: '8px' }}>
            <Tag 
              color={palette.secondary} 
              style={{ 
                borderRadius: '4px',
                fontWeight: 600,
                border: 'none',
                margin: '2px'
              }}
            >
              {user.className || 'No Class'}
            </Tag>
            {renderUserRoleTag(user)}
            {renderApprovalStatusTag(user)}
            {user.admin && (
              <Tag
                color="error"
                icon={<SecurityScanOutlined />}
                style={{ 
                  borderRadius: '4px',
                  fontWeight: 600,
                  margin: '2px'
                }}
              >
                Admin
              </Tag>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  const renderTabContent = (peersList, emptyMessage) => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (peersList.length === 0) {
      return (
        <Alert
          message={emptyMessage}
          description="No data available"
          type="info"
          showIcon
          style={{ 
            borderRadius: '8px',
            margin: '20px 0'
          }}
        />
      );
    }

    return (
      <div style={{ padding: isMobile ? '12px 0' : '20px 0' }}>
        {isMobile ? (
          <div>
            {peersList.map(user => renderUserCard(user))}
          </div>
        ) : (
          <Table
            columns={getTableColumns()}
            dataSource={peersList}
            rowKey="_id"
            pagination={{
              pageSize: isMobile ? 5 : isTablet ? 8 : 10,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              showTotal: (total) => `Total ${total} items`,
              simple: isMobile,
              size: isMobile ? 'small' : 'default'
            }}
            scroll={isMobile ? { x: 500 } : {}}
            size={isTablet ? 'middle' : 'default'}
            style={{
              backgroundColor: 'transparent',
              borderRadius: '8px'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: isMobile ? '16px' : '24px 20px',
      minHeight: '100vh',
      backgroundColor: palette.mainBg,
      color: palette.text
    }}>
      {/* Container for max width with responsive padding */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 8px' : '0 16px'
      }}>
        {/* Header Card - Responsive */}
        <Card
          style={{
            marginBottom: isMobile ? '24px' : '32px',
            background: `linear-gradient(135deg, ${palette.secondary} 0%, #1a6d7f 100%)`,
            borderRadius: '12px',
            border: 'none',
            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
            color: palette.text
          }}
          bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
        >
          <Space direction={isMobile ? "vertical" : "horizontal"} align={isMobile ? "start" : "center"} style={{ width: '100%' }}>
            <TeamOutlined style={{ 
              fontSize: isMobile ? '32px' : isTablet ? '40px' : '48px', 
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' 
            }} />
            <div style={{ flex: 1 }}>
              <Title 
                level={isMobile ? 4 : isTablet ? 3 : 2} 
                style={{ 
                  margin: 0, 
                  color: palette.text,
                  lineHeight: 1.2 
                }}
              >
                Student Management
              </Title>
              <Text style={{ 
                opacity: 0.9, 
                fontSize: isMobile ? '14px' : '16px',
                display: 'block',
                marginTop: '4px'
              }}>
                {userData?.councilPosition === 'CLASS_REP' 
                  ? `Manage students in ${userData?.className}`
                  : userData?.admin 
                    ? 'Manage all students'
                    : 'View your peers'}
              </Text>
            </div>
            {isMobile && (
              <div style={{ alignSelf: 'flex-end' }}>
                <MobileOutlined style={{ opacity: 0.7 }} />
              </div>
            )}
          </Space>
        </Card>

        {/* Tabs Section - Responsive */}
        <Card
          style={{
            marginBottom: isMobile ? '24px' : '32px',
            backgroundColor: palette.surface,
            borderRadius: '12px',
            border: `1px solid ${palette.secondary}33`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.2)`
          }}
          bodyStyle={{ padding: isMobile ? '12px 8px' : 0 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            style={{ padding: 0 }}
            tabBarStyle={{ 
              margin: 0,
              padding: isMobile ? '0 4px' : '0 16px'
            }}
            size={isMobile ? "small" : "default"}
            tabPosition={isMobile ? "top" : "top"}
            type={isMobile ? "card" : "line"}
            centered={isMobile}
          >
            <TabPane
              tab={
                <Badge 
                  count={pendingPeers.length} 
                  size="small" 
                  style={{ backgroundColor: palette.action }}
                  offset={isMobile ? [0, -5] : [10, 0]}
                >
                  <Space size={isMobile ? 4 : 8}>
                    <UserAddOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
                    {!isMobile && <span>Pending</span>}
                    {isMobile && <span>Pending ({pendingPeers.length})</span>}
                  </Space>
                </Badge>
              }
              key="pending"
            >
              {renderTabContent(pendingPeers, "No Pending Requests")}
            </TabPane>

            <TabPane
              tab={
                <Badge 
                  count={approvedPeers.length} 
                  size="small" 
                  style={{ backgroundColor: '#52c41a' }}
                  offset={isMobile ? [0, -5] : [10, 0]}
                >
                  <Space size={isMobile ? 4 : 8}>
                    <CheckCircleOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
                    {!isMobile && <span>Approved</span>}
                    {isMobile && <span>Approved ({approvedPeers.length})</span>}
                  </Space>
                </Badge>
              }
              key="approved"
            >
              {renderTabContent(approvedPeers, "No Approved Peers")}
            </TabPane>

            <TabPane
              tab={
                <Badge 
                  count={rejectedPeers.length} 
                  size="small" 
                  style={{ backgroundColor: palette.action }}
                  offset={isMobile ? [0, -5] : [10, 0]}
                >
                  <Space size={isMobile ? 4 : 8}>
                    <CloseCircleOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
                    {!isMobile && <span>Rejected</span>}
                    {isMobile && <span>Rejected ({rejectedPeers.length})</span>}
                  </Space>
                </Badge>
              }
              key="rejected"
            >
              {renderTabContent(rejectedPeers, "No Rejected Peers")}
            </TabPane>

            <TabPane
              tab={
                <Badge 
                  count={adminPeers.length} 
                  size="small" 
                  style={{ backgroundColor: '#faad14' }}
                  offset={isMobile ? [0, -5] : [10, 0]}
                >
                  <Space size={isMobile ? 4 : 8}>
                    <SecurityScanOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
                    {!isMobile && <span>Admins</span>}
                    {isMobile && <span>Admins ({adminPeers.length})</span>}
                  </Space>
                </Badge>
              }
              key="admins"
            >
              {renderTabContent(adminPeers, "No Admins")}
            </TabPane>

            <TabPane
              tab={
                <Badge 
                  count={peers.length} 
                  size="small" 
                  style={{ backgroundColor: palette.secondary }}
                  offset={isMobile ? [0, -5] : [10, 0]}
                >
                  <Space size={isMobile ? 4 : 8}>
                    <GroupOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
                    {!isMobile && <span>All</span>}
                    {isMobile && <span>All ({peers.length})</span>}
                  </Space>
                </Badge>
              }
              key="all"
            >
              {renderTabContent(peers, "No Peers")}
            </TabPane>
          </Tabs>
        </Card>

        {/* Stats Row - Responsive */}
        <Row 
          gutter={isMobile ? [8, 8] : [16, 16]} 
          style={{ marginBottom: isMobile ? '24px' : '32px' }}
        >
          <Col xs={12} sm={12} md={6}>
            <Card
              style={{
                backgroundColor: palette.surface,
                borderRadius: '8px',
                border: 'none',
                height: '100%',
                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
              }}
              bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            >
              <Statistic
                title="Total"
                value={peers.length}
                prefix={<GroupOutlined />}
                valueStyle={{ 
                  color: palette.text,
                  fontSize: isMobile ? '20px' : '24px'
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card
              style={{
                backgroundColor: palette.surface,
                borderRadius: '8px',
                border: 'none',
                height: '100%',
                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
              }}
              bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            >
              <Statistic
                title="Pending"
                value={pendingPeers.length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ 
                  color: '#faad14',
                  fontSize: isMobile ? '20px' : '24px'
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card
              style={{
                backgroundColor: palette.surface,
                borderRadius: '8px',
                border: 'none',
                height: '100%',
                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
              }}
              bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            >
              <Statistic
                title="Approved"
                value={approvedPeers.length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ 
                  color: '#52c41a',
                  fontSize: isMobile ? '20px' : '24px'
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card
              style={{
                backgroundColor: palette.surface,
                borderRadius: '8px',
                border: 'none',
                height: '100%',
                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
              }}
              bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            >
              <Statistic
                title="Admins"
                value={adminPeers.length}
                prefix={<SecurityScanOutlined />}
                valueStyle={{ 
                  color: palette.action,
                  fontSize: isMobile ? '20px' : '24px'
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Mobile Actions Drawer */}
      <Drawer
        title="User Actions"
        placement="bottom"
        open={mobileDrawerVisible}
        onClose={() => setMobileDrawerVisible(false)}
        height="auto"
        style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        headerStyle={{
          backgroundColor: palette.surface,
          borderBottom: `1px solid ${palette.secondary}33`,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}
        bodyStyle={{
          backgroundColor: palette.mainBg,
          padding: '0'
        }}
      >
        {mobileActionUser && (
          <div style={{ padding: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space align="center" style={{ width: '100%', marginBottom: '16px' }}>
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: getAvatarColor(mobileActionUser),
                    color: palette.text,
                    fontWeight: 'bold'
                  }}
                >
                  {getUserInitials(mobileActionUser.name)}
                </Avatar>
                <div>
                  <Text strong style={{ color: palette.text, fontSize: '16px' }}>
                    {mobileActionUser.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ color: `${palette.text}99`, fontSize: '14px' }}>
                    {mobileActionUser.email}
                  </Text>
                </div>
              </Space>
              
              <Space direction="vertical" style={{ width: '100%', gap: '8px' }}>
                {mobileActionUser.approvalStatus === 'PENDING' && canApproveReject(mobileActionUser) && canManageUser(mobileActionUser) && (
                  <>
                    <Button
                      block
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        showModal(mobileActionUser, 'approve');
                        setMobileDrawerVisible(false);
                      }}
                      style={{
                        height: '48px',
                        borderRadius: '8px',
                        fontWeight: 600
                      }}
                    >
                      Approve User
                    </Button>
                    <Button
                      block
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        showModal(mobileActionUser, 'reject');
                        setMobileDrawerVisible(false);
                      }}
                      style={{
                        height: '48px',
                        borderRadius: '8px',
                        fontWeight: 600
                      }}
                    >
                      Reject Request
                    </Button>
                  </>
                )}
                
                {canMakeAdmin && !mobileActionUser.admin && canManageUser(mobileActionUser) && (
                  <Button
                    block
                    type="primary"
                    icon={<StarOutlined />}
                    onClick={() => {
                      showModal(mobileActionUser, 'make-admin');
                      setMobileDrawerVisible(false);
                    }}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      backgroundColor: '#faad14',
                      borderColor: '#faad14'
                    }}
                  >
                    Make Admin
                  </Button>
                )}
                
                {canMakeAdmin && mobileActionUser.admin && canManageUser(mobileActionUser) && (
                  <Button
                    block
                    danger
                    icon={<KeyOutlined />}
                    onClick={() => {
                      showModal(mobileActionUser, 'remove-admin');
                      setMobileDrawerVisible(false);
                    }}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    Remove Admin
                  </Button>
                )}
                
                {canRemovePeer && canManageUser(mobileActionUser) && (
                  <Button
                    block
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      showModal(mobileActionUser, 'remove');
                      setMobileDrawerVisible(false);
                    }}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    Remove User
                  </Button>
                )}
                
                <Button
                  block
                  onClick={() => setMobileDrawerVisible(false)}
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    marginTop: '8px'
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Space>
          </div>
        )}
      </Drawer>

      {/* Action Modal */}
      <Modal
        title={
          <Space>
            {modalConfig.icon}
            <span style={{ color: palette.text }}>{modalConfig.title}</span>
          </Space>
        }
        open={modalConfig.visible}
        onOk={handleAction}
        onCancel={() => setModalConfig({ ...modalConfig, visible: false })}
        confirmLoading={actionLoading}
        okText={actionLoading ? 'Processing...' : 
                modalConfig.action === 'approve' ? 'Approve' :
                modalConfig.action === 'reject' ? 'Reject' :
                modalConfig.action === 'remove' ? 'Remove' :
                modalConfig.action === 'make-admin' ? 'Make Admin' :
                modalConfig.action === 'remove-admin' ? 'Remove Admin' : 'Confirm'}
        cancelText="Cancel"
        okButtonProps={{
          danger: modalConfig.action === 'remove' || modalConfig.action === 'reject' || modalConfig.action === 'remove-admin',
          type: 'primary',
          style: {
            backgroundColor: modalConfig.action === 'remove' || modalConfig.action === 'reject' || modalConfig.action === 'remove-admin' 
              ? palette.action 
              : modalConfig.action === 'make-admin' 
                ? '#faad14' 
                : '#52c41a',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            height: isMobile ? '44px' : '40px',
            fontSize: isMobile ? '16px' : '14px'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '6px',
            fontWeight: 600,
            height: isMobile ? '44px' : '40px',
            fontSize: isMobile ? '16px' : '14px'
          }
        }}
        width={isMobile ? '90vw' : 500}
        style={{ top: isMobile ? '50%' : '20%', transform: isMobile ? 'translateY(-50%)' : 'none' }}
        bodyStyle={{
          backgroundColor: palette.surface,
          color: palette.text,
          padding: isMobile ? '20px' : '24px',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}
        headerStyle={{
          backgroundColor: modalConfig.action === 'remove' || modalConfig.action === 'reject' || modalConfig.action === 'remove-admin' 
            ? palette.action 
            : modalConfig.action === 'make-admin' 
              ? '#faad14' 
              : palette.secondary,
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          padding: isMobile ? '16px 20px' : '20px 24px'
        }}
        footerStyle={{
          backgroundColor: palette.surface,
          borderTop: `1px solid ${palette.secondary}33`,
          padding: isMobile ? '16px 20px' : '20px 24px'
        }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        {modalConfig.user && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space direction={isMobile ? "vertical" : "horizontal"} align={isMobile ? "start" : "center"} style={{ width: '100%' }}>
              <Avatar
                size={isMobile ? 60 : 50}
                style={{
                  backgroundColor: getAvatarColor(modalConfig.user),
                  color: palette.text,
                  fontWeight: 'bold',
                  boxShadow: `0 4px 8px rgba(0,0,0,0.3)`
                }}
              >
                {getUserInitials(modalConfig.user.name)}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: isMobile ? '18px' : '16px', color: palette.text }}>
                  {modalConfig.user.name}
                </Text>
                <br />
                <Text type="secondary" style={{ 
                  color: `${palette.text}99`,
                  fontSize: isMobile ? '14px' : '13px',
                  wordBreak: 'break-all'
                }}>
                  {modalConfig.user.email}
                </Text>
              </div>
            </Space>
            
            <Divider style={{ margin: isMobile ? '16px 0' : '20px 0', borderColor: `${palette.secondary}33` }} />
            
            <Paragraph style={{ 
              color: palette.text,
              fontSize: isMobile ? '16px' : '14px',
              marginBottom: isMobile ? '16px' : '20px'
            }}>
              {modalConfig.content}
            </Paragraph>
            
            {(modalConfig.action === 'remove' || modalConfig.action === 'remove-admin') && (
              <Alert
                message="Warning"
                description="This action cannot be undone!"
                type="error"
                showIcon
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 79, 0.1)',
                  border: '1px solid rgba(255, 77, 79, 0.3)'
                }}
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
}