import React, { useState, useMemo } from 'react';
import { Layout, Menu, Typography, Space, Avatar, Dropdown, Tag, Input, Badge, Popover, List } from 'antd';
import type { MenuProps } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  SearchOutlined,
  BellOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/slices/userSlice';
import { hasAnyPermission } from '../utils/permission';
import { getMenuRoutes } from '../config/routes';
import Breadcrumb from '../components/Breadcrumb';
import { useTranslation } from '../hooks/useTranslation';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

// 菜单图标映射
const MENU_ICONS: Record<string, React.ReactNode> = {
  '/dashboard': <DashboardOutlined />,
  '/users': <TeamOutlined />,
  '/orders': <FileTextOutlined />,
  '/analytics': <BarChartOutlined />,
  '/settings': <SettingOutlined />,
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // 模拟通知数据
  const notifications = [
    { id: 1, title: '新订单提醒', desc: '您有一个新订单待处理', time: '5分钟前', read: false },
    { id: 2, title: '系统更新', desc: '系统将在今晚进行维护', time: '1小时前', read: false },
    { id: 3, title: '用户反馈', desc: '用户张三提交了新的反馈', time: '2小时前', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // 通知内容
  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>通知</span>
        <span style={{ color: '#1890ff', fontSize: '12px', cursor: 'pointer' }}>全部已读</span>
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: item.read ? '#fff' : '#f6ffed',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = '#fafafa';
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = item.read ? '#fff' : '#f6ffed';
            }}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!item.read && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#52c41a',
                    }} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</span>
                </div>
              }
              description={
                <div>
                  <div style={{ fontSize: '13px', color: '#595959', marginBottom: 4 }}>
                    {item.desc}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {item.time}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
      }}>
        <span style={{ color: '#1890ff', fontSize: '13px', cursor: 'pointer' }}>
          查看全部通知
        </span>
      </div>
    </div>
  );

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      // 即使登出失败，也跳转到登录页
      navigate('/login', { replace: true });
    }
  };

  // 根据用户权限动态生成菜单
  const menuItems: MenuItem[] = useMemo(() => {
    const routes = getMenuRoutes();
    const menuKeyMap: Record<string, string> = {
      '/dashboard': 'menu.dashboard',
      '/users': 'menu.users',
      '/orders': 'menu.orders',
      '/analytics': 'menu.analytics',
      '/settings': 'menu.settings',
    };
    
    return routes
      .filter(route => {
        // 如果路由有权限要求，检查用户是否有权限
        if (route.permissions && route.permissions.length > 0) {
          return hasAnyPermission(userInfo, route.permissions);
        }
        // 没有权限要求的路由，所有人都可以访问
        return true;
      })
      .map(route => ({
        key: route.path,
        label: t(menuKeyMap[route.path] || route.name),
        icon: MENU_ICONS[route.path],
      }));
  }, [userInfo, t]);

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('settings.profile'),
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: t('login.logout'),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // 根据当前路径设置默认选中的菜单项
  const selectedKey = location.pathname;
  const openKeys = menuItems.some(item => selectedKey.startsWith(item.key)) ? [selectedKey.split('/')[1]] : [];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ 
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div 
          className="logo" 
          style={{ 
            height: 64, 
            margin: '0 16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid #f0f0f0',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)',
            }}>
              {collapsed ? 'A' : 'AS'}
            </div>
            {!collapsed && (
              <Title 
                style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  margin: 0,
                  letterSpacing: '0.5px',
                }} 
                level={4}
              >
                Admin System
              </Title>
            )}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          style={{
            borderRight: 0,
            marginTop: '8px',
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key} style={{ fontWeight: 500 }}>{item.label}</Link>,
            style: {
              margin: '4px 8px',
              borderRadius: '8px',
              height: '40px',
              lineHeight: '40px',
            },
          }))}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ 
          padding: 0, 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
                style: { 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s',
                  padding: '8px',
                  borderRadius: '4px',
                  color: '#595959',
                },
                onMouseEnter: (e: any) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.color = '#1890ff';
                },
                onMouseLeave: (e: any) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#595959';
                },
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 全局搜索 */}
              <Input
                placeholder="搜索菜单、用户、订单..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  width: 240,
                  borderRadius: '20px',
                  background: '#f5f5f5',
                  border: 'none',
                }}
                onFocus={(e: any) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
                }}
                onBlur={(e: any) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              <Space size="large">
                {/* 帮助中心 */}
                <QuestionCircleOutlined 
                  style={{ 
                    fontSize: '18px', 
                    color: '#595959',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = '#1890ff';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = '#595959';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* 通知中心 */}
                <Popover
                  content={notificationContent}
                  trigger="click"
                  placement="bottomRight"
                  overlayStyle={{ paddingTop: 8 }}
                >
                  <Badge count={unreadCount} offset={[-3, 3]}>
                    <BellOutlined 
                      style={{ 
                        fontSize: '18px', 
                        color: '#595959',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.color = '#1890ff';
                        e.currentTarget.style.transform = 'rotate(15deg) scale(1.1)';
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.color = '#595959';
                        e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                      }}
                    />
                  </Badge>
                </Popover>

                {userInfo && (
                  <Tag 
                    color={
                      userInfo.role === 'admin' ? 'red' : 
                      userInfo.role === 'editor' ? 'blue' : 
                      'default'
                    }
                    style={{
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {userInfo.role === 'admin' ? t('users.admin') : 
                     userInfo.role === 'editor' ? t('users.editor') : 
                     t('users.user')}
                  </Tag>
                )}
                <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                  <Space 
                    style={{ 
                      cursor: 'pointer',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Avatar 
                      size={32} 
                      icon={<UserOutlined />} 
                      src={userInfo?.avatar}
                      style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      }}
                    />
                    <span style={{ fontWeight: 500, color: '#262626' }}>{userInfo?.username}</span>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <Breadcrumb />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;