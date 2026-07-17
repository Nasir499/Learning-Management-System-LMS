import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    progress: 0,
    bytesUploaded: 0,
    totalBytes: 0,
    uploadSpeed: 0,
    estimatedTimeRemaining: 0,
    isUploading: false,
}

const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        updateUploadProgress: (state, action) => {
            const { progress, bytesUploaded, totalBytes, uploadSpeed, estimatedTimeRemaining } = action.payload;
            state.progress = progress;
            state.bytesUploaded = bytesUploaded;
            state.totalBytes = totalBytes;
            state.uploadSpeed = uploadSpeed;
            state.estimatedTimeRemaining = estimatedTimeRemaining;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        resetUploadProgress: (state) => {
            state.progress = 0;
            state.bytesUploaded = 0;
            state.totalBytes = 0;
            state.uploadSpeed = 0;
            state.estimatedTimeRemaining = 0;
            state.isUploading = false;
        }
    }
})

export const { updateUploadProgress, setIsUploading, resetUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
