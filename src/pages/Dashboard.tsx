import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, AreaChartOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics } = useAppSelector((state) => state.dashboard);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // 数据卡片配置
  const statsCards = [
    {
      key: 'users',
      title: '用户数量',
      value: statistics.userCount,
      suffix: '人',
      icon: <UserOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      trend: 12.5,
      trendText: '较上周',
    },
    {
      key: 'orders',
      title: '订单数量',
      value: statistics.orderCount,
      suffix: '笔',
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      trend: 8.3,
      trendText: '较上周',
    },
    {
      key: 'revenue',
      title: '总收入',
      value: statistics.revenue,
      suffix: '元',
      icon: <DollarCircleOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6',
      trend: 15.2,
      trendText: '较上月',
      precision: 2,
    },
    {
      key: 'growth',
      title: '增长率',
      value: statistics.growth,
      suffix: '%',
      icon: <AreaChartOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
      trend: -2.1,
      trendText: '较上月',
      precision: 2,
    },
  ];

  // 模拟图表数据
  const option: any = {
    title: {
      text: '销售趋势',
      subtext: '最近7天的销售情况',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['销售额', '订单数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [
      {
        name: '销售额',
        type: 'line' as const,
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '订单数',
        type: 'line' as const,
        data: [220, 182, 191, 234, 290, 330, 310],
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ fontWeight: 'bold', marginBottom: 8 }}>仪表板</Title>
        <Text type="secondary">欢迎使用后台管理系统</Text>
      </div>

      <Row gutter={[16, 16]}>
        {statsCards.map((card) => (
          <Col span={6} key={card.key}>
            <Card
              bordered={false}
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === card.key ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === card.key 
                  ? `0 12px 24px -6px ${card.color}40, 0 0 0 1px ${card.color}20`
                  : '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* 背景装饰 */}
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: card.bgColor,
                  opacity: 0.5,
                  transition: 'all 0.3s',
                  transform: hoveredCard === card.key ? 'scale(1.2)' : 'scale(1)',
                }} />
                
                {/* 图标 */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: '24px',
                  color: card.color,
                  transition: 'all 0.3s',
                  transform: hoveredCard === card.key ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                }}>
                  {card.icon}
                </div>

                {/* 标题 */}
                <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: 8 }}>
                  {card.title}
                </Text>

                {/* 数值 */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: card.color,
                    lineHeight: 1,
                  }}>
                    {typeof card.value === 'number' 
                      ? card.value.toLocaleString('zh-CN', { 
                          minimumFractionDigits: card.precision || 0,
                          maximumFractionDigits: card.precision || 0,
                        })
                      : card.value}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginLeft: '4px',
                  }}>
                    {card.suffix}
                  </span>
                </div>

                {/* 趋势 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: card.trend >= 0 ? '#f6ffed' : '#fff2e8',
                  width: 'fit-content',
                }}>
                  {card.trend >= 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                  )}
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: card.trend >= 0 ? '#52c41a' : '#ff4d4f',
                  }}>
                    {Math.abs(card.trend)}%
                  </span>
                  <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {card.trendText}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card 
          title="销售趋势图" 
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px'
          }}
        >
          <div style={{ height: 400 }}>
            <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card 
              title="最近活动" 
              style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '8px'
              }}
            >
              <ul style={{ margin: 0, paddingInlineStart: 20 }}>
                <li>用户张三登录了系统</li>
                <li>用户李四修改了订单信息</li>
                <li>管理员王五添加了新用户</li>
                <li>系统自动备份完成</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              title="快速操作" 
              style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '8px'
              }}
            >
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Button type="primary" size="large" block>创建新用户</Button>
                <Button size="large" block>查看报表</Button>
                <Button size="large" block>系统设置</Button>
                <Button size="large" block>查看订单</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;