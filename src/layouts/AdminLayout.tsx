import React, { useState, useMemo } from 'react';
import { Layout, Menu, Typography, Space, Avatar, Dropdown, Tag } from 'antd';
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
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/slices/userSlice';
import { hasAnyPermission } from '../utils/permission';
import { getMenuRoutes } from '../config/routes';

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
  const { userInfo } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
        label: route.name,
        icon: MENU_ICONS[route.path],
      }));
  }, [userInfo]);

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // 根据当前路径设置默认选中的菜单项
  const selectedKey = location.pathname;
  const openKeys = menuItems.some(item => selectedKey.startsWith(item.key)) ? [selectedKey.split('/')[1]] : [];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ 
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div className="logo" style={{ height: 64, margin: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title style={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold', margin: 0 }} level={4}>
            {collapsed ? 'AM' : '后台管理系统'}
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
                style: { fontSize: '18px', cursor: 'pointer', transition: 'color 0.3s', marginRight: 20 },
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Space size="middle">
                {userInfo && (
                  <Tag color={
                    userInfo.role === 'admin' ? 'red' : 
                    userInfo.role === 'editor' ? 'blue' : 
                    'default'
                  }>
                    {userInfo.role === 'admin' ? '管理员' : 
                     userInfo.role === 'editor' ? '编辑' : 
                     '用户'}
                  </Tag>
                )}
                <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar size="small" icon={<UserOutlined />} src={userInfo?.avatar} />
                    <span>{userInfo?.username}</span>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 0,
            background: '#fff',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;