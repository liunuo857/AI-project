/**
 * 路由权限配置
 */

import type { UserRole, Permission } from '../types';

export interface RouteConfig {
  path: string;
  name: string;
  // 允许访问的角色列表（为空表示所有角色都可以访问）
  roles?: UserRole[];
  // 需要的权限（满足任一即可）
  permissions?: Permission[];
  // 是否在菜单中显示
  showInMenu?: boolean;
  // 菜单图标（可选）
  icon?: string;
}

/**
 * 路由权限配置表
 */
export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  '/dashboard': {
    path: '/dashboard',
    name: '仪表板',
    permissions: ['dashboard:view'],
    showInMenu: true,
  },
  '/users': {
    path: '/users',
    name: '用户管理',
    permissions: ['users:view'],
    showInMenu: true,
  },
  '/orders': {
    path: '/orders',
    name: '订单管理',
    permissions: ['orders:view'],
    showInMenu: true,
  },
  '/analytics': {
    path: '/analytics',
    name: '数据统计',
    permissions: ['analytics:view'],
    showInMenu: true,
  },
  '/settings': {
    path: '/settings',
    name: '系统设置',
    permissions: ['settings:view'],
    showInMenu: true,
  },
};

/**
 * 获取路由配置
 */
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return ROUTE_CONFIGS[path];
};

/**
 * 获取所有菜单路由
 */
export const getMenuRoutes = (): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(route => route.showInMenu);
};
