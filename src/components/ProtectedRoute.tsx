/**
 * 路由守卫组件
 * 保护需要认证的路由，未认证用户将被重定向到登录页
 * 支持基于角色和权限的访问控制
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchCurrentUser } from '../store/slices/userSlice';
import { getAccessToken, isTokenExpired } from '../utils/auth';
import { hasAnyPermission, hasRole } from '../utils/permission';
import { getRouteConfig } from '../config/routes';
import type { UserRole, Permission } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // 允许访问的角色（可选）
  roles?: UserRole[];
  // 需要的权限（满足任一即可，可选）
  permissions?: Permission[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles, 
  permissions 
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, userInfo } = useAppSelector((state) => state.user);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      
      // 没有 Token，直接标记为未认证
      if (!token) {
        setIsChecking(false);
        return;
      }

      // Token 已过期，直接标记为未认证
      if (isTokenExpired()) {
        setIsChecking(false);
        return;
      }

      // 有 Token 但没有用户信息，尝试获取用户信息
      if (!userInfo && !loading) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, userInfo, loading]);

  // 正在检查认证状态，显示加载中
  if (isChecking || loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 未认证，重定向到登录页，并保存当前路径
  if (!isAuthenticated || !getAccessToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已认证，检查权限
  if (userInfo) {
    // 从路由配置中获取权限要求
    const routeConfig = getRouteConfig(location.pathname);
    const requiredRoles = roles || routeConfig?.roles;
    const requiredPermissions = permissions || routeConfig?.permissions;

    // 检查角色权限
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(userInfo, requiredRoles)) {
        return <Navigate to="/forbidden" replace />;
      }
    }

    // 检查功能权限
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!hasAnyPermission(userInfo, requiredPermissions)) {
        return <Navigate to="/forbidden" replace />;
      }
    }
  }

  // 已认证且有权限，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
