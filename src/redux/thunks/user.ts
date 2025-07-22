import { update } from "@/redux/slices/userSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const refreshTokenThunk = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, dispatch }) => {
    const state = getState() as any;
    const refreshToken = state.user?.user_info?.tokens?.refresh?.token;

    interface RefreshResponse {
      tokens: any; // Replace 'any' with your actual tokens type if available
      [key: string]: any;
    }

    const res = await axios.post<RefreshResponse>(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );

    // ✅ dispatch the updated tokens to Redux
    dispatch(update({ tokens: res.data.tokens }));

    // ✅ persist to localStorage if you're using that
    const updatedUserInfo = {
      ...state.user?.user_info,
      tokens: res.data.tokens,
    };
    localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));

    return res.data.tokens;
  }
);
