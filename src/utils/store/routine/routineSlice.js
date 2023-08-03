import { createSlice } from "@reduxjs/toolkit";

const routineSlice = createSlice({
  name: "routine",
  initialState: { routine: {} },
  reducers: {
    getRoutineData: (state, action) => {
      state.routine = action.payload;
    },
  },
});

export const { getRoutineData } = routineSlice.actions;
export default routineSlice.reducer;
