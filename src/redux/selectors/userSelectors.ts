import { RootState } from "@/redux/store";

export const selectUserInfo = (state: RootState) => state?.user?.user_info;
