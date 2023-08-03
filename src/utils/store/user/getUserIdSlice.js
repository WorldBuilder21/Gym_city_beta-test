import { createSlice } from "@reduxjs/toolkit";

const getUserIdSlice = createSlice({
  name: "userId",
  initialState: { userId: {} },
  reducers: {
    getUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { getUserId } = getUserIdSlice.actions;
export default getUserIdSlice.reducer;
