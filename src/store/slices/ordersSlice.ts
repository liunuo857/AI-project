import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
}

const initialOrders: Order[] = [
  { id: 'ORD001', customer: '张三', product: '产品A', amount: 299.00, status: '已完成', date: '2023-05-15 14:30' },
  { id: 'ORD002', customer: '李四', product: '产品B', amount: 199.50, status: '待发货', date: '2023-05-16 09:15' },
  { id: 'ORD003', customer: '王五', product: '产品C', amount: 599.00, status: '配送中', date: '2023-05-16 11:20' },
  { id: 'ORD004', customer: '赵六', product: '产品D', amount: 89.90, status: '已取消', date: '2023-05-15 16:45' },
  { id: 'ORD005', customer: '孙七', product: '产品E', amount: 1299.00, status: '已完成', date: '2023-05-17 10:30' },
  { id: 'ORD006', customer: '周八', product: '产品F', amount: 45.00, status: '待付款', date: '2023-05-17 13:20' },
];

const initialState: OrdersState = {
  orders: initialOrders,
  loading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // 添加订单
    addOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'status'>>) => {
      const newOrderId = `ORD${String(state.orders.length + 1).padStart(3, '0')}`;
      const newOrder: Order = {
        id: newOrderId,
        ...action.payload,
        status: '待付款',
        date: dayjs().format('YYYY-MM-DD HH:mm'),
      };
      state.orders = [newOrder, ...state.orders];
    },
    
    // 删除订单
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    
    // 批量删除订单
    batchDeleteOrders: (state, action: PayloadAction<string[]>) => {
      state.orders = state.orders.filter(order => !action.payload.includes(order.id));
    },
    
    // 更新订单状态
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    
    // 批量更新订单状态
    batchUpdateOrderStatus: (state, action: PayloadAction<{ ids: string[]; status: string }>) => {
      state.orders = state.orders.map(order =>
        action.payload.ids.includes(order.id)
          ? { ...order, status: action.payload.status }
          : order
      );
    },
    
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addOrder,
  deleteOrder,
  batchDeleteOrders,
  updateOrderStatus,
  batchUpdateOrderStatus,
  setLoading,
} = ordersSlice.actions;

export default ordersSlice.reducer;
