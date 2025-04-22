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


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PowerBiUser {
  power_bi_id: string;
  power_bi_email: string;
  power_bi_username: string;
  connection_status: string;
  connection_type: string;
}

interface ItemState {
  selectedItems: any;
  productState: any;
  customerID: number | null;
  inspectionData: any;
  item_id: number | null;
  power_bi_id: string | null;
  powerBiUsers: PowerBiUser[];
  isLoadingPowerBiUsers: boolean;
  powerBiError: string | null;
}

const initialState: ItemState = {
  selectedItems: {},
  productState: {},
  customerID: null,
  inspectionData: [],
  item_id: null,
  power_bi_id: null,
  powerBiUsers: [],
  isLoadingPowerBiUsers: false,
  powerBiError: null,
};

const ItemSlice = createSlice({
  name: "Item",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<any>) => {
      console.log("Dispatching addItem with data:", action.payload);
      state.selectedItems = action.payload;
      state.customerID = action.payload.customer_id;
      state.item_id = action.payload.item_id;
      state.power_bi_id = action.payload.power_bi_id || state.power_bi_id;
    },
    clearItem: (state) => {
      state.selectedItems = {};
      state.customerID = null;
      state.item_id = null;
      state.power_bi_id = null;
    },
    produtstate: (state, action: PayloadAction<any>) => {
      state.productState = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<number | null>) => {
      console.log("Setting customer ID in Redux:", action.payload);
      state.customerID = action.payload;
    },
    setinspectionData: (state, action: PayloadAction<Record<string, any>>) => {
      state.inspectionData = {
        ...state.inspectionData,
        ...action.payload,
      };
    },
    setItemId: (state, action: PayloadAction<number | null>) => {
      console.log("Setting item ID in Redux:", action.payload);
      state.item_id = action.payload;
    },
    setPowerBiId: (state, action: PayloadAction<string | null>) => {
      console.log("Setting Power BI ID in Redux:", action.payload);
      state.power_bi_id = action.payload;
      if (action.payload) {
        localStorage.setItem("power_bi_id", action.payload);
      } else {
        localStorage.removeItem("power_bi_id");
      }
    },
    setPowerBiUsers: (state, action: PayloadAction<PowerBiUser[]>) => {
      console.log("Setting Power BI users in Redux:", action.payload);
      state.powerBiUsers = action.payload;
      if (!state.power_bi_id && action.payload.length > 0) {
        const activeUser = action.payload.find(user => user.connection_status === "Active");
        if (activeUser) {
          state.power_bi_id = activeUser.power_bi_id;
          localStorage.setItem("power_bi_id", activeUser.power_bi_id);
        }
      }
    },
    setIsLoadingPowerBiUsers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPowerBiUsers = action.payload;
    },
    setPowerBiError: (state, action: PayloadAction<string | null>) => {
      console.log("Setting Power BI error in Redux:", action.payload);
      state.powerBiError = action.payload;
    },
    clearPowerBiState: (state) => {
      state.power_bi_id = null;
      state.powerBiUsers = [];
      state.isLoadingPowerBiUsers = false;
      state.powerBiError = null;
      localStorage.removeItem("power_bi_id");
    },
  },
});

export const {
  addItem,
  clearItem,
  produtstate,
  setinspectionData,
  setCustomerId,
  setItemId,
  setPowerBiId,
  setPowerBiUsers,
  setIsLoadingPowerBiUsers,
  setPowerBiError,
  clearPowerBiState,
} = ItemSlice.actions;

export default ItemSlice.reducer;
