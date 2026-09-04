import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance.js"
const parseStoredData = () => {
    try {
        const raw = localStorage.getItem('data')
        if (!raw || raw === 'undefined' || raw === 'null') return {}
        return JSON.parse(raw)
    } catch {
        return {}
    }
}

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('role') || "",
    data: parseStoredData()
}


export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("user/register", data)
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to create account"
        })

        return (await res).data
    } catch (error) {
        const message = error?.response?.data?.message || "Failed to create account";
        toast.error(message);
        return rejectWithValue(message);
    }
})

export const login = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("user/login", data)
        toast.promise(res, {
            loading: "Wait! authentication in progress",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to login"
        })

        return (await res).data
    } catch (error) {
        const message = error?.response?.data?.message || "Failed to login";
        toast.error(message);
        return rejectWithValue(message);
    }
})

export const logout = createAsyncThunk("/auth/logout", async (_, { rejectWithValue }) => {
    try {
        const res = axiosInstance.get("user/logout")
        toast.promise(res, {
            loading: "Wait! logout in progress",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to logout"
        })
        return (await res).data
    } catch (error) {
        const message = error?.response?.data?.message || "Failed to logout";
        toast.error(message);
        return rejectWithValue(message);
    }
})
export const updateProfile = createAsyncThunk("/user/update", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1])
        toast.promise(res, {
            loading: "Wait! Profile update in progress",
            success: (data) => {
                return data?.data?.message || "Profile updated successfully"
            },
            error: "Failed to Update Profile"
        })
        return (await res).data
    } catch (error) {
        const message = error?.response?.data?.message || "Failed to Update Profile";
        toast.error(message);
        return rejectWithValue(message);
    }
})
export const getProfile = createAsyncThunk("/user/details", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`user/me`)
        return res.data
    } catch (error) {
        const message = error?.response?.data?.message || error.message || "Failed to get profile";
        toast.error(message);
        return rejectWithValue(message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createAccount.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true,
                state.data = action?.payload?.user,
                state.role = action?.payload?.user?.role
        })
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true,
                state.data = action?.payload?.user,
                state.role = action?.payload?.user?.role
        })
        .addCase(logout.fulfilled, (state) => {
                localStorage.clear()
                state.data = {}
                state.isLoggedIn = false
                state.role = ""
            })
        .addCase(getProfile.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action?.payload?.user))
                localStorage.setItem('isLoggedIn', true)
                localStorage.setItem('role', action?.payload?.user?.role)
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
        .addCase(getProfile.rejected, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";
            })
    }
})


// export const { } = authSlice.actions;

export default authSlice.reducer;