import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  selectedItems: any;
  productState: any;
  customerID: any;
  inspectionData: any;
}

const initialState: ItemState = {
  selectedItems: {},
  productState: {},
  customerID: null, // Set to `null` initially
  inspectionData: [],
};

const ItemSlice = createSlice({
  name: "Item",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<any>) => {
      console.log("Dispatching addItem with data:", action.payload);
      state.selectedItems = action.payload;
      state.customerID = action.payload.customer_id;
  },
    clearItem: (state) => {
      state.selectedItems = {};
    },
    produtstate: (state, action: PayloadAction<any>) => {
      state.productState = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<number | null>) => {
      console.log("Setting customer ID in Redux:", action.payload); // Debugging
      state.customerID = action.payload;
  },
   
    setinspectionData: (state, action: PayloadAction<Record<string, any>>) => {
      state.inspectionData = {
        ...state.inspectionData, // Preserve existing inspection data
        ...action.payload,
      };
    },
  },
});

// Ensure all required actions are exported
export const { addItem, clearItem, produtstate, setinspectionData, setCustomerId } = ItemSlice.actions;
export default ItemSlice.reducer;
