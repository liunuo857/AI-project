import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, AreaChartOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ fontWeight: 'bold', marginBottom: 8 }}>仪表板</Title>
        <Text>欢迎使用后台管理系统</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={
                <span style={{ fontSize: '14px', color: '#595959' }}>
                  <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  用户数量
                </span>
              }
              value={statistics.userCount}
              precision={0}
              valueStyle={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={
                <span style={{ fontSize: '14px', color: '#595959' }}>
                  <ShoppingCartOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  订单数量
                </span>
              }
              value={statistics.orderCount}
              precision={0}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<ShoppingCartOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={
                <span style={{ fontSize: '14px', color: '#595959' }}>
                  <DollarCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  总收入
                </span>
              }
              value={statistics.revenue}
              precision={2}
              valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarCircleOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={
                <span style={{ fontSize: '14px', color: '#595959' }}>
                  <AreaChartOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                  增长率
                </span>
              }
              value={statistics.growth}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<AreaChartOutlined />}
              suffix="%"
            />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#3f8600', fontSize: '12px' }}>
                <ArrowUpOutlined /> 12.5%
              </span>
            </div>
          </Card>
        </Col>
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