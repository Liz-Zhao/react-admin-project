// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice'

// 创建 Redux store
const store = configureStore({
  reducer: {
    app: appReducer
  },
});

export default store;