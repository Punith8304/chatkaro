import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
    name: "api",
    initialState: "http://localhost:8000/api",
    reducers: {

    }
})


export default apiSlice.reducer