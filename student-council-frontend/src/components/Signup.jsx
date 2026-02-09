import React, { useState, useEffect } from "react";
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
  Spin
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  TeamOutlined,
  BookOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { COLORS } from "../utils/colors.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

export default function Signup() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [classes, setClasses] = useState([]);
  const [role, setRole] = useState("STUDENT");
  const navigate = useNavigate();

  const councilPositions = [
    { value: "CHAIRMAN", label: "Chairman" },
    { value: "CHAIRPERSON", label: "Chairperson" },
    { value: "CLASS_REP", label: "Class Representative" },
    { value: "SPORTS_SECRETARY", label: "Sports Secretary" },
    { value: "ARTS_SECRETARY", label: "Arts Secretary" },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
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
          { _id: "4", className: "LU BBA - Year 1" },
          { _id: "5", className: "LU BBA - Year 2" },
          { _id: "6", className: "LU BBA - Year 3" },
          { _id: "7", className: "Psychology" },
          { _id: "8", className: "LMU" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([
        { _id: "1", className: "BSC CS - Year 1" },
        { _id: "2", className: "BSC CS - Year 2" },
        { _id: "3", className: "BSC CS - Year 3" },
        { _id: "4", className: "LU BBA - Year 1" },
        { _id: "5", className: "LU BBA - Year 2" },
        { _id: "6", className: "LU BBA - Year 3" },
        { _id: "7", className: "Psychology" },
        { _id: "8", className: "LMU" },
      ]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

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

      const response = await axiosClient.post(`/auth/register`, submitData, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage({ 
        text: "Account created successfully! Your account is pending approval. You'll be notified when approved.", 
        type: "success" 
      });

      form.resetFields();
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ 
        text: error.response?.data?.message || error.message || "Signup failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const validateMessages = {
    required: '${label} is required',
    types: {
      email: 'Please enter a valid email address',
    },
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
          maxWidth: '520px'
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
              Create Account
            </Title>
            <Text style={{ 
              color: `${COLORS.text}80`,
              fontSize: '16px'
            }}>
              Join the Student Council Portal
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
            {message.text && (
              <Alert
                message={message.text}
                type={message.type}
                showIcon
                style={{
                  marginBottom: '24px',
                  borderRadius: '6px'
                }}
                onClose={() => setMessage({ text: "", type: "" })}
              />
            )}

            <Form
              form={form}
              name="signup"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              validateMessages={validateMessages}
              initialValues={{ role: "STUDENT" }}
              onValuesChange={(changedValues) => {
                if (changedValues.role) {
                  setRole(changedValues.role);
                }
              }}
            >
              {/* Name Field */}
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, min: 2, message: 'Minimum 2 characters required' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: `${COLORS.text}60` }} />}
                  placeholder="Enter your full name"
                  style={{
                    borderRadius: '6px',
                    borderColor: `${COLORS.secondary}30`,
                    background: 'transparent',
                    color: COLORS.text,
                    height: '44px'
                  }}
                />
              </Form.Item>

              {/* Email Field */}
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

              {/* Password Fields */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true },
                      { min: 8, message: 'Minimum 8 characters' },
                      { 
                        pattern: /^(?=.*[A-Z])(?=.*\d)/,
                        message: 'Must contain uppercase letter and number'
                      }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: `${COLORS.text}60` }} />}
                      placeholder="Create password"
                      iconRender={(visible) => 
                        visible ? 
                        <EyeInvisibleOutlined style={{ color: `${COLORS.text}60` }} /> : 
                        <EyeOutlined style={{ color: `${COLORS.text}60` }} />
                      }
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
                      iconRender={(visible) => 
                        visible ? 
                        <EyeInvisibleOutlined style={{ color: `${COLORS.text}60` }} /> : 
                        <EyeOutlined style={{ color: `${COLORS.text}60` }} />
                      }
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

              {/* Role Selection */}
              <Form.Item
                name="role"
                label="Account Type"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  style={{ width: '100%' }}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Radio value="STUDENT" style={{ display: 'block', height: '80px' }}>
                        <div style={{ 
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${role === 'STUDENT' ? COLORS.secondary : `${COLORS.secondary}30`}`,
                          background: role === 'STUDENT' ? `${COLORS.secondary}10` : 'transparent',
                          textAlign: 'center'
                        }}>
                          <BookOutlined style={{ 
                            fontSize: '20px', 
                            color: COLORS.secondary,
                            marginBottom: '8px' 
                          }} />
                          <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>
                            Student
                          </div>
                        </div>
                      </Radio>
                    </Col>
                    <Col span={12}>
                      <Radio value="STUDENT_COUNCIL" style={{ display: 'block', height: '80px' }}>
                        <div style={{ 
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${role === 'STUDENT_COUNCIL' ? COLORS.action : `${COLORS.secondary}30`}`,
                          background: role === 'STUDENT_COUNCIL' ? `${COLORS.action}10` : 'transparent',
                          textAlign: 'center'
                        }}>
                          <TeamOutlined style={{ 
                            fontSize: '20px', 
                            color: COLORS.action,
                            marginBottom: '8px' 
                          }} />
                          <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.text }}>
                            Council Member
                          </div>
                        </div>
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>

              {/* Class Selection */}
              {(role === "STUDENT" || role === "STUDENT_COUNCIL") && (
                <Form.Item
                  name="className"
                  label="Class"
                  rules={[{ required: role === "STUDENT" || role === "STUDENT_COUNCIL" }]}
                >
                  {loadingClasses ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '12px',
                      border: `1px solid ${COLORS.secondary}30`,
                      borderRadius: '6px'
                    }}>
                      <Spin size="small" />
                      <Text style={{ marginLeft: '12px', color: `${COLORS.text}80` }}>
                        Loading classes...
                      </Text>
                    </div>
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

              {/* Council Position (for council members) */}
              {role === "STUDENT_COUNCIL" && (
                <Form.Item
                  name="councilPosition"
                  label="Council Position"
                  rules={[{ required: role === "STUDENT_COUNCIL" }]}
                >
                  <Select
                    placeholder="Select council position"
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

              {/* Submit Button */}
              <Form.Item style={{ marginTop: '32px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
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
                  disabled={loadingClasses || classes.length === 0}
                >
                  {loading ? 'Creating Account...' : 
                   classes.length === 0 ? 'No Classes Available' : 'Create Account'}
                </Button>
              </Form.Item>
            </Form>

            {/* Divider */}
            <Divider style={{ 
              borderColor: `${COLORS.secondary}15`,
              color: `${COLORS.text}50`,
              fontSize: '12px',
              margin: '24px 0'
            }}>
              Already have an account?
            </Divider>

            {/* Login Link */}
            <div style={{ textAlign: 'center' }}>
              <Link to="/login">
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
                  Sign in to existing account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}