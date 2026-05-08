import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("tech_news_user")) || null,
    token: localStorage.getItem("tech_news_token") || null,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(
        "tech_news_user",
        JSON.stringify(action.payload.user),
      );
      localStorage.setItem("tech_news_token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("tech_news_user");
      localStorage.removeItem("tech_news_token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
