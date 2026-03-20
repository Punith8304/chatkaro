import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios"
import { act } from "react";

type userLoginType = {
    login: boolean;
    userName: string;
    checkingStatus: string;
}


const userLogin: userLoginType = {
    login: false,
    userName: "",
    checkingStatus: "idle"
}

export const loginUser = createAsyncThunk(
    "userLogin/loginUser",
    async (): Promise<userLoginType> => {
        const loginDetails = await axios.get("http://localhost:8000/api/authentication/check-authentication", { withCredentials: true })
        return loginDetails.data.user
    }
)

const userSlice = createSlice({
    name: "userLogin",
    initialState: userLogin,
    reducers: {
        changeLogin(state: userLoginType, action: PayloadAction<{ login: boolean, userName: string }>) {
            return {
                login: action.payload.login,
                userName: action.payload.userName,
                checkingStatus: "success"
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state: userLoginType, action: PayloadAction<userLoginType>) => {
                return {...action.payload, checkingStatus: "success"}
            })
            .addCase(loginUser.pending, (state: userLoginType) => {
                state.checkingStatus = "loading"
            })
            .addCase(loginUser.rejected, (state: userLoginType) => {
                state.checkingStatus = "rejected"
            })
    }
})
export const { changeLogin } = userSlice.actions
export default userSlice.reducer