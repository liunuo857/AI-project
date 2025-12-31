import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Select, message, Tabs, Typography, Modal, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateSettings, logoutUser } from '../store/slices/userSlice';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { checkPasswordStrength, getPasswordExpiryDays, isPasswordExpired } from '../utils/passwordValidator';
import { useTranslation } from '../hooks/useTranslation';

const { Option } = Select;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { settings } = useAppSelector((state) => state.user);
  const { t } = useTranslation();

  // 模拟密码最后修改日期（实际应从后端获取）
  const [passwordLastChanged] = useState(new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)); // 75天前
  const passwordExpiryDays = getPasswordExpiryDays(passwordLastChanged);
  const passwordExpired = isPasswordExpired(passwordLastChanged);

  useEffect(() => {
    // 检查密码是否即将过期或已过期
    if (passwordExpired) {
      Modal.warning({
        title: t('settings.passwordExpired'),
        content: t('settings.passwordExpiredDesc'),
        okText: t('common.confirm'),
        onOk: () => setActiveTab('security'),
      });
    } else if (passwordExpiryDays <= 7 && passwordExpiryDays > 0) {
      message.warning({
        content: t('settings.passwordExpiringDesc', { days: passwordExpiryDays.toString() }),
        duration: 5,
      });
    }
  }, [passwordExpired, passwordExpiryDays, t]);

  const handleProfileFinish = (values: any) => {
    console.log('Profile values:', values);
    message.success(t('message.saveSuccess', { item: t('settings.profile') }));
  };

  const handleSecurityFinish = async (values: any) => {
    const { currentPassword, newPassword, confirmNewPassword } = values;

    // 验证当前密码（实际应该调用后端API）
    if (currentPassword !== 'admin123') {
      message.error(t('settings.currentPassword') + '不正确');
      return;
    }

    // 验证新密码强度
    const strengthResult = checkPasswordStrength(newPassword);
    if (!strengthResult.passed) {
      message.error('新密码不符合安全要求，请查看密码强度提示');
      return;
    }

    // 验证两次密码是否一致
    if (newPassword !== confirmNewPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    // 验证新密码不能与当前密码相同
    if (currentPassword === newPassword) {
      message.error('新密码不能与当前密码相同');
      return;
    }

    setLoading(true);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      Modal.success({
        title: t('settings.passwordChangeSuccess'),
        content: t('settings.passwordChangeSuccessDesc'),
        okText: t('common.confirm'),
        onOk: async () => {
          await dispatch(logoutUser()).unwrap();
          navigate('/login', { replace: true });
        },
      });

      // 3秒后自动退出
      setTimeout(async () => {
        await dispatch(logoutUser()).unwrap();
        navigate('/login', { replace: true });
      }, 3000);

      securityForm.resetFields();
      setNewPassword('');
    } catch (error) {
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsFinish = (values: any) => {
    // 更新系统设置到 Redux
    dispatch(updateSettings(values));
    message.success(t('message.saveSuccess', { item: t('settings.system') }));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('settings.title')}</Title>
        <Text>{t('settings.subtitle')}</Text>
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
            label: t('settings.profile'),
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
                  label={t('settings.username')}
                  name="username"
                  rules={[{ required: true, message: t('login.usernameRequired') }]}
                >
                  <Input 
                    placeholder={t('settings.username')} 
                  />
                </Form.Item>
                
                <Form.Item
                  label={t('settings.nickname')}
                  name="nickname"
                >
                  <Input placeholder={t('settings.nickname')} />
                </Form.Item>
                
                <Form.Item
                  label={t('settings.email')}
                  name="email"
                  rules={[{ required: true, message: t('login.passwordRequired'), type: 'email' }]}
                >
                  <Input 
                    placeholder={t('settings.email')} 
                  />
                </Form.Item>
                
                <Form.Item
                  label={t('settings.location')}
                  name="location"
                >
                  <Input 
                    placeholder={t('settings.location')} 
                  />
                </Form.Item>
                
                <Form.Item
                  label={t('settings.description')}
                  name="description"
                >
                  <Input.TextArea rows={4} placeholder={t('settings.description')} />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {t('common.save')}{t('settings.profile')}
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            label: t('settings.security'),
            key: 'security',
            children: (
              <div>
                {/* 密码过期提醒 */}
                {passwordExpired ? (
                  <Alert
                    message={t('settings.passwordExpired')}
                    description={t('settings.passwordExpiredDesc')}
                    type="error"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                ) : passwordExpiryDays <= 7 ? (
                  <Alert
                    message={t('settings.passwordExpiringSoon')}
                    description={t('settings.passwordExpiringDesc', { days: passwordExpiryDays.toString() })}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                ) : (
                  <Alert
                    message={t('settings.passwordHealthy')}
                    description={t('settings.passwordHealthyDesc', { days: passwordExpiryDays.toString() })}
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}

                <Form
                  form={securityForm}
                  layout="vertical"
                  onFinish={handleSecurityFinish}
                >
                  <Form.Item
                    label={t('settings.currentPassword')}
                    name="currentPassword"
                    rules={[
                      { required: true, message: t('settings.currentPassword') },
                    ]}
                  >
                    <Input.Password 
                      placeholder={t('settings.currentPassword')} 
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label={t('settings.newPassword')}
                    name="newPassword"
                    rules={[
                      { required: true, message: t('settings.newPassword') },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const result = checkPasswordStrength(value);
                          if (!result.passed) {
                            return Promise.reject(new Error('密码强度不符合要求'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input.Password 
                      placeholder={t('settings.newPassword')} 
                      size="large"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Item>

                  {/* 密码强度指示器 */}
                  <PasswordStrengthIndicator password={newPassword} />
                  
                  <Form.Item
                    label={t('settings.confirmPassword')}
                    name="confirmNewPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: t('settings.confirmPassword') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'));
                        },
                      }),
                    ]}
                    style={{ marginTop: 16 }}
                  >
                    <Input.Password 
                      placeholder={t('settings.confirmPassword')} 
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item style={{ marginTop: 24 }}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large"
                      loading={loading}
                      block
                    >
                      {t('settings.updatePassword')}
                    </Button>
                  </Form.Item>

                  <Alert
                    message={t('settings.securityTip')}
                    description={t('settings.securityTipDesc')}
                    type="info"
                    showIcon
                  />
                </Form>
              </div>
            ),
          },
          {
            label: t('settings.system'),
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
                  label={t('settings.theme')}
                  name="theme"
                >
                  <Select>
                    <Option value="light">{t('settings.light')}</Option>
                    <Option value="dark">{t('settings.dark')}</Option>
                    <Option value="auto">{t('settings.auto')}</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label={t('settings.language')}
                  name="language"
                >
                  <Select>
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                    <Option value="ja-JP">日本語</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label={t('settings.notifications')}
                  name="notifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                <Form.Item
                  label={t('settings.emailNotifications')}
                  name="emailNotifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {t('common.save')}{t('settings.system')}
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