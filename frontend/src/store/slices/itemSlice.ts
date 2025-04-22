// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface ItemState {
//   selectedItems: any;
//   productState: any;
//   customerID: any;
//   inspectionData: any;
//   item_id: number | null; // Add item_id to the state
// }

// const initialState: ItemState = {
//   selectedItems: {},
//   productState: {},
//   customerID: null,
//   inspectionData: [],
//   item_id: null, // Initialize item_id as null
// };

// const ItemSlice = createSlice({
//   name: "Item",
//   initialState,
//   reducers: {
//     addItem: (state, action: PayloadAction<any>) => {
//       console.log("Dispatching addItem with data:", action.payload);
//       state.selectedItems = action.payload;
//       state.customerID = action.payload.customer_id;
//       state.item_id = action.payload.item_id; // Save item_id from the payload
//     },
//     clearItem: (state) => {
//       state.selectedItems = {};
//       state.item_id = null; // Clear item_id when clearing the state
//     },
//     produtstate: (state, action: PayloadAction<any>) => {
//       state.productState = action.payload;
//     },
//     setCustomerId: (state, action: PayloadAction<number | null>) => {
//       console.log("Setting customer ID in Redux:", action.payload); // Debugging
//       state.customerID = action.payload;
//     },
//     setinspectionData: (state, action: PayloadAction<Record<string, any>>) => {
//       state.inspectionData = {
//         ...state.inspectionData, // Preserve existing inspection data
//         ...action.payload,
//       };
//     },
//     setItemId: (state, action: PayloadAction<number | null>) => {
//       console.log("Setting item ID in Redux:", action.payload); // Debugging
//       state.item_id = action.payload; // Add a new action to set item_id
//     },
//   },
// });

// // Export all actions
// export const {
//   addItem,
//   clearItem,
//   produtstate,
//   setinspectionData,
//   setCustomerId,
//   setItemId, // Export the new action
// } = ItemSlice.actions;

// export default ItemSlice.reducer;


import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store"; // Make sure you have these types defined

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
  powerBiUsers: [],
  powerBiUsersLoading: false,
  powerBiUsersError: null,
};

// Async thunk for fetching Power BI users
export const fetchPowerBiUsers = createAsyncThunk(
  'item/fetchPowerBiUsers',
  async ({ userId, connectionType }: { userId: number; connectionType: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/power-bi-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditly_user_id: userId,
          connection_type: connectionType,
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

const ItemSlice = createSlice({
  name: "Item",
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
    // You can keep this if you need to set users directly
    setPowerBiUsers: (state, action: PayloadAction<PowerBiUser[]>) => {
      state.powerBiUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
  setPowerBiUsers,
} = ItemSlice.actions;

export default ItemSlice.reducer;
