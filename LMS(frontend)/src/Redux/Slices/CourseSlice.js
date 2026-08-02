import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance.js";

const initialState = {
    courseData: []
}

export const getAllCourses = createAsyncThunk("/course/get", async (_, { rejectWithValue }) => {
    try {
        const response = axiosInstance.get("course");
        toast.promise(response, {
            loading: "loading course data...",
            success: "Courses loaded successfully",
            error: "Failed to get the courses",
        });

        return (await response).data.courses;
    } catch(error) {
        const msg = error?.response?.data?.message || "Failed to get courses";
        toast.error(msg);
        return rejectWithValue(msg);
    }
}); 

export const deleteCourse = createAsyncThunk("/course/delete", async (id, { rejectWithValue }) => {
    try {
        const response = axiosInstance.delete(`course/${id}`);
        toast.promise(response, {
            loading: "deleting course ...",
            success: "Courses deleted successfully",
            error: "Failed to delete the courses",
        });

        return (await response).data;
    } catch(error) {
        const msg = error?.response?.data?.message || "Failed to delete course";
        toast.error(msg);
        return rejectWithValue(msg);
    }
}); 

export const createNewCourse = createAsyncThunk("/course/create", async (data, { rejectWithValue }) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);

        const response = axiosInstance.post("course", formData);
        toast.promise(response, {
            loading: "Creating new course",
            success: "Course created successfully",
            error: "Failed to create course"
        });

        return (await response).data
    } catch(error) {
        const msg = error?.response?.data?.message || "Failed to create course";
        toast.error(msg);
        return rejectWithValue(msg);
    }
});

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if(action.payload) {
                state.courseData = [...action.payload];
            }
        })
    }
});

export default courseSlice.reducer;