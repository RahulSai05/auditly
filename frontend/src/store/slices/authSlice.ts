// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";

// interface UserData {
//   user_id?: number;
//   "User ID"?: number; // For /verify-login-opt API
//   is_inspection_user?: boolean;
//   is_agent?: boolean;
//   is_admin?: boolean;
//   is_reports_user?: boolean;  // Add this for completeness
//   "User Type"?: string[];    // Add this to match your API response
//   // Add other fields as needed
// }

// interface AuthState {
//   user: UserData | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginUser: (state, action: PayloadAction<UserData>) => {
//       // Normalize API data here
//       const apiData = action.payload;
//       state.user = {
//         user_id: apiData.user_id || apiData["User ID"],
//         is_inspection_user: apiData.is_inspection_user || apiData["User Type"]?.includes("inspection_user"),
//         is_agent: apiData.is_agent || apiData["User Type"]?.includes("agent"),
//         is_admin: apiData.is_admin || apiData["User Type"]?.includes("admin"),
//       };
//       state.isAuthenticated = true;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { loginUser, logoutUser } = authSlice.actions;

// // Selectors
// export const selectCurrentUser = (state: RootState) => state.auth.user;
// export const selectIsInspectionUser = (state: RootState) => 
//   state.auth.user?.is_inspection_user || false;
// export const selectIsAgent = (state: RootState) => 
//   state.auth.user?.is_agent || false;

// export default authSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserData {
  user_id?: number;
  "User ID"?: number; // For /verify-login-opt API

  // flags from backend
  is_inspection_user?: boolean;
  is_agent?: boolean;
  is_admin?: boolean;
  is_reports_user?: boolean;
  is_manager?: boolean;

  // NEW: approval flag
  is_active?: boolean;

  // Some APIs send this
  "User Type"?: string[];

  // Any other fields
  [key: string]: any;
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
      const apiData = action.payload;

      const userTypes = apiData["User Type"] || [];

      state.user = {
        user_id: apiData.user_id ?? apiData["User ID"],

        is_inspection_user:
          apiData.is_inspection_user ?? userTypes.includes("inspection_user"),

        is_agent: apiData.is_agent ?? userTypes.includes("agent"),

        is_manager: apiData.is_manager ?? userTypes.includes("manager"),

        is_admin: apiData.is_admin ?? userTypes.includes("admin"),

        is_reports_user:
          apiData.is_reports_user ?? userTypes.includes("reports_user"),

        // ✅ NEW: approved/active flag
        // default to false if not present to be safe
        is_active: apiData.is_active ?? false,

        // keep original user types too (optional but useful)
        "User Type": userTypes,
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

export const selectIsManager = (state: RootState) =>
  state.auth.user?.is_manager || false;

export const selectIsActiveUser = (state: RootState) =>
  state.auth.user?.is_active || false;

export default authSlice.reducer;