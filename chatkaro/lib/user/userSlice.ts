import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "../store";
import { useSelector } from "react-redux";
import axios from "axios"

type userLoginType = {
    login: boolean;
    userName: string
}


const userLogin: userLoginType = {
    login: false,
    userName: ""
}

export const loginUser = createAsyncThunk(
    "userLogin/loginUser",
    async (): Promise<userLoginType> => {
        const loginDetails = await axios.get("api/authentication/check-authentication", { withCredentials: true })
        return loginDetails.data.user
    }
)

const api = useSelector((state: RootState) => state.api)
const userSlice = createSlice({
    name: "userLogin",
    initialState: userLogin,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state: userLoginType, action: PayloadAction<userLoginType>) => {
            state = action.payload
        })
    }
})

export default userSlice.reducer