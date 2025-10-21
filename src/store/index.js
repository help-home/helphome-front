import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    // 여기에 추가 slice reducers를 추가합니다
  },
});
