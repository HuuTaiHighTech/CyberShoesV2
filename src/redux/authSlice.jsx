import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "./apiSlice";

const loadStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem("userLogin");
  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);
    return typeof user?.accessToken === "string" && user.accessToken
      ? user
      : null;
  } catch (error) {
    console.error("Không thể đọc thông tin đăng nhập đã lưu:", error);
    return null;
  }
};

const storedUser = loadStoredUser();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    accessToken: storedUser?.accessToken || null,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
