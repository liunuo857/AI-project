import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// 为整个应用定义 typed hooks
// 这样可以避免每次使用时都需要声明类型
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();