import { createSlice } from "@reduxjs/toolkit";

const postDataSlice = createSlice({
  name: "postData",
  initialState: { postData: {} },
  reducers: {
    getPostDocData: (state, action) => {
      state.postData = action.payload;
    },
  },
});

export const { getPostDocData } = postDataSlice.actions;
export default postDataSlice.reducer;
