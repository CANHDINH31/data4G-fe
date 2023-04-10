import { UserType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    logout: state => {
      state.currentUser = {} as UserType;
    },
  },
});

export const { updateUser, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
