import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Form, 
  Input, 
  Space,
  Alert,
  Divider
} from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  ArrowRightOutlined,
  UserAddOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { COLORS } from '../utils/colors.js';
import Navbar from '../../src/components/Navbar.jsx';

const { Title, Text } = Typography;
const { Content } = Layout;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await axiosClient.post("/auth/login", values);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        if (res.data?.success) {
          navigate('/logged-in/home');
        }
      }
      
      setMessage(res.data?.message || 'Login successful');
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: COLORS.background
    }}>
      <Navbar />
      <Content style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '440px'
        }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '48px'
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
              Sign in to access your account
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
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              {/* Email Field */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Email address is required' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: `${COLORS.text}60` }} />}
                  placeholder="Email address"
                  style={{
                    borderRadius: '6px',
                    borderColor: `${COLORS.secondary}30`,
                    background: 'transparent',
                    color: COLORS.text,
                    padding: '10px 14px',
                    height: '44px'
                  }}
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Password is required' }
                ]}
                style={{ marginBottom: '8px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: `${COLORS.text}60` }} />}
                  placeholder="Password"
                  style={{
                    borderRadius: '6px',
                    borderColor: `${COLORS.secondary}30`,
                    background: 'transparent',
                    color: COLORS.text,
                    padding: '10px 14px',
                    height: '44px'
                  }}
                />
              </Form.Item>

              {/* Forgot Password Link */}
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

              {/* Error/Success Message */}
              {message && (
                <Alert
                  message={message}
                  type={message.includes('failed') ? 'error' : 'success'}
                  showIcon
                  style={{
                    marginBottom: '24px',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              )}

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '46px',
                    borderRadius: '6px',
                    background: COLORS.action,
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Form.Item>
            </Form>

            {/* Divider */}
            <Divider style={{ 
              borderColor: `${COLORS.secondary}15`,
              color: `${COLORS.text}50`,
              fontSize: '12px',
              margin: '32px 0'
            }}>
              OR
            </Divider>

            {/* Sign Up Section */}
            <div style={{ textAlign: 'center' }}>
              <Text style={{ 
                color: `${COLORS.text}70`,
                fontSize: '14px',
                display: 'block',
                marginBottom: '16px'
              }}>
                Don't have an account?
              </Text>
              
              <Link to="/signup">
                <Button
                  type="default"
                  block
                  style={{
                    height: '42px',
                    borderRadius: '6px',
                    borderColor: `${COLORS.secondary}40`,
                    color: COLORS.secondary,
                    fontWeight: 500,
                    background: 'transparent'
                  }}
                >
                  Create new account
                </Button>
              </Link>
            </div>
          </Card>

          {/* Security Footer */}
          <div style={{ 
            marginTop: '32px',
            textAlign: 'center'
          }}>
            <Space size={8} align="center">
            </Space>
          </div>
        </div>
      </Content>
    </Layout>
  );
}