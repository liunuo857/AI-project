import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 用户接口定义（用于用户管理页面）
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;  // 这里的 role 是显示用的中文角色名
  status: string;
}

// 用户状态接口
interface UsersState {
  users: User[];
  loading: boolean;
}

// 初始状态
const initialState: UsersState = {
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '激活' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: '激活' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: '禁用' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: '激活' },
    { id: 5, name: '孙七', email: 'sunqi@example.com', role: '用户', status: '激活' },
  ],
  loading: false,
};

// 创建 slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // 添加用户
    addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newId = state.users.length > 0 
        ? Math.max(...state.users.map(u => u.id)) + 1 
        : 1;
      const newUser: User = {
        id: newId,
        ...action.payload,
      };
      state.users.unshift(newUser);
    },

    // 更新用户
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    // 删除单个用户
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },

    // 批量删除用户
    batchDeleteUsers: (state, action: PayloadAction<number[]>) => {
      state.users = state.users.filter(u => !action.payload.includes(u.id));
    },

    // 批量更新用户状态
    batchUpdateUserStatus: (state, action: PayloadAction<{ ids: number[]; status: string }>) => {
      const { ids, status } = action.payload;
      state.users = state.users.map(u => 
        ids.includes(u.id) ? { ...u, status } : u
      );
    },

    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// 导出 actions
export const {
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  batchUpdateUserStatus,
  setLoading,
} = usersSlice.actions;

// 导出 reducer
export default usersSlice.reducer;
