import { typeUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {} as typeUser,
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
      state.currentUser = null;
    },
  },
});

export const { updateUser, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
