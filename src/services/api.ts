/**
 * API 服务层
 * 统一的 HTTP 请求封装，包含请求拦截器和响应拦截器
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired } from '../utils/auth';
import type { ApiResponse, ApiError, LoginRequest, LoginResponse, RefreshTokenResponse } from '../types';

// API 基础 URL，可以通过环境变量配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 是否正在刷新 Token 的标志
let isRefreshing = false;
// 存储待重试的请求队列
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * 处理队列中的请求
 */
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 请求拦截器
 * 自动添加 Token 到请求头
 */
apiClient.interceptors.request.use(
  (config) => {
    // 检查 Token 是否即将过期（提前 5 分钟）
    if (isTokenExpired(300)) {
      // Token 即将过期，但不在刷新过程中，触发刷新
      // 注意：这里不阻塞当前请求，让响应拦截器处理
    }

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理响应和错误
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 统一处理业务错误码
    const { code, message: msg, data } = response.data;
    
    if (code === 200 || code === 0) {
      return response.data;
    } else {
      // 业务错误
      message.error(msg || '请求失败');
      return Promise.reject(new Error(msg || '请求失败'));
    }
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 处理 401 未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 正在刷新 Token，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        // 没有刷新令牌，清除所有信息并跳转到登录页
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // 调用刷新 Token 接口
        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;
        
        // 保存新的 Token
        setTokens(accessToken, newRefreshToken, expiresIn);
        
        // 更新原始请求的 Token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 处理队列中的请求
        processQueue(null, accessToken);
        isRefreshing = false;

        // 重试原始请求
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新 Token 失败，清除所有信息并跳转到登录页
        processQueue(refreshError, null);
        isRefreshing = false;
        clearTokens();
        message.error('登录已过期，请重新登录');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 处理其他错误
    const errorMessage = error.response?.data?.message || error.message || '网络请求失败';
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

/**
 * API 服务对象
 */
const api = {
  /**
   * GET 请求
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get(url, config);
  },

  /**
   * POST 请求
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT 请求
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put(url, data, config);
  },

  /**
   * DELETE 请求
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete(url, config);
  },

  /**
   * PATCH 请求
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.patch(url, data, config);
  },
};

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/auth/login', data);
  },

  /**
   * 用户登出
   */
  logout: (): Promise<ApiResponse<void>> => {
    return api.post('/auth/logout');
  },

  /**
   * 刷新 Token
   */
  refreshToken: (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    return api.post('/auth/refresh', { refreshToken });
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: (): Promise<ApiResponse<any>> => {
    return api.get('/auth/me');
  },
};

export default api;
