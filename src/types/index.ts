// 角色类型
export type UserRole = 'admin' | 'editor' | 'user';

// 权限类型
export type Permission = 
  | 'dashboard:view'
  | 'users:view' 
  | 'users:create' 
  | 'users:edit' 
  | 'users:delete'
  | 'orders:view' 
  | 'orders:create' 
  | 'orders:edit' 
  | 'orders:delete'
  | 'analytics:view'
  | 'settings:view' 
  | 'settings:edit';

// 用户信息类型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions?: Permission[];
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Token 过期时间（秒）
}

// Token 刷新响应类型
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// API 错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// 系统设置类型
export interface SystemSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US' | 'ja-JP';
  notifications: boolean;
  emailNotifications: boolean;
}

// 用户状态类型
export interface UserState {
  userInfo: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  settings: SystemSettings;
}
