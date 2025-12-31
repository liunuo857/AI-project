import React from 'react';
import { Card, Row, Col, Select, DatePicker, Space, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Analytics: React.FC = () => {
  // 销售趋势图表数据
  const salesOption: any = {
    title: {
      text: '销售趋势',
      subtext: '最近30天的销售情况',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['销售额', '订单数', '访客数'],
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
      data: ['1号', '5号', '10号', '15号', '20号', '25号', '30号'],
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [
      {
        name: '销售额',
        type: 'line' as const,
        data: [1200, 1320, 1010, 1340, 900, 2300, 2100],
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
      {
        name: '访客数',
        type: 'line' as const,
        data: [1220, 1320, 1010, 1340, 900, 2300, 2100],
        smooth: true,
        itemStyle: {
          color: '#722ed1',
        },
      },
    ],
  };

  // 用户来源图表数据
  const sourceOption: any = {
    title: {
      text: '用户来源',
      subtext: '不同渠道的用户占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item' as const,
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '用户来源',
        type: 'pie' as const,
        radius: '50%',
        data: [
          { value: 1048, name: '直接访问' },
          { value: 735, name: '搜索引擎' },
          { value: 580, name: '社交媒体' },
          { value: 484, name: '推荐链接' },
          { value: 300, name: '广告' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 地区分布图表数据
  const regionOption: any = {
    title: {
      text: '用户地区分布',
      subtext: '各地区用户数量',
      left: 'center',
    },
    xAxis: {
      type: 'category' as const,
      data: ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北'],
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [{
      data: [120, 132, 101, 134, 90, 230, 210],
      type: 'bar' as const,
      itemStyle: {
        color: '#13c2c2',
      },
    }],
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card 
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: '8px',
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} style={{ fontWeight: 'bold', marginBottom: 0 }}>数据统计</Title>
          <Space>
            <Select defaultValue="7" style={{ width: 120 }}>
              <Select.Option value="1">今天</Select.Option>
              <Select.Option value="7">最近7天</Select.Option>
              <Select.Option value="30">最近30天</Select.Option>
              <Select.Option value="90">最近3个月</Select.Option>
            </Select>
            <RangePicker />
          </Space>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card 
            title="销售趋势图"
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <div style={{ height: 400 }}>
              <ReactECharts option={salesOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="用户来源分布"
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <div style={{ height: 400 }}>
              <ReactECharts option={sourceOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card 
          title="用户地区分布"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px'
          }}
        >
          <div style={{ height: 400 }}>
            <ReactECharts option={regionOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </Card>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card 
            title="总销售额"
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#52c41a', fontSize: '1.8em' }}>¥ 24,680</h2>
              <p style={{ color: '#8c8c8c' }}>月同比 12.5% <span style={{ color: '#52c41a' }}>↑</span></p>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="总订单数"
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#1890ff', fontSize: '1.8em' }}>1,248</h2>
              <p style={{ color: '#8c8c8c' }}>月同比 8.3% <span style={{ color: '#52c41a' }}>↑</span></p>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="访客数"
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: '8px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#722ed1', fontSize: '1.8em' }}>5,672</h2>
              <p style={{ color: '#8c8c8c' }}>月同比 15.2% <span style={{ color: '#52c41a' }}>↑</span></p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;