import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag, Modal, message, Card, Typography, Dropdown, Select, DatePicker, Progress, Form, InputNumber } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, DownOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import type { Key } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TableSkeleton from '../components/TableSkeleton';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addOrder, deleteOrder, batchDeleteOrders, batchUpdateOrderStatus } from '../store/slices/ordersSlice';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [addLoading, setAddLoading] = useState(false);

  // 初始化过滤后的订单列表
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  // 搜索和筛选功能
  useEffect(() => {
    let filtered = [...orders];

    // 搜索过滤
    if (searchText.trim()) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(lowerSearchText) ||
        order.customer.toLowerCase().includes(lowerSearchText) ||
        order.product.toLowerCase().includes(lowerSearchText) ||
        order.status.toLowerCase().includes(lowerSearchText)
      );
    }

    // 状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // 日期范围筛选
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.date, 'YYYY-MM-DD HH:mm');
        return orderDate.isAfter(dateRange[0]) && orderDate.isBefore(dateRange[1]);
      });
    }

    // 排序
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // 特殊处理金额字段
        if (sortField === 'amount') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }
        
        if (sortOrder === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [searchText, orders, filterStatus, dateRange, sortField, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的订单');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `您确定要删除选中的 ${selectedRowKeys.length} 个订单吗？`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { loading: deleteLoading },
      onOk: async () => {
        setDeleteLoading(true);
        setShowProgress(true);
        setBatchProgress(0);

        const total = selectedRowKeys.length;
        const deletePromises = selectedRowKeys.map((key, index) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              setBatchProgress(Math.round(((index + 1) / total) * 100));
              resolve(key);
            }, 100);
          });
        });

        await Promise.all(deletePromises);

        dispatch(batchDeleteOrders(selectedRowKeys as string[]));
        setSelectedRowKeys([]);
        setDeleteLoading(false);
        setShowProgress(false);
        setBatchProgress(0);
        message.success(`成功删除 ${total} 个订单`);
      }
    });
  };

  // 批量导出
  const handleBatchExport = async (format: 'csv' | 'excel') => {
    const exportData = selectedRowKeys.length > 0
      ? orders.filter(order => selectedRowKeys.includes(order.id))
      : filteredOrders;

    if (exportData.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    setExportLoading(true);
    message.loading({ content: '正在导出数据...', key: 'export', duration: 0 });

    // 模拟导出处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成CSV内容
    const headers = ['订单号', '客户', '商品', '金额', '状态', '日期'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(order => 
        [order.id, order.customer, order.product, order.amount, order.status, order.date].join(',')
      )
    ].join('\n');

    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportLoading(false);
    message.success({ content: `成功导出 ${exportData.length} 条数据`, key: 'export', duration: 2 });
  };

  // 批量修改状态
  const handleBatchStatusChange = (newStatus: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要修改的订单');
      return;
    }

    Modal.confirm({
      title: '批量修改状态',
      content: `您确定要将选中的 ${selectedRowKeys.length} 个订单状态修改为"${newStatus}"吗？`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { loading: batchLoading },
      onOk: async () => {
        setBatchLoading(true);
        setShowProgress(true);
        setBatchProgress(0);

        const total = selectedRowKeys.length;
        const updatePromises = selectedRowKeys.map((key, index) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              setBatchProgress(Math.round(((index + 1) / total) * 100));
              resolve(key);
            }, 100);
          });
        });

        await Promise.all(updatePromises);

        dispatch(batchUpdateOrderStatus({ ids: selectedRowKeys as string[], status: newStatus }));
        setSelectedRowKeys([]);
        setBatchLoading(false);
        setShowProgress(false);
        setBatchProgress(0);
        message.success(`成功修改 ${total} 个订单的状态`);
      }
    });
  };

  // 表格排序变化处理
  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order || null);
    } else {
      setSortField('');
      setSortOrder(null);
    }
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const columns: TableColumnsType<any> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: sortField === 'id' ? sortOrder : null,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      sorter: true,
      sortOrder: sortField === 'customer' ? sortOrder : null,
    },
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      sorter: true,
      sortOrder: sortField === 'product' ? sortOrder : null,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: sortField === 'amount' ? sortOrder : null,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortField === 'status' ? sortOrder : null,
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
      sorter: true,
      sortOrder: sortField === 'date' ? sortOrder : null,
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
        dispatch(deleteOrder(id));
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

  // 新增订单
  const handleAddOrder = () => {
    setIsAddModalVisible(true);
    addForm.resetFields();
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      setAddLoading(true);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用 Redux 添加订单
      dispatch(addOrder({
        customer: values.customer,
        product: values.product,
        amount: values.amount,
      }));
      
      setAddLoading(false);
      setIsAddModalVisible(false);
      addForm.resetFields();
      message.success('订单创建成功！');
    } catch (error) {
      console.error('表单验证失败:', error);
      setAddLoading(false);
    }
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  // 初始加载时显示骨架屏
  if (loading && orders.length === 0) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Card 
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={2} style={{ fontWeight: 'bold', marginBottom: 0 }}>订单管理</Title>
          </div>
        </Card>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 批量操作进度条 */}
      {showProgress && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '400px',
          }}
        >
          <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold' }}>
            正在处理...
          </div>
          <Progress percent={batchProgress} status="active" />
        </div>
      )}

      <Card 
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: '8px',
          marginBottom: 24
        }}
      >
        <div style={{ marginBottom: 16 }}>
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
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddOrder}
              >
                新增订单
              </Button>
            </Space>
          </div>

          {/* 筛选和批量操作区域 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size="middle">
              <Space>
                <FilterOutlined />
                <span>筛选：</span>
              </Space>
              <Select
                style={{ width: 120 }}
                placeholder="状态"
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Select.Option value="all">全部状态</Select.Option>
                <Select.Option value="待付款">待付款</Select.Option>
                <Select.Option value="待发货">待发货</Select.Option>
                <Select.Option value="配送中">配送中</Select.Option>
                <Select.Option value="已完成">已完成</Select.Option>
                <Select.Option value="已取消">已取消</Select.Option>
              </Select>
              <RangePicker
                style={{ width: 280 }}
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
              />
            </Space>

            <Space>
              {selectedRowKeys.length > 0 && (
                <span style={{ marginRight: 8 }}>
                  已选择 <strong>{selectedRowKeys.length}</strong> 项
                </span>
              )}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'csv',
                      label: '导出为 CSV',
                      onClick: () => handleBatchExport('csv'),
                    },
                    {
                      key: 'excel',
                      label: '导出为 Excel',
                      onClick: () => handleBatchExport('excel'),
                    },
                  ],
                }}
              >
                <Button icon={<DownloadOutlined />} loading={exportLoading}>
                  导出 <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown
                disabled={selectedRowKeys.length === 0}
                menu={{
                  items: [
                    {
                      key: 'pending',
                      label: '标记为待发货',
                      onClick: () => handleBatchStatusChange('待发货'),
                    },
                    {
                      key: 'shipping',
                      label: '标记为配送中',
                      onClick: () => handleBatchStatusChange('配送中'),
                    },
                    {
                      key: 'completed',
                      label: '标记为已完成',
                      onClick: () => handleBatchStatusChange('已完成'),
                    },
                    {
                      key: 'cancelled',
                      label: '标记为已取消',
                      onClick: () => handleBatchStatusChange('已取消'),
                    },
                  ],
                }}
              >
                <Button disabled={selectedRowKeys.length === 0}>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
              <Button 
                danger 
                disabled={selectedRowKeys.length === 0}
                loading={deleteLoading}
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
            </Space>
          </div>
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
          rowSelection={rowSelection}
          onChange={handleTableChange}
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

      {/* 新增订单 Modal */}
      <Modal
        title="新增订单"
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        okText="创建"
        cancelText="取消"
        confirmLoading={addLoading}
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="客户姓名"
            name="customer"
            rules={[
              { required: true, message: '请输入客户姓名' },
              { min: 2, message: '客户姓名至少2个字符' },
              { max: 20, message: '客户姓名最多20个字符' },
            ]}
          >
            <Input placeholder="请输入客户姓名" />
          </Form.Item>

          <Form.Item
            label="商品名称"
            name="product"
            rules={[
              { required: true, message: '请输入商品名称' },
              { min: 2, message: '商品名称至少2个字符' },
              { max: 50, message: '商品名称最多50个字符' },
            ]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>

          <Form.Item
            label="订单金额"
            name="amount"
            rules={[
              { required: true, message: '请输入订单金额' },
              { type: 'number', min: 0.01, message: '金额必须大于0' },
              { type: 'number', max: 999999.99, message: '金额不能超过999999.99' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入订单金额"
              prefix="¥"
              precision={2}
              min={0.01}
              max={999999.99}
            />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea
              placeholder="请输入备注信息（可选）"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;