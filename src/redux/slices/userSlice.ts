import { createSlice } from "@reduxjs/toolkit";

const savedUserInfo = localStorage?.getItem('user_info');
const initialState = {
    user_info: savedUserInfo ? JSON?.parse(savedUserInfo) : {},
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user_info = action?.payload;
         },
        logout: (state) => {
            state.user_info = {};
         },
        update: (state, action) => {
            if (state) {
                state.user_info = {
                    ...state?.user_info,
                    ...action?.payload,
                };
             }
        }
    }
});

export const { login, logout, update } = userSlice?.actions;
export default userSlice.reducer;
