import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: {} },
  reducers: {
    getUserData: (state, action) => {
      state.user = action.payload;
    },
    logoutuser: (state) => {
      state.user = null;
    },
  },
});

export const { getUserData, logoutuser } = userSlice.actions;
export default userSlice.reducer;
