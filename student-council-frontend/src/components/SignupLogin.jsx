import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Form, 
  Input, 
  Radio, 
  Select, 
  Space, 
  Alert,
  Divider,
  Row,
  Col,
  Spin,
  Tabs
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  TeamOutlined,
  BookOutlined,
  UserAddOutlined,
  LoginOutlined,
  SafetyOutlined,
  HomeFilled
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { COLORS } from "../utils/colors.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Content } = Layout;

export default function SignupLogin() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classes, setClasses] = useState([]);
  const [messages, setMessages] = useState({
    login: { text: "", type: "" },
    signup: { text: "", type: "" }
  });
  const navigate = useNavigate();
  
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  const councilPositions = [
    { value: "CHAIRMAN", label: "Chairman" },
    { value: "CHAIRPERSON", label: "Chairperson" },
    { value: "CLASS_REP", label: "Class Representative" },
    { value: "SPORTS_SECRETARY", label: "Sports Secretary" },
    { value: "ARTS_SECRETARY", label: "Arts Secretary" },
  ];

  // Fetch classes when signup tab is active
  React.useEffect(() => {
    if (activeTab === "signup") {
      fetchClasses();
    }
  }, [activeTab]);

  const fetchClasses = async () => {
    if (classes.length > 0) return; // Already loaded
    
    try {
      const response = await axiosClient.get('/classes');
      
      if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else if (response.data && Array.isArray(response.data.classes)) {
        setClasses(response.data.classes);
      } else if (response.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      } else {
        setClasses([
          { _id: "1", className: "BSC CS - Year 1" },
          { _id: "2", className: "BSC CS - Year 2" },
          { _id: "3", className: "BSC CS - Year 3" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([
        { _id: "1", className: "BSC CS - Year 1" },
        { _id: "2", className: "BSC CS - Year 2" },
        { _id: "3", className: "BSC CS - Year 3" },
      ]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const onLoginFinish = async (values) => {
    setLoginLoading(true);
    setMessages(prev => ({ ...prev, login: { text: "", type: "" } }));

    try {
      const res = await axiosClient.post("/auth/login", values);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        if (res.data?.success) {
          navigate('/logged-in/home');
        }
      }
      
      setMessages(prev => ({ 
        ...prev, 
        login: { text: res.data?.message || 'Login successful', type: 'success' } 
      }));
    } catch (err) {
      setMessages(prev => ({ 
        ...prev, 
        login: { text: err.response?.data?.message || "Login failed", type: 'error' } 
      }));
    } finally {
      setLoginLoading(false);
    }
  };

  const onSignupFinish = async (values) => {
    setSignupLoading(true);
    setMessages(prev => ({ ...prev, signup: { text: "", type: "" } }));

    try {
      const submitData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        className: values.className || ""
      };

      if (values.role === "STUDENT_COUNCIL" && values.councilPosition) {
        submitData.councilPosition = values.councilPosition;
      } else {
        submitData.councilPosition = null;
      }

      const response = await axiosClient.post(`/auth/register`, submitData);

      setMessages(prev => ({ 
        ...prev, 
        signup: { 
          text: "Account created successfully! Your account is pending approval.", 
          type: "success" 
        } 
      }));

      signupForm.resetFields();
      
      // Auto-switch to login tab after successful signup
      setTimeout(() => {
        setActiveTab("login");
        // Pre-fill email in login form
        loginForm.setFieldsValue({ email: values.email });
      }, 2000);

    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        signup: { 
          text: error.response?.data?.message || error.message || "Signup failed.", 
          type: "error" 
        } 
      }));
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: COLORS.background
    }}>
      <Content style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '480px'
        }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <Title level={2} style={{ 
              marginBottom: '8px',
              color: COLORS.text,
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}>
              Student Portal
            </Title>
            <Text style={{ 
              color: `${COLORS.text}80`,
              fontSize: '16px'
            }}>
              Access your account or join the platform
            </Text>
          </div>

          <Card
            style={{
              borderRadius: '12px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.secondary}20`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            bodyStyle={{ 
              padding: '40px'
            }}
          >
            <Button
                onClick={() => navigate('/')}
            >
                <HomeFilled />
            </Button>
            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              style={{ marginBottom: '32px' }}
              tabBarStyle={{ borderBottom: `1px solid ${COLORS.secondary}20` }}
            >
              <TabPane 
                tab={
                  <Space>
                    <LoginOutlined />
                    <span style={{ fontWeight: 500 }}>Sign In</span>
                  </Space>
                } 
                key="login"
              />
              <TabPane 
                tab={
                  <Space>
                    <UserAddOutlined />
                    <span style={{ fontWeight: 500 }}>Sign Up</span>
                  </Space>
                } 
                key="signup"
              />
            </Tabs>

            {/* Login Form */}
            {activeTab === "login" && (
              <Form
                form={loginForm}
                name="login"
                onFinish={onLoginFinish}
                layout="vertical"
                size="large"
              >
                {messages.login.text && (
                  <Alert
                    message={messages.login.text}
                    type={messages.login.type}
                    showIcon
                    style={{
                      marginBottom: '24px',
                      borderRadius: '6px'
                    }}
                    onClose={() => setMessages(prev => ({ ...prev, login: { text: "", type: "" } }))}
                  />
                )}

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: `${COLORS.text}60` }} />}
                    placeholder="Enter your email"
                    style={{
                      borderRadius: '6px',
                      borderColor: `${COLORS.secondary}30`,
                      background: 'transparent',
                      color: COLORS.text,
                      height: '44px'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: `${COLORS.text}60` }} />}
                    placeholder="Enter your password"
                    style={{
                      borderRadius: '6px',
                      borderColor: `${COLORS.secondary}30`,
                      background: 'transparent',
                      color: COLORS.text,
                      height: '44px'
                    }}
                  />
                </Form.Item>

                <div style={{ 
                  textAlign: 'right',
                  marginBottom: '32px'
                }}>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      color: COLORS.secondary,
                      fontSize: '14px',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loginLoading}
                    block
                    style={{
                      height: '46px',
                      borderRadius: '6px',
                      background: COLORS.action,
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 500
                    }}
                  >
                    {loginLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Signup Form */}
            {activeTab === "signup" && (
              <Form
                form={signupForm}
                name="signup"
                onFinish={onSignupFinish}
                layout="vertical"
                size="large"
                initialValues={{ role: "STUDENT" }}
              >
                {messages.signup.text && (
                  <Alert
                    message={messages.signup.text}
                    type={messages.signup.type}
                    showIcon
                    style={{
                      marginBottom: '24px',
                      borderRadius: '6px'
                    }}
                    onClose={() => setMessages(prev => ({ ...prev, signup: { text: "", type: "" } }))}
                  />
                )}

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, min: 2 }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: `${COLORS.text}60` }} />}
                        placeholder="Full name"
                        style={{
                          borderRadius: '6px',
                          borderColor: `${COLORS.secondary}30`,
                          background: 'transparent',
                          color: COLORS.text,
                          height: '44px'
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, type: 'email' }]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: `${COLORS.text}60` }} />}
                        placeholder="Email address"
                        style={{
                          borderRadius: '6px',
                          borderColor: `${COLORS.secondary}30`,
                          background: 'transparent',
                          color: COLORS.text,
                          height: '44px'
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true },
                        { min: 8 },
                        { 
                          pattern: /^(?=.*[A-Z])(?=.*\d)/,
                          message: 'Uppercase & number required'
                        }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: `${COLORS.text}60` }} />}
                        placeholder="Create password"
                        style={{
                          borderRadius: '6px',
                          borderColor: `${COLORS.secondary}30`,
                          background: 'transparent',
                          color: COLORS.text,
                          height: '44px'
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: `${COLORS.text}60` }} />}
                        placeholder="Confirm password"
                        style={{
                          borderRadius: '6px',
                          borderColor: `${COLORS.secondary}30`,
                          background: 'transparent',
                          color: COLORS.text,
                          height: '44px'
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="role"
                  label="Account Type"
                  rules={[{ required: true }]}
                >
                  <Radio.Group style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Radio value="STUDENT" style={{ width: '100%' }}>
                        <div style={{ 
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${COLORS.secondary}30`,
                          background: 'transparent'
                        }}>
                          <BookOutlined style={{ marginRight: '8px', color: COLORS.secondary }} />
                          <span style={{ fontWeight: 500 }}>Student</span>
                        </div>
                      </Radio>
                      <Radio value="STUDENT_COUNCIL" style={{ width: '100%' }}>
                        <div style={{ 
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${COLORS.secondary}30`,
                          background: 'transparent'
                        }}>
                          <TeamOutlined style={{ marginRight: '8px', color: COLORS.action }} />
                          <span style={{ fontWeight: 500 }}>Council Member</span>
                        </div>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                {signupForm.getFieldValue('role') && (
                  <Form.Item
                    name="className"
                    label="Class"
                    rules={[{ required: true }]}
                  >
                    {loadingClasses ? (
                      <Spin />
                    ) : (
                      <Select
                        placeholder="Select your class"
                        style={{
                          borderRadius: '6px',
                          borderColor: `${COLORS.secondary}30`,
                          background: 'transparent',
                          color: COLORS.text,
                          height: '44px'
                        }}
                      >
                        {classes.map((cls) => (
                          <Option key={cls._id} value={cls.className}>
                            {cls.className}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                )}

                {signupForm.getFieldValue('role') === "STUDENT_COUNCIL" && (
                  <Form.Item
                    name="councilPosition"
                    label="Council Position"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select position"
                      style={{
                        borderRadius: '6px',
                        borderColor: `${COLORS.secondary}30`,
                        background: 'transparent',
                        color: COLORS.text,
                        height: '44px'
                      }}
                    >
                      {councilPositions.map((position) => (
                        <Option key={position.value} value={position.value}>
                          {position.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item style={{ marginTop: '32px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={signupLoading}
                    block
                    icon={<UserAddOutlined />}
                    style={{
                      height: '46px',
                      borderRadius: '6px',
                      background: COLORS.action,
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 500
                    }}
                    disabled={loadingClasses}
                  >
                    {signupLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Security Footer */}
            <Divider style={{ 
              borderColor: `${COLORS.secondary}15`,
              margin: '24px 0'
            }} />
            
            <div style={{ textAlign: 'center' }}>
              <Space size={8} align="center">
                <SafetyOutlined style={{ 
                  color: `${COLORS.text}40`,
                  fontSize: '12px'
                }} />
                <Text style={{ 
                  color: `${COLORS.text}40`,
                  fontSize: '12px'
                }}>
                  Secured with end-to-end encryption
                </Text>
              </Space>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}