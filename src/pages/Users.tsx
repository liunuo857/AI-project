import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Select, Card, Typography, Dropdown, DatePicker, Progress } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, DownOutlined, FilterOutlined } from '@ant-design/icons';
import type { Key } from 'react';
import TableSkeleton from '../components/TableSkeleton';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // 模拟用户数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 调用
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '激活' },
        { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: '激活' },
        { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: '禁用' },
        { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: '激活' },
        { id: 5, name: '孙七', email: 'sunqi@example.com', role: '用户', status: '激活' },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  // 搜索和筛选功能
  useEffect(() => {
    let filtered = [...users];

    // 搜索过滤
    if (searchText.trim()) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowerSearchText) ||
        user.email.toLowerCase().includes(lowerSearchText) ||
        user.role.toLowerCase().includes(lowerSearchText) ||
        user.status.toLowerCase().includes(lowerSearchText)
      );
    }

    // 状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // 角色筛选
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // 排序
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortOrder === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredUsers(filtered);
  }, [searchText, users, filterStatus, filterRole, sortField, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的用户');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `您确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
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

        const newUsers = users.filter(user => !selectedRowKeys.includes(user.id));
        setUsers(newUsers);
        setSelectedRowKeys([]);
        setDeleteLoading(false);
        setShowProgress(false);
        setBatchProgress(0);
        message.success(`成功删除 ${total} 个用户`);
      }
    });
  };

  // 批量导出
  const handleBatchExport = async (format: 'csv' | 'excel') => {
    const exportData = selectedRowKeys.length > 0
      ? users.filter(user => selectedRowKeys.includes(user.id))
      : filteredUsers;

    if (exportData.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    setExportLoading(true);
    message.loading({ content: '正在导出数据...', key: 'export', duration: 0 });

    // 模拟导出处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成CSV内容
    const headers = ['ID', '姓名', '邮箱', '角色', '状态'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(user => 
        [user.id, user.name, user.email, user.role, user.status].join(',')
      )
    ].join('\n');

    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`);
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
      message.warning('请先选择要修改的用户');
      return;
    }

    Modal.confirm({
      title: '批量修改状态',
      content: `您确定要将选中的 ${selectedRowKeys.length} 个用户状态修改为"${newStatus}"吗？`,
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

        const newUsers = users.map(user => 
          selectedRowKeys.includes(user.id) ? { ...user, status: newStatus } : user
        );
        setUsers(newUsers);
        setSelectedRowKeys([]);
        setBatchLoading(false);
        setShowProgress(false);
        setBatchProgress(0);
        message.success(`成功修改 ${total} 个用户的状态`);
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: sortField === 'id' ? sortOrder : null,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : null,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: sortField === 'email' ? sortOrder : null,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      sortOrder: sortField === 'role' ? sortOrder : null,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortField === 'status' ? sortOrder : null,
      render: (status: string) => (
        <span style={{ color: status === '激活' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
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

  const handleEdit = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const newUsers = users.filter(user => user.id !== id);
        setUsers(newUsers);
        message.success('用户删除成功');
      }
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 更新用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('用户信息更新成功');
      } else {
        // 添加新用户
        const newUser = {
          id: users.length + 1,
          ...values,
        };
        setUsers([...users, newUser]);
        message.success('用户添加成功');
      }
      setIsModalVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 初始加载时显示骨架屏
  if (loading && users.length === 0) {
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
            <Title level={2} style={{ fontWeight: 'bold', marginBottom: 0 }}>用户管理</Title>
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
            <Title level={2} style={{ fontWeight: 'bold', marginBottom: 0 }}>用户管理</Title>
            <Space>
              <Input 
                placeholder="搜索用户（姓名/邮箱/角色/状态）..." 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddUser}
              >
                添加用户
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
                <Select.Option value="激活">激活</Select.Option>
                <Select.Option value="禁用">禁用</Select.Option>
              </Select>
              <Select
                style={{ width: 120 }}
                placeholder="角色"
                value={filterRole}
                onChange={setFilterRole}
              >
                <Select.Option value="all">全部角色</Select.Option>
                <Select.Option value="管理员">管理员</Select.Option>
                <Select.Option value="编辑">编辑</Select.Option>
                <Select.Option value="用户">用户</Select.Option>
              </Select>
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
                      key: 'activate',
                      label: '批量激活',
                      onClick: () => handleBatchStatusChange('激活'),
                    },
                    {
                      key: 'deactivate',
                      label: '批量禁用',
                      onClick: () => handleBatchStatusChange('禁用'),
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
          dataSource={filteredUsers} 
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
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          name="user_form"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱!', type: 'email' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="用户">用户</Select.Option>
              <Select.Option value="编辑">编辑</Select.Option>
              <Select.Option value="管理员">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态!' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="激活">激活</Select.Option>
              <Select.Option value="禁用">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;