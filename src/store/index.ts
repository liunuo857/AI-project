import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import dashboardReducer from './slices/dashboardSlice';
import ordersReducer from './slices/ordersSlice';
import usersReducer from './slices/usersSlice';

// Redux Persist 配置
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // 可以选择性地持久化某些 reducer
  // whitelist: ['user', 'orders'], // 只持久化这些
  // blacklist: ['dashboard'], // 不持久化这些
};

// 合并所有 reducers
const rootReducer = combineReducers({
  user: userReducer,
  dashboard: dashboardReducer,
  orders: ordersReducer,
  users: usersReducer,
});

// 创建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的 action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 创建 persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;