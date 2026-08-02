import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { uploadToCloudinaryDirect } from '../../Helpers/cloudinaryDirect'
import HomeLayout from '../../Layouts/HomeLayout'
import { addCourseLectures } from '../../Redux/Slices/LectureSlice'

function AddLecture() {
    const courseDetails = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({
        progress: 0,
        bytesUploaded: 0,
        totalBytes: 0,
        uploadSpeed: 0,
        estimatedTimeRemaining: 0
    });

    const [userInput,setUserInput] = useState({
        id:courseDetails.state._id,
        lecture:undefined,
        title:"",
        description:"",
        videoSrc:""
    });


    function handleInputChange(e){
        const {name,value} = e.target;
        setUserInput({
            ...userInput,
            [name]:value
        })
    }

    function handleVideo(e){
        const video = e.target.files[0];
        if (!video) return;
        if (userInput.videoSrc) {
            window.URL.revokeObjectURL(userInput.videoSrc);
        }
        const src = window.URL.createObjectURL(video);
        console.log(src);

        setUserInput({
            ...userInput,
            lecture:video,
            videoSrc:src
        })
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function formatSpeed(bytesPerSecond) {
        return formatBytes(bytesPerSecond) + '/s';
    }

    function formatTime(seconds) {
        if (seconds < 60) {
            return Math.round(seconds) + 's';
        } else if (seconds < 3600) {
            return Math.round(seconds / 60) + 'm ' + Math.round(seconds % 60) + 's';
        } else {
            return Math.round(seconds / 3600) + 'h ' + Math.round((seconds % 3600) / 60) + 'm';
        }
    }

    async function onFormSubmit(event){
        event.preventDefault();
        if(!userInput.title || !userInput.description || !userInput.videoSrc) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsUploading(true);

        try {
            // If file is large, use direct client-to-Cloudinary upload to avoid server payload limits
            const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10 MB
            let attachResult = null;

            if (userInput.lecture && userInput.lecture.size > LARGE_FILE_THRESHOLD) {
                // 1) upload directly to Cloudinary
                const cloudResult = await uploadToCloudinaryDirect(userInput.lecture, 'lms', (progress) => {
                    setUploadProgress(progress);
                });
                // 2) tell server to attach metadata to course
                const rawApiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const cleanBase = rawApiBase.replace(/\/api\/v1\/?$/, '');
                const attachResp = await fetch(`${cleanBase}/api/v1/course/${userInput.id}/attach`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: userInput.title, description: userInput.description, public_id: cloudResult.public_id, secure_url: cloudResult.secure_url })
                });
                const attachJson = await attachResp.json();
                if (!attachResp.ok) throw new Error(attachJson?.message || `Attach failed with status ${attachResp.status}`);
                attachResult = attachJson;
            } else {
                // Use existing server upload path which reports progress
                const response = await dispatch(addCourseLectures({
                    ...userInput,
                    onProgress: (progress) => {
                        setUploadProgress(progress);
                    }
                }));

                if (response?.error) {
                    // Thunk was rejected
                    const errMsg = response.payload?.message || response.error?.message || 'Upload failed';
                    toast.error(errMsg);
                    setIsUploading(false);
                    return;
                }

                attachResult = response?.payload;
                if (!attachResult?.success) {
                    toast.error(attachResult?.message || 'Upload failed');
                    setIsUploading(false);
                    return;
                }
            }

            // success
            toast.success('Lecture added successfully');
            navigate(-1)
            setUserInput({
                id:courseDetails.state._id,
                lecture:undefined,
                title:"",
                description:"",
                videoSrc:""
            })
            setUploadProgress({
                progress: 0,
                bytesUploaded: 0,
                totalBytes: 0,
                uploadSpeed: 0,
                estimatedTimeRemaining: 0
            })

        } catch (err) {
            // Friendly error messages for common server errors
            const msg = err?.message || 'Failed to upload lecture';
            toast.error(msg);
            console.error('Add lecture error:', err);
        } finally {
            setIsUploading(false);
        }
    }

    useEffect(()=>{
        if(!courseDetails) navigate("/courses");
    },[courseDetails, navigate])

  return (
    <HomeLayout>
      <div className='min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16'>
            <div className='flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg'>
                <header className='flex items-center justify-center relative'>
                    <button className='absolute left-2 text-xl text-green-500 cursor-pointer' onClick={()=>navigate(-1)}>
                        <AiOutlineArrowLeft/>
                    </button>
                    <h1 className='text-xl text-yellow-500 font-semibold '>Add Lecture</h1>
                </header>
                <form
                onSubmit={onFormSubmit}
                className='flex flex-col gap-3'
                >
                    <input
                    type="text"
                    name='title'
                    onChange={handleInputChange}
                    value={userInput.title}
                    placeholder='Title'
                    className='p-2 rounded-md bg-slate-800'
                    disabled={isUploading}
                    />
                    <textarea
                    type="text"
                    name='description'
                    onChange={handleInputChange}
                    value={userInput.description}
                    placeholder='Description'
                    className='p-2 rounded-md bg-slate-800 resize-none h-40 overflow-auto'
                    disabled={isUploading}
                    />
                    {userInput.videoSrc ?(
                        <div className='flex flex-col gap-3'>
                            <video
                            src={userInput.videoSrc}
                            controls
                            className='w-full h-50 object-cover'
                            ></video>
                            {isUploading && (
                                <div className='flex flex-col gap-2'>
                                    <div className='w-full bg-gray-600 rounded-full h-2 overflow-hidden'>
                                        <div
                                            className='bg-green-500 h-full transition-all duration-300'
                                            style={{ width: `${uploadProgress.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className='flex justify-between text-xs text-gray-300'>
                                        <span>{uploadProgress.progress}% • {formatBytes(uploadProgress.bytesUploaded)} / {formatBytes(uploadProgress.totalBytes)}</span>
                                        <span>{formatSpeed(uploadProgress.uploadSpeed)}</span>
                                    </div>
                                    <div className='text-xs text-gray-400 text-center'>
                                        {uploadProgress.progress >= 95 ? 'Processing video...' : `ETA: ${formatTime(uploadProgress.estimatedTimeRemaining)}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    :(
                        <div className='h-48 border flex items-center justify-center cursor-pointer'>
                            <label htmlFor="lecture" className='font-semibold text-xl cursor-pointer'>Choose Video</label>
                            <input
                            onChange={handleVideo}
                            type="file"
                            className='hidden'
                            name='lecture'
                            id='lecture'
                            accept="video/*"
                            disabled={isUploading}
                            />
                        </div>
                    )
                    }
                    <button
                        type='submit'
                        className='p-2 bg-green-500 rounded-md cursor-pointer hover:bg-green-600 transition-all ease-in-out duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed'
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Add'}
                    </button>

                </form>
            </div>
      </div>
    </HomeLayout>
  )
}

export default AddLecture
