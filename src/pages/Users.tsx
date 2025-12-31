import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Select, Card, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

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

  // 搜索功能
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowerSearchText) ||
      user.email.toLowerCase().includes(lowerSearchText) ||
      user.role.toLowerCase().includes(lowerSearchText) ||
      user.status.toLowerCase().includes(lowerSearchText)
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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