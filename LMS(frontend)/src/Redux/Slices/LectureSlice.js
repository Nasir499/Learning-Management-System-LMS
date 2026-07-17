import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    lectures: []
}


export const getCourseLectures = createAsyncThunk("/course/lecture/get", async (cid) => {
    try {
        const response = axiosInstance.get(`/course/${cid}`);
        toast.promise(response, {
            loading: "Getting Lectures...",
            success: "Lectures loaded successfully",
            error: "Failed to get Lectures",
        });
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const addCourseLectures = createAsyncThunk("/course/lecture/add", async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("lecture", data.lecture);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const startTime = Date.now();
        const totalBytes = data.lecture.size;

        const response = axiosInstance.post(`/course/${data.id}`, formData, {
            onUploadProgress: (progressEvent) => {
                const bytesUploaded = progressEvent.loaded;

                // Some environments/servers don't provide progressEvent.total (chunked transfer).
                // Fall back to the known file size supplied by the client (totalBytes).
                const total = progressEvent.total || totalBytes || 0;

                // Protect against division by zero / NaN
                let progress = 0;
                if (total > 0) {
                    progress = Math.round((bytesUploaded / total) * 100);
                    progress = Math.min(progress, 95); // reserve last % for server processing
                }

                const elapsedSeconds = Math.max((Date.now() - startTime) / 1000, 0.001); // avoid divide by zero
                const uploadSpeed = bytesUploaded / elapsedSeconds;
                const remainingBytes = Math.max(total - bytesUploaded, 0);
                const estimatedTimeRemaining = uploadSpeed > 0 ? Math.max(remainingBytes / uploadSpeed, 0) : 0;

                if (data.onProgress) {
                    data.onProgress({
                        progress,
                        bytesUploaded,
                        totalBytes: total,
                        uploadSpeed,
                        estimatedTimeRemaining
                    });
                }
            }
        });

        return (await response).data
    } catch (error) {
        const errMsg = error?.response?.data?.message || error.message || 'Upload failed';
        toast.error(errMsg)
        return rejectWithValue({ message: errMsg, status: error?.response?.status });
    }
})

export const deleteCourseLectures = createAsyncThunk("/course/lecture/delete", async (data) => {
    try {

        const response = axiosInstance.delete(`/course?courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(response, {
            loading: "Deleting Lectures...",
            success: "Lectures Deleted successfully",
            error: "Failed to delete Lectures",
        });
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})


const lectureSlice = createSlice({
    name: "lectures",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
             builder
            .addCase(getCourseLectures.fulfilled, (state, action) => {
                state.lectures = action?.payload?.lectures
            })
            .addCase(addCourseLectures.fulfilled, (state, action) => {
                state.lectures = action?.payload?.course?.lectures
            })

    }
})

export default lectureSlice.reducer;
