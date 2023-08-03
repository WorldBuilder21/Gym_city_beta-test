import { createSlice } from "@reduxjs/toolkit";

const userdocDataSlice = createSlice({
  name: "userdoc",
  initialState: { userdoc: {} },
  reducers: {
    getUserDocData: (state, action) => {
      state.userdoc = action.payload;
    },
    clearState: (state, action) => {
      state.userdoc = null;
    },
  },
});

export const { getUserDocData, clearState } = userdocDataSlice.actions;
export default userdocDataSlice.reducer;
