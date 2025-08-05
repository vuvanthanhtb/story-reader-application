import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "./service.auth";
import type { LoginRequest } from "./model.auth";
import { setCache, clearAllCache } from "shared/cache";
import { TOKEN_CURRENT, REFRESH_TOKEN } from "shared/constants";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginRequest) => {
    const data = await AuthService.loginUser(payload);
    if (data) {
      setCache(TOKEN_CURRENT, data.accessToken);
      setCache(REFRESH_TOKEN, data.refreshToken);
      return true;
    }
    return false;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const data = await AuthService.getCurrentUser();

    return data;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // TODO:
  clearAllCache();
  window.location.href = "/login";
});

const initialState = {
  isLogin: false,
  currentUser: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLogin = action.payload;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export default auth.reducer;
