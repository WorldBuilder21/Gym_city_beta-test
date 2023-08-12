import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: { message: {} },
  reducers: {
    getMessageData: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { getMessageData } = messageSlice.actions;
export default messageSlice.reducer;
