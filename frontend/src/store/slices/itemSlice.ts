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

interface InspectionData {
  factory_seal: boolean;
  no_factory_seal: boolean;
  minimal_tear: boolean;
  no_package: boolean;
  new_condition: boolean;
  not_new_condition: boolean;
  bio_stains: boolean;
  package_stains: boolean;
}

interface ItemState {
  selectedItems: any;
  productState: any;
  customerID: any;
  inspectionData: InspectionData | null;
  item_id: number | null;
}

const initialState: ItemState = {
  selectedItems: {},
  productState: {},
  customerID: null,
  inspectionData: null,
  item_id: null,
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
    },
    clearItem: (state) => {
      state.selectedItems = {};
      state.item_id = null;
      state.inspectionData = null;
    },
    produtstate: (state, action: PayloadAction<any>) => {
      state.productState = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<number | null>) => {
      console.log("Setting customer ID in Redux:", action.payload);
      state.customerID = action.payload;
    },
    setinspectionData: (state, action: PayloadAction<Partial<InspectionData>>) => {
      state.inspectionData = {
        ...(state.inspectionData || {}),
        ...action.payload,
      } as InspectionData;
    },
    setItemId: (state, action: PayloadAction<number | null>) => {
      console.log("Setting item ID in Redux:", action.payload);
      state.item_id = action.payload;
    },
    clearInspectionData: (state) => {
      state.inspectionData = null;
    },
  },
});

// Export selectors
export const selectInspectionData = (state: { item: ItemState }) => state.item.inspectionData;

// Export all actions
export const {
  addItem,
  clearItem,
  produtstate,
  setinspectionData,
  setCustomerId,
  setItemId,
  clearInspectionData,
} = ItemSlice.actions;

export default ItemSlice.reducer;
