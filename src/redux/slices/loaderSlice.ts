import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  },
  reducers: {
    updateLoader: (state: any, action) => {
      state.loading = action.payload;
    },
  },
});

export const { updateLoader } = loaderSlice.actions;
export const isLoader = (state: any) => state?.loader?.loading;

export default loaderSlice.reducer;
