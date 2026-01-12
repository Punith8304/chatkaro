import { configureStore, Store } from "@reduxjs/toolkit";
import apiReducer from "./api/apiSlice"
import LoginReducer from "./user/userSlice"


export const store = configureStore({
    reducer: {
        api: apiReducer,
        userLogin: LoginReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
