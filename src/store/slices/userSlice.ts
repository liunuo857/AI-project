import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockAuthApi } from '../../services/mockApi';
import { setTokens, clearTokens } from '../../utils/auth';
import type { UserState, LoginRequest, User } from '../../types';

// 登录异步操作
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await mockAuthApi.login(credentials);
      const { user, accessToken, refreshToken, expiresIn } = response.data;
      
      // 保存 Token 到 localStorage
      setTokens(accessToken, refreshToken, expiresIn);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '登录失败');
    }
  }
);

// 登出异步操作
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await mockAuthApi.logout();
      // 清除本地 Token
      clearTokens();
    } catch (error: any) {
      // 即使登出 API 失败，也要清除本地 Token
      clearTokens();
      return rejectWithValue(error.response?.data?.message || '登出失败');
    }
  }
);

// 获取当前用户信息
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAuthApi.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取用户信息失败');
    }
  }
);

// 从 localStorage 加载用户状态
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('userState');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        userInfo: parsed.userInfo || null,
        isAuthenticated: parsed.isAuthenticated || false,
        settings: parsed.settings || {
          theme: 'light',
          language: 'zh-CN',
          notifications: true,
          emailNotifications: true,
        }
      };
    }
  } catch (e) {
    console.error('Failed to load user state from localStorage', e);
  }
  
  // 返回默认状态
  return {
    userInfo: null,
    isAuthenticated: false,
    settings: {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      emailNotifications: true,
    }
  };
};

// 初始状态
const initialState: UserState = {
  userInfo: loadUserFromStorage().userInfo,
  isAuthenticated: loadUserFromStorage().isAuthenticated,
  loading: false,
  error: null,
  settings: loadUserFromStorage().settings,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 更新系统设置
    updateSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
      
      // 保存完整用户状态到 localStorage
      try {
        const userState = {
          userInfo: state.userInfo,
          isAuthenticated: state.isAuthenticated,
          settings: state.settings,
        };
        localStorage.setItem('userState', JSON.stringify(userState));
      } catch (e) {
        console.error('Failed to save user state to localStorage', e);
      }
    },
    // 设置用户信息（用于初始化时从 localStorage 恢复）
    setUser: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload;
        state.error = null;
        
        // 保存完整用户状态到 localStorage
        try {
          const userState = {
            userInfo: state.userInfo,
            isAuthenticated: state.isAuthenticated,
            settings: state.settings,
          };
          localStorage.setItem('userState', JSON.stringify(userState));
        } catch (e) {
          console.error('Failed to save user state to localStorage', e);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload as string;
      })
      // 登出
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = null;
        
        // 清除 localStorage 中的用户状态
        try {
          localStorage.removeItem('userState');
        } catch (e) {
          console.error('Failed to remove user state from localStorage', e);
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // 即使登出失败，也清除本地状态
        state.isAuthenticated = false;
        state.userInfo = null;
        
        try {
          localStorage.removeItem('userState');
        } catch (e) {
          console.error('Failed to remove user state from localStorage', e);
        }
      })
      // 获取当前用户信息
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // 获取用户信息失败，清除认证状态
        state.isAuthenticated = false;
        state.userInfo = null;
        clearTokens();
      });
  },
});

export const { clearError, updateSettings, setUser } = userSlice.actions;

export default userSlice.reducer;