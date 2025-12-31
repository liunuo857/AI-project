import React from 'react';
import { Card, Form, Input, Button, Switch, Select, message, Tabs, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateSettings } from '../store/slices/userSlice';

const { Option } = Select;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = React.useState('profile');
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.user);

  const handleProfileFinish = (values: any) => {
    console.log('Profile values:', values);
    message.success('个人资料保存成功！');
  };

  const handleSecurityFinish = (values: any) => {
    console.log('Security values:', values);
    message.success('安全设置保存成功！');
  };

  const handleSystemSettingsFinish = (values: any) => {
    // 更新系统设置到 Redux
    dispatch(updateSettings(values));
    message.success('系统设置保存成功！');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ fontWeight: 'bold', marginBottom: 8 }}>系统设置</Title>
        <Text>管理您的系统设置和用户配置</Text>
      </div>

      <Card 
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: '8px'
        }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[{
            label: '个人资料',
            key: 'profile',
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleProfileFinish}
                initialValues={{
                  username: 'admin',
                  email: 'admin@example.com',
                  nickname: '管理员',
                  description: '系统管理员账户',
                  location: '北京',
                }}
              >
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: '请输入用户名!' }]}
                >
                  <Input 
                    placeholder="用户名" 
                  />
                </Form.Item>
                
                <Form.Item
                  label="昵称"
                  name="nickname"
                >
                  <Input placeholder="昵称" />
                </Form.Item>
                
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[{ required: true, message: '请输入邮箱!', type: 'email' }]}
                >
                  <Input 
                    placeholder="邮箱" 
                  />
                </Form.Item>
                
                <Form.Item
                  label="位置"
                  name="location"
                >
                  <Input 
                    placeholder="位置" 
                  />
                </Form.Item>
                
                <Form.Item
                  label="个人简介"
                  name="description"
                >
                  <Input.TextArea rows={4} placeholder="个人简介" />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存个人资料
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            label: '安全设置',
            key: 'security',
            children: (
              <Form
                layout="vertical"
                onFinish={handleSecurityFinish}
              >
                <Form.Item
                  label="当前密码"
                  name="currentPassword"
                >
                  <Input.Password 
                    placeholder="当前密码" 
                  />
                </Form.Item>
                
                <Form.Item
                  label="新密码"
                  name="newPassword"
                >
                  <Input.Password 
                    placeholder="新密码" 
                  />
                </Form.Item>
                
                <Form.Item
                  label="确认新密码"
                  name="confirmNewPassword"
                >
                  <Input.Password 
                    placeholder="确认新密码" 
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    更新密码
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            label: '系统配置',
            key: 'system',
            children: (
              <Form
                layout="vertical"
                onFinish={handleSystemSettingsFinish}
                initialValues={{
                  theme: settings.theme,
                  notifications: settings.notifications,
                  language: settings.language,
                  emailNotifications: settings.emailNotifications,
                }}
              >
                <Form.Item
                  label="系统主题"
                  name="theme"
                >
                  <Select>
                    <Option value="light">明亮</Option>
                    <Option value="dark">暗黑</Option>
                    <Option value="auto">自动</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label="语言"
                  name="language"
                >
                  <Select>
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                    <Option value="ja-JP">日本語</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label="接收通知"
                  name="notifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                <Form.Item
                  label="邮件通知"
                  name="emailNotifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存系统配置
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          ]}
        />
      </Card>
    </div>
  );
};

export default Settings;