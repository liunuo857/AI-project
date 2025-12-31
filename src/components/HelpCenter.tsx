import React from 'react';
import { Modal, Tabs, Typography, Divider, Space, Tag } from 'antd';
import { 
  RocketOutlined, 
  SafetyOutlined, 
  ToolOutlined, 
  QuestionCircleOutlined,
  CodeOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface HelpCenterProps {
  visible: boolean;
  onClose: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ visible, onClose }) => {
  const items = [
    {
      key: 'quick-start',
      label: '快速开始',
      icon: <RocketOutlined />,
      children: (
        <div>
          <Title level={4}>环境要求</Title>
          <Paragraph>
            <ul>
              <li><Text strong>Node.js:</Text> 建议使用 v22.12.0 或更高版本</li>
              <li><Text strong>包管理器:</Text> npm 或 yarn</li>
              <li><Text strong>浏览器:</Text> Chrome、Firefox、Safari 或 Edge 最新版本</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={4}>安装步骤</Title>
          <Paragraph>
            <Text strong>1. 切换 Node.js 版本（使用 nvm）</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '4px',
              overflow: 'auto',
            }}>
              <code>nvm use 22.12.0</code>
            </pre>
          </Paragraph>

          <Paragraph>
            <Text strong>2. 安装依赖</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '4px',
              overflow: 'auto',
            }}>
              <code>npm install</code>
            </pre>
          </Paragraph>

          <Paragraph>
            <Text strong>3. 启动开发服务器</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '4px',
              overflow: 'auto',
            }}>
              <code>npm run dev</code>
            </pre>
          </Paragraph>

          <Paragraph>
            <Text strong>4. 访问应用</Text>
            <br />
            打开浏览器访问：<Text code>http://localhost:5173</Text>
          </Paragraph>

          <Divider />

          <Title level={4}>默认登录账号</Title>
          <Paragraph>
            <ul>
              <li><Text strong>管理员账号:</Text> admin / 123456</li>
              <li><Text strong>编辑账号:</Text> editor / 123456</li>
              <li><Text strong>普通用户:</Text> user / 123456</li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'features',
      label: '功能说明',
      icon: <ApiOutlined />,
      children: (
        <div>
          <Title level={4}>核心功能</Title>
          
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: '16px' }}>🎯 仪表板</Text>
              <Paragraph style={{ marginTop: 8 }}>
                • 实时数据统计（用户数、订单数、收入、增长率）<br />
                • 趋势对比分析<br />
                • 销售趋势图表<br />
                • 最近活动记录
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ fontSize: '16px' }}>👥 用户管理</Text>
              <Paragraph style={{ marginTop: 8 }}>
                • 用户列表查看和搜索<br />
                • 批量操作（删除、导出、状态修改）<br />
                • 高级筛选（状态、角色）<br />
                • 排序功能<br />
                • 权限控制
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ fontSize: '16px' }}>📦 订单管理</Text>
              <Paragraph style={{ marginTop: 8 }}>
                • 订单列表查看和搜索<br />
                • 批量操作（删除、导出、状态修改）<br />
                • 高级筛选（状态、日期范围）<br />
                • 排序功能<br />
                • 订单详情查看
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ fontSize: '16px' }}>⚙️ 系统设置</Text>
              <Paragraph style={{ marginTop: 8 }}>
                • 个人资料管理<br />
                • 密码修改（强度校验 + 过期提醒）<br />
                • 主题切换（明亮/暗黑）<br />
                • 语言切换（中文/英文/日文）<br />
                • 通知设置
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ fontSize: '16px' }}>🌍 国际化</Text>
              <Paragraph style={{ marginTop: 8 }}>
                • 支持简体中文、English、日本語<br />
                • 实时切换，无需刷新<br />
                • 覆盖所有界面文本
              </Paragraph>
            </div>
          </Space>
        </div>
      ),
    },
    {
      key: 'security',
      label: '安全说明',
      icon: <SafetyOutlined />,
      children: (
        <div>
          <Title level={4}>密码安全</Title>
          <Paragraph>
            <ul>
              <li><Text strong>密码要求:</Text> 至少8个字符，包含大小写字母、数字和特殊字符</li>
              <li><Text strong>密码强度:</Text> 实时检测，必须达到"强"级别</li>
              <li><Text strong>密码过期:</Text> 90天后自动过期，提前7天提醒</li>
              <li><Text strong>修改密码:</Text> 修改后强制重新登录</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={4}>权限控制</Title>
          <Paragraph>
            <ul>
              <li><Text strong>管理员:</Text> 拥有所有权限</li>
              <li><Text strong>编辑:</Text> 可以管理用户和订单</li>
              <li><Text strong>普通用户:</Text> 只能查看数据</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={4}>会话管理</Title>
          <Paragraph>
            <ul>
              <li><Text strong>Token 有效期:</Text> 2小时</li>
              <li><Text strong>自动刷新:</Text> Token 过期前自动刷新</li>
              <li><Text strong>记住我:</Text> 7天内免登录</li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'tech',
      label: '技术栈',
      icon: <CodeOutlined />,
      children: (
        <div>
          <Title level={4}>前端技术</Title>
          <Space wrap style={{ marginBottom: 16 }}>
            <Tag color="blue">React 18</Tag>
            <Tag color="blue">TypeScript</Tag>
            <Tag color="blue">Vite</Tag>
            <Tag color="cyan">Ant Design 5</Tag>
            <Tag color="cyan">Redux Toolkit</Tag>
            <Tag color="cyan">React Router 6</Tag>
            <Tag color="green">ECharts</Tag>
          </Space>

          <Divider />

          <Title level={4}>项目结构</Title>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px',
          }}>
{`src/
├── components/      # 公共组件
├── pages/          # 页面组件
├── layouts/        # 布局组件
├── store/          # Redux 状态管理
├── services/       # API 服务
├── utils/          # 工具函数
├── hooks/          # 自定义 Hooks
├── types/          # TypeScript 类型
├── config/         # 配置文件
└── i18n/           # 国际化`}
          </pre>

          <Divider />

          <Title level={4}>开发命令</Title>
          <Paragraph>
            <ul>
              <li><Text code>npm run dev</Text> - 启动开发服务器</li>
              <li><Text code>npm run build</Text> - 构建生产版本</li>
              <li><Text code>npm run preview</Text> - 预览生产版本</li>
              <li><Text code>npm run lint</Text> - 代码检查</li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'faq',
      label: '常见问题',
      icon: <QuestionCircleOutlined />,
      children: (
        <div>
          <Title level={4}>常见问题解答</Title>
          
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Q: 如何切换语言？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 进入"系统设置"页面，在"系统配置"标签中选择语言，点击保存即可。
              </Paragraph>
            </div>

            <div>
              <Text strong>Q: 忘记密码怎么办？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 点击登录页面的"忘记密码"链接，按照提示重置密码。（当前为演示版本，请联系管理员）
              </Paragraph>
            </div>

            <div>
              <Text strong>Q: 如何导出数据？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 在用户管理或订单管理页面，选择要导出的数据，点击"批量导出"按钮，选择 CSV 或 Excel 格式。
              </Paragraph>
            </div>

            <div>
              <Text strong>Q: 为什么看不到某些菜单？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 菜单显示基于用户权限。如果您的角色权限不足，某些菜单会被隐藏。请联系管理员申请权限。
              </Paragraph>
            </div>

            <div>
              <Text strong>Q: 如何查看通知？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 点击顶部导航栏右侧的铃铛图标，即可查看所有通知。红色数字表示未读通知数量。
              </Paragraph>
            </div>

            <div>
              <Text strong>Q: Node.js 版本不对怎么办？</Text>
              <Paragraph style={{ marginTop: 8, marginLeft: 16 }}>
                A: 使用 nvm 切换版本：
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  marginTop: 8,
                }}>
                  <code>nvm use 22.12.0</code>
                </pre>
                如果没有安装该版本，先执行：
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '8px', 
                  borderRadius: '4px',
                  marginTop: 8,
                }}>
                  <code>nvm install 22.12.0</code>
                </pre>
              </Paragraph>
            </div>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <QuestionCircleOutlined style={{ color: '#4facfe' }} />
          <span>帮助中心</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Tabs
        items={items.map(item => ({
          ...item,
          label: (
            <span>
              {item.icon}
              <span style={{ marginLeft: 8 }}>{item.label}</span>
            </span>
          ),
        }))}
        defaultActiveKey="quick-start"
      />
    </Modal>
  );
};

export default HelpCenter;
