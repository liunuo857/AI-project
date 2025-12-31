import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector } from './hooks/redux';
import { useMemo } from 'react';

function App() {
  const { settings } = useAppSelector((state) => state.user);

  // 根据设置选择语言包
  const locale = useMemo(() => {
    switch (settings.language) {
      case 'en-US':
        return enUS;
      case 'ja-JP':
        return jaJP;
      case 'zh-CN':
      default:
        return zhCN;
    }
  }, [settings.language]);

  // 根据设置选择主题算法
  const themeAlgorithm = useMemo(() => {
    switch (settings.theme) {
      case 'dark':
        return theme.darkAlgorithm;
      case 'light':
      default:
        return theme.defaultAlgorithm;
    }
  }, [settings.theme]);

  // 自定义主题配置
  const themeConfig = useMemo(() => {
    const baseConfig = {
      algorithm: themeAlgorithm,
      token: {
        borderRadius: 8,
        colorPrimary: '#1890ff',
      },
    };

    // 暗黑主题的额外配置
    if (settings.theme === 'dark') {
      return {
        ...baseConfig,
        token: {
          ...baseConfig.token,
          // 优化暗黑主题的配色
          colorBgBase: '#141414',           // 基础背景色（深灰色，不是纯黑）
          colorBgContainer: '#1f1f1f',      // 容器背景色
          colorBgElevated: '#262626',       // 浮层背景色
          colorBgLayout: '#0a0a0a',         // 布局背景色
          colorBorder: 'rgba(255, 255, 255, 0.12)',  // 边框颜色
          colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',  // 次要边框
          colorText: 'rgba(255, 255, 255, 0.88)',     // 主要文字
          colorTextSecondary: 'rgba(255, 255, 255, 0.65)',  // 次要文字
          colorTextTertiary: 'rgba(255, 255, 255, 0.45)',   // 第三级文字
          colorTextQuaternary: 'rgba(255, 255, 255, 0.25)', // 第四级文字
        },
        components: {
          Layout: {
            colorBgHeader: '#1f1f1f',
            colorBgBody: '#0a0a0a',
            colorBgTrigger: '#262626',
          },
          Menu: {
            colorItemBg: 'transparent',
            colorItemBgHover: 'rgba(255, 255, 255, 0.08)',
            colorItemBgSelected: 'rgba(24, 144, 255, 0.15)',
            colorItemBgActive: 'rgba(255, 255, 255, 0.12)',
          },
          Card: {
            colorBgContainer: '#1f1f1f',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
          },
          Table: {
            colorBgContainer: '#1f1f1f',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
          },
          Input: {
            colorBgContainer: '#262626',
            colorBorder: 'rgba(255, 255, 255, 0.15)',
          },
          Select: {
            colorBgContainer: '#262626',
            colorBorder: 'rgba(255, 255, 255, 0.15)',
          },
        },
      };
    }

    return baseConfig;
  }, [themeAlgorithm, settings.theme]);

  return (
    <ConfigProvider
      locale={locale}
      theme={themeConfig}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <AdminLayout><Users /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <AdminLayout><Orders /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AdminLayout><Analytics /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AdminLayout><Settings /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App