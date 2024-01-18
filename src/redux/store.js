import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./features/activeUserSlice";
import authSlice from "./features/authSlice";
import chatsSlice from "./features/chatsSlice";
import profileSlice from "./features/profileSlice";
import searchSlice from "./features/searchSlice";

export const store = configureStore({
    reducer: {
        activeUser: activeUserSlice,
        auth: authSlice,
        profile: profileSlice,
        search: searchSlice,
        chats: chatsSlice,
    },
});

