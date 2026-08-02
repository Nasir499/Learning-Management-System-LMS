import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosinstance"

const initialState ={
    allUserCount:0,
    subscribedCount:0
}

export const getStatData = createAsyncThunk("/stat/get",async(_, { rejectWithValue })=>{
    try {
        const res =  axiosInstance.get("/admin/stats/users")
        toast.promise(res,{
            loading:"Getting Statistics...",
            success:"Statistics loaded successfully",
            error:"Failed to get Statistics"
        })
        return (await res).data;
    } catch (error) {
        const msg = error?.response?.data?.message || "Failed to get statistics";
        toast.error(msg);
        return rejectWithValue(msg);
    }
})

const statSlice = createSlice({
    name:"stat",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getStatData.fulfilled,(state,action)=>{
            state.allUserCount = action?.payload?.allUsersCount
            state.subscribedCount = action?.payload?.subscribedUsersCount
        })

    }
})

export default statSlice.reducer