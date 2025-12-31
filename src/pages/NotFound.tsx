import React from 'react';
import { Result, Button, Space, Card, Typography } from 'antd';
import { HomeOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const quickLinks = [
    {
      icon: <DashboardOutlined />,
      title: '仪表板',
      path: '/dashboard',
      description: '查看系统概览和统计数据',
    },
    {
      icon: <TeamOutlined />,
      title: '用户管理',
      path: '/users',
      description: '管理系统用户信息',
    },
    {
      icon: <FileTextOutlined />,
      title: '订单管理',
      path: '/orders',
      description: '查看和处理订单',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 800,
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Result
          status="404"
          title={
            <Title level={1} style={{ fontSize: '72px', margin: 0, color: '#667eea' }}>
              404
            </Title>
          }
          subTitle={
            <div>
              <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
                抱歉，页面未找到
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                您访问的页面不存在或已被移除，请检查 URL 是否正确
              </Paragraph>
            </div>
          }
          extra={
            <Space size="large" direction="vertical" style={{ width: '100%', marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  minWidth: '200px',
                }}
              >
                返回首页
              </Button>

              <div style={{ marginTop: 32, width: '100%' }}>
                <Title level={4} style={{ marginBottom: 16, textAlign: 'center' }}>
                  常用链接
                </Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {quickLinks.map((link) => (
                    <Card
                      key={link.path}
                      hoverable
                      onClick={() => navigate(link.path)}
                      style={{
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <Space align="start" size="middle">
                        <div
                          style={{
                            fontSize: '24px',
                            color: '#667eea',
                            marginTop: '4px',
                          }}
                        >
                          {link.icon}
                        </div>
                        <div>
                          <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                            {link.title}
                          </Title>
                          <Paragraph
                            style={{
                              margin: 0,
                              color: '#666',
                              fontSize: '14px',
                            }}
                          >
                            {link.description}
                          </Paragraph>
                        </div>
                      </Space>
                    </Card>
                  ))}
                </Space>
              </div>
            </Space>
          }
        />
      </Card>
    </div>
  );
};

export default NotFound;
