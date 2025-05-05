import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./slices/itemSlice";
import authReducer from "./slices/authSlice"; // Add this import

export const store = configureStore({
  reducer: {
    ids: itemReducer, // Your existing item slice
    auth: authReducer, // New auth slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
