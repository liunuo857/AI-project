/**
 * Token 管理工具
 * 负责 Token 的存储、获取、刷新和清除
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * 存储访问令牌
 */
export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set access token:', error);
  }
};

/**
 * 获取访问令牌
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

/**
 * 存储刷新令牌
 */
export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set refresh token:', error);
  }
};

/**
 * 获取刷新令牌
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * 设置 Token 过期时间
 * @param expiresIn 过期时间（秒）
 */
export const setTokenExpiry = (expiresIn: number): void => {
  try {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to set token expiry:', error);
  }
};

/**
 * 获取 Token 过期时间
 */
export const getTokenExpiry = (): number | null => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  } catch (error) {
    console.error('Failed to get token expiry:', error);
    return null;
  }
};

/**
 * 检查 Token 是否过期
 * @param bufferTime 提前刷新的缓冲时间（秒），默认 5 分钟
 */
export const isTokenExpired = (bufferTime: number = 300): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  // 提前 bufferTime 秒认为 Token 已过期，以便提前刷新
  return Date.now() >= expiry - bufferTime * 1000;
};

/**
 * 存储完整的 Token 信息
 */
export const setTokens = (accessToken: string, refreshToken: string, expiresIn: number): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  setTokenExpiry(expiresIn);
};

/**
 * 清除所有 Token 信息
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * 检查用户是否已认证
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
};
