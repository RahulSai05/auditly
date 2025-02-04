import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./slices/itemSlice";

export const store = configureStore({
    reducer: {
        ids: itemReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
