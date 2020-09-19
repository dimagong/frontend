import { createSlice } from "@reduxjs/toolkit";
import groupReducer from "app/reducers/group/groupReducer";


export const onboardingSlice = createSlice({
  name: "group",
  initialState: {
    groups: []
  },
  reducers: {
    ...groupReducer,
  },
});

export const {
    setGroups
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
