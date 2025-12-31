import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser } from '../store/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useAppSelector((state) => state.user);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 获取登录前的路径，如果没有则默认跳转到 dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success('登录成功！');
      // 登录成功后跳转到之前的页面或 dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error || '登录失败，请重试');
    }
  };

  const features = [
    { icon: <SafetyOutlined />, title: '安全可靠', desc: '企业级安全保障' },
    { icon: <RocketOutlined />, title: '高效便捷', desc: '快速响应处理' },
    { icon: <ThunderboltOutlined />, title: '智能管理', desc: '数据可视化分析' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: '#f0f2f5',
    }}>
      <Row style={{ width: '100%', margin: 0 }}>
        {/* 左侧品牌展示区 */}
        <Col 
          xs={0} 
          sm={0} 
          md={12} 
          lg={14} 
          xl={16}
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 背景装饰 */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }} />

          {/* Logo 和标题 */}
          <div style={{ 
            position: 'relative', 
            zIndex: 1,
            textAlign: 'center',
            marginBottom: '60px',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '36px',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
              AS
            </div>
            <Title level={1} style={{ 
              color: '#fff', 
              marginBottom: 16,
              fontSize: '42px',
              fontWeight: 'bold',
            }}>
              Admin System
            </Title>
            <Paragraph style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '18px',
              marginBottom: 0,
            }}>
              现代化企业级后台管理系统
            </Paragraph>
          </div>

          {/* 特色功能 */}
          <div style={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            gap: '40px',
            marginTop: '40px',
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  textAlign: 'center',
                  color: '#fff',
                }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                >
                  {feature.icon}
                </div>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: 8 }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* 右侧登录表单区 */}
        <Col 
          xs={24} 
          sm={24} 
          md={12} 
          lg={10} 
          xl={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            background: '#fff',
          }}
        >
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {/* 表单标题 */}
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
              <Title level={2} style={{ 
                marginBottom: 8,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                欢迎回来
              </Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>
                请登录您的账户以继续
              </Text>
            </div>

            {/* 登录表单 */}
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: focusedField === 'username' ? '#4facfe' : '#bfbfbf' }} />} 
                  placeholder="用户名" 
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.3s',
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: focusedField === 'password' ? '#4facfe' : '#bfbfbf' }} />}
                  placeholder="密码"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.3s',
                  }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <a 
                    href="#" 
                    style={{ 
                      color: '#4facfe',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = '#00f2fe';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = '#4facfe';
                    }}
                  >
                    忘记密码？
                  </a>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                  loading={loading}
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.5)';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.4)';
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            {/* 底部提示 */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: 24,
              paddingTop: 24,
              borderTop: '1px solid #f0f0f0',
            }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                还没有账户？{' '}
                <a 
                  href="#" 
                  style={{ 
                    color: '#4facfe',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = '#00f2fe';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = '#4facfe';
                  }}
                >
                  立即注册
                </a>
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;