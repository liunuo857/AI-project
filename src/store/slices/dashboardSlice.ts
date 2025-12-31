import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 定义仪表板状态类型
export interface DashboardState {
  statistics: {
    userCount: number;
    orderCount: number;
    revenue: number;
    growth: number;
  };
  loading: boolean;
  error: string | null;
}

// 模拟获取仪表板数据的异步操作
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟返回的数据
      return {
        userCount: 12345,
        orderCount: 678,
        revenue: 98765.43,
        growth: 12.5,
      };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 初始状态
const initialState: DashboardState = {
  statistics: {
    userCount: 0,
    orderCount: 0,
    revenue: 0,
    growth: 0,
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStatistics: (state, action: PayloadAction<Partial<DashboardState['statistics']>>) => {
      state.statistics = {
        ...state.statistics,
        ...action.payload,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.statistics = payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateStatistics, clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;