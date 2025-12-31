import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag, Modal, message, Card, Typography } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // 模拟订单数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 调用
    setTimeout(() => {
      const mockOrders = [
        { id: 'ORD001', customer: '张三', product: '产品A', amount: 299.00, status: '已完成', date: '2023-05-15 14:30' },
        { id: 'ORD002', customer: '李四', product: '产品B', amount: 199.50, status: '待发货', date: '2023-05-16 09:15' },
        { id: 'ORD003', customer: '王五', product: '产品C', amount: 599.00, status: '配送中', date: '2023-05-16 11:20' },
        { id: 'ORD004', customer: '赵六', product: '产品D', amount: 89.90, status: '已取消', date: '2023-05-15 16:45' },
        { id: 'ORD005', customer: '孙七', product: '产品E', amount: 1299.00, status: '已完成', date: '2023-05-17 10:30' },
        { id: 'ORD006', customer: '周八', product: '产品F', amount: 45.00, status: '待付款', date: '2023-05-17 13:20' },
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  // 搜索功能
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    const filtered = orders.filter(order => 
      order.id.toLowerCase().includes(lowerSearchText) ||
      order.customer.toLowerCase().includes(lowerSearchText) ||
      order.product.toLowerCase().includes(lowerSearchText) ||
      order.status.toLowerCase().includes(lowerSearchText)
    );
    setFilteredOrders(filtered);
  }, [searchText, orders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === '已完成') color = 'green';
        if (status === '待发货') color = 'blue';
        if (status === '配送中') color = 'orange';
        if (status === '已取消') color = 'red';
        if (status === '待付款') color = 'volcano';
        
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleEdit = (order: any) => {
    message.info(`编辑订单: ${order.id}`);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个订单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const newOrders = orders.filter(order => order.id !== id);
        setOrders(newOrders);
        message.success('订单删除成功');
      }
    });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          <Title level={2} style={{ fontWeight: 'bold', marginBottom: 0 }}>订单管理</Title>
          <Space>
            <Input 
              placeholder="搜索订单（订单号/客户/商品/状态）..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300 }}
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
            <Button type="primary">
              导出订单
            </Button>
          </Space>
        </div>
      </Card>

      <Card 
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: '8px'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="id" 
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={`订单详情 - ${selectedOrder?.id}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
        width={600}
      >
        {selectedOrder && (
          <div>
            <p><strong>订单号：</strong>{selectedOrder.id}</p>
            <p><strong>客户：</strong>{selectedOrder.customer}</p>
            <p><strong>商品：</strong>{selectedOrder.product}</p>
            <p><strong>金额：</strong>¥{selectedOrder.amount.toFixed(2)}</p>
            <p><strong>状态：</strong>
              <Tag color={
                selectedOrder.status === '已完成' ? 'green' : 
                selectedOrder.status === '待发货' ? 'blue' : 
                selectedOrder.status === '配送中' ? 'orange' : 
                selectedOrder.status === '已取消' ? 'red' : 'volcano'
              }>
                {selectedOrder.status}
              </Tag>
            </p>
            <p><strong>下单时间：</strong>{selectedOrder.date}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;