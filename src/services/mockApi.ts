/**
 * Mock API 服务
 * 模拟后端 API 响应，用于前端开发和测试
 */

import type { ApiResponse, LoginRequest, LoginResponse, User, RefreshTokenResponse } from '../types';

// 模拟延迟
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据库
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    role: 'admin' as const,
  },
  {
    id: 2,
    username: 'editor',
    password: '123456',
    email: 'editor@example.com',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    role: 'editor' as const,
  },
  {
    id: 3,
    username: 'user',
    password: '123456',
    email: 'user@example.com',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    role: 'user' as const,
  },
];

// 生成模拟 Token
const generateToken = (userId: number): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// 生成模拟 Refresh Token
const generateRefreshToken = (userId: number): string => {
  return `mock_refresh_token_${userId}_${Date.now()}`;
};

/**
 * Mock 认证 API
 */
export const mockAuthApi = {
  /**
   * 模拟登录
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    await delay();

    // 查找用户
    const user = mockUsers.find(
      (u) => u.username === data.username && u.password === data.password
    );

    if (!user) {
      return Promise.reject({
        response: {
          data: {
            code: 401,
            message: '用户名或密码错误',
          },
        },
      });
    }

    // 生成 Token
    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // 返回登录成功响应
    return {
      code: 200,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        accessToken,
        refreshToken,
        expiresIn: 7200, // 2 小时
      },
    };
  },

  /**
   * 模拟登出
   */
  logout: async (): Promise<ApiResponse<void>> => {
    await delay(300);

    return {
      code: 200,
      message: '登出成功',
      data: undefined,
    };
  },

  /**
   * 模拟刷新 Token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    await delay(500);

    // 简单验证 refresh token 格式
    if (!refreshToken || !refreshToken.startsWith('mock_refresh_token_')) {
      return Promise.reject({
        response: {
          data: {
            code: 401,
            message: 'Refresh Token 无效',
          },
        },
      });
    }

    // 从 token 中提取用户 ID（实际项目中应该从后端验证）
    const userId = 1; // 这里简化处理

    // 生成新的 Token
    const newAccessToken = generateToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    return {
      code: 200,
      message: 'Token 刷新成功',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 7200,
      },
    };
  },

  /**
   * 模拟获取当前用户信息
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(400);

    // 从 localStorage 获取用户信息（实际项目中应该从后端获取）
    const userState = localStorage.getItem('userState');
    if (userState) {
      const parsed = JSON.parse(userState);
      if (parsed.userInfo) {
        return {
          code: 200,
          message: '获取成功',
          data: parsed.userInfo,
        };
      }
    }

    // 如果没有用户信息，返回默认用户
    return {
      code: 200,
      message: '获取成功',
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
        role: 'admin',
      },
    };
  },
};
