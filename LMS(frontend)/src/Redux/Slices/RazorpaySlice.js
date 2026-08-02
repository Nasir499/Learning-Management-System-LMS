import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import  axiosInstance  from "../../Helpers/axiosinstance"

const initialState = {
    key:"",
    subscription_id:"",
    isPaymentVerified:false,
    allPayments:{},
    finalMonth:{},
    monthlySalesRecords:[]
};


export const getRazorPayId = createAsyncThunk("/razorpay/getId",async(_, { rejectWithValue })=>{
    try {
        const response = await axiosInstance.get("payments/razorpay-key");
        return response.data;
    } catch (error) {
        toast.error("Failed to get Razorpay API key");
        return rejectWithValue(error?.response?.data);
    }
})
export const purchaseCourseBundle = createAsyncThunk("/purchase",async(data, { rejectWithValue })=>{
    try {
        const response = await axiosInstance.post("payments/subscribe", data);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to subscribe course bundle");
        return rejectWithValue(error?.response?.data);
    }
})
export const verifyUserPayment = createAsyncThunk("/payments/verify",async(data, { rejectWithValue })=>{
    try {
        const response = await axiosInstance.post("payments/verify",{
        razorpay_payment_id : data.razorpay_payment_id,
        razorpay_subscription_id : data.razorpay_subscription_id,
        razorpay_payment_signature : data.razorpay_signature,
        })
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        return rejectWithValue(error?.response?.data);
    }
})
export const getPaymentRecords = createAsyncThunk("/payments/records",async(_, { rejectWithValue })=>{
    try {
        const response = await axiosInstance.get("payments?count=100");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        return rejectWithValue(error?.response?.data);
    }
})
export const cancelCourseBundle = createAsyncThunk("/payments/cancel",async(_, { rejectWithValue })=>{
    try {
        const response = await axiosInstance.post("payments/unsubscribe");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        return rejectWithValue(error?.response?.data);
    }
})


const razorPaySlice = createSlice({
    name: "razorPay",
    initialState,
    reducers: {
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getRazorPayId.fulfilled,(state,action)=>{
            state.key = action.payload?.key;
        })
        .addCase(getRazorPayId.rejected,(state)=>{
            state.key = "";
        })
        .addCase(purchaseCourseBundle.fulfilled,(state,action)=>{
            state.subscription_id = action?.payload?.subscription_id;
        })
        .addCase(purchaseCourseBundle.rejected,(state)=>{
            state.subscription_id = "";
        })
        .addCase(verifyUserPayment.fulfilled,(state,action)=>{
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(verifyUserPayment.rejected,(state,action)=>{
            toast.error(action?.payload?.message || "Payment verification failed");
            state.isPaymentVerified = false;
        })
        .addCase(getPaymentRecords.fulfilled,(state,action)=>{
            state.allPayments = action?.payload?.allPayments;
            state.finalMonth = action?.payload?.finalMonth;
            state.monthlySalesRecords = action?.payload?.monthlySalesRecords;
        })
        .addCase(getPaymentRecords.rejected,(state)=>{
            state.allPayments = {};
            state.monthlySalesRecords = [];
        })
        .addCase(cancelCourseBundle.rejected,(state)=>{
            state.subscription_id = "";
        })
    }
})

export default razorPaySlice.reducer;


