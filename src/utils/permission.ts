/**
 * 权限管理工具函数
 */

import type { UserRole, Permission, User } from '../types';

// 角色权限映射表
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // 管理员：拥有所有权限
  admin: [
    'dashboard:view',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:delete',
    'analytics:view',
    'settings:view',
    'settings:edit',
  ],
  // 编辑：可以查看和编辑大部分内容，但不能删除用户
  editor: [
    'dashboard:view',
    'users:view',
    'users:edit',
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:delete',
    'analytics:view',
    'settings:view',
  ],
  // 普通用户：只能查看
  user: [
    'dashboard:view',
    'users:view',
    'orders:view',
    'analytics:view',
  ],
};

/**
 * 检查用户是否有指定权限
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  
  // 获取用户角色对应的权限列表
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // 如果用户有自定义权限，优先使用自定义权限
  const userPermissions = user.permissions || rolePermissions;
  
  return userPermissions.includes(permission);
};

/**
 * 检查用户是否有指定角色
 */
export const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
};

/**
 * 检查用户是否有任一权限
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user || permissions.length === 0) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * 检查用户是否拥有所有指定权限
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user || permissions.length === 0) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * 获取用户的所有权限
 */
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user) return [];
  
  return user.permissions || ROLE_PERMISSIONS[user.role] || [];
};
