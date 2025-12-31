import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser } from '../store/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useAppSelector((state) => state.user);

  // 获取登录前的路径，如果没有则默认跳转到 dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success('登录成功！');
      // 登录成功后跳转到之前的页面或 dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error || '登录失败，请重试');
    }
  };
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ fontWeight: 'bold', marginBottom: 8 }}>后台管理系统</Title>
          <p>请登录您的账户</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;