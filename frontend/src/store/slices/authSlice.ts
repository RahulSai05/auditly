import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserData {
  user_id?: number;
  "User ID"?: number; // For /verify-login-opt API
  is_inspection_user?: boolean;
  is_agent?: boolean;
  is_admin?: boolean;
  is_reports_user?: boolean;  // Add this for completeness
  "User Type"?: string[];    // Add this to match your API response
  // Add other fields as needed
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserData>) => {
      // Normalize API data here
      const apiData = action.payload;
      state.user = {
        user_id: apiData.user_id || apiData["User ID"],
        is_inspection_user: apiData.is_inspection_user || apiData["User Type"]?.includes("inspection_user"),
        is_agent: apiData.is_agent || apiData["User Type"]?.includes("agent"),
        is_admin: apiData.is_admin || apiData["User Type"]?.includes("admin"),
      };
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsInspectionUser = (state: RootState) => 
  state.auth.user?.is_inspection_user || false;
export const selectIsAgent = (state: RootState) => 
  state.auth.user?.is_agent || false;

export default authSlice.reducer;
