import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PowerBiUser {
  power_bi_email: string;
  power_bi_username: string;
  power_bi_id: number;
  connection_type: string;
  connection_status: string;
}

interface ItemState {
  selectedItems: any;
  productState: any;
  customerID: any;
  inspectionData: any;
  item_id: number | null;
  agentId: number | null;
  powerBiUsers: PowerBiUser[];
  powerBiUsersLoading: boolean;
  powerBiUsersError: string | null;
}

const initialState: ItemState = {
  selectedItems: {},
  productState: {},
  customerID: null,
  inspectionData: [],
  item_id: null,
  agentId: null,
  powerBiUsers: [],
  powerBiUsersLoading: false,
  powerBiUsersError: null,
};

export const fetchPowerBiUsers = createAsyncThunk(
  'item/fetchPowerBiUsers',
  async (payload: { userId: number; connectionType: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/power-bi-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditly_user_id: payload.userId,
          connection_type: payload.connectionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Power BI users");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of users");
      }

      return data as PowerBiUser[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Power BI users");
    }
  }
);

export const deletePowerBiUser = createAsyncThunk(
  'item/deletePowerBiUser',
  async (payload: { email: string; userId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/power-bi-users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          power_bi_email: payload.email,
          power_bi_user_mapping_id: payload.userId,
          connection_type: "inbound",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete connection");
      }

      return payload.email; // Return the email of the deleted user
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete connection");
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<any>) => {
      state.selectedItems = action.payload;
      state.customerID = action.payload.customer_id;
      state.item_id = action.payload.item_id;
    },
    clearItem: (state) => {
      state.selectedItems = {};
      state.item_id = null;
      state.powerBiUsers = [];
    },
    produtstate: (state, action: PayloadAction<any>) => {
      state.productState = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<number | null>) => {
      state.customerID = action.payload;
    },
    setinspectionData: (state, action: PayloadAction<Record<string, any>>) => {
      state.inspectionData = {
        ...state.inspectionData,
        ...action.payload,
      };
    },
    setItemId: (state, action: PayloadAction<number | null>) => {
      state.item_id = action.payload;
    },
    setAgentId: (state, action: PayloadAction<number | null>) => {
      state.agentId = action.payload;
      if (action.payload !== null) {
        localStorage.setItem("agentId", action.payload.toString());
      } else {
        localStorage.removeItem("agentId");
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Power BI Users
      .addCase(fetchPowerBiUsers.pending, (state) => {
        state.powerBiUsersLoading = true;
        state.powerBiUsersError = null;
      })
      .addCase(fetchPowerBiUsers.fulfilled, (state, action) => {
        state.powerBiUsersLoading = false;
        state.powerBiUsers = action.payload;
      })
      .addCase(fetchPowerBiUsers.rejected, (state, action) => {
        state.powerBiUsersLoading = false;
        state.powerBiUsersError = action.payload as string;
      })
      // Delete Power BI User
      .addCase(deletePowerBiUser.fulfilled, (state, action) => {
        state.powerBiUsers = state.powerBiUsers.filter(
          user => user.power_bi_email !== action.payload
        );
      });
  },
});

export const {
  addItem,
  clearItem,
  produtstate,
  setinspectionData,
  setCustomerId,
  setItemId,
  setAgentId,
} = itemSlice.actions;

export const selectPowerBiUsers = (state: RootState) => state.ids.powerBiUsers;
export const selectPowerBiUsersLoading = (state: RootState) => state.ids.powerBiUsersLoading;
export const selectPowerBiUsersError = (state: RootState) => state.ids.powerBiUsersError;
export default itemSlice.reducer;
