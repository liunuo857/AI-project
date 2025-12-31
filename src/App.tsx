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

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: themeAlgorithm,
      }}
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