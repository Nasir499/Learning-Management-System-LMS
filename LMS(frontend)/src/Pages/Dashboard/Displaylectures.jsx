import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import HomeLayout from '../../Layouts/HomeLayout'
import { deleteCourseLectures, getCourseLectures } from '../../Redux/Slices/LectureSlice'


function Displaylectures() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state} = useLocation(); 
  const { lectures } = useSelector((state) => state?.lectures);
  const { role } = useSelector((state) => state.auth);
  const [currentVideo, setCurrentVideo] = useState(0);


  async function onLectureDelete(courseId, lectureId) {
   await dispatch(deleteCourseLectures({ courseId: courseId, lectureId: lectureId }));
   await dispatch(getCourseLectures(courseId));
  }


  useEffect(() => {
    if (!state) { navigate("/courses"); return; }
    dispatch(getCourseLectures(state._id))
  }, [dispatch, navigate, state])


  return (
    <HomeLayout>
      <div className='flex flex-col min-h-[90vh] gap-8 justify-center py-10 text-white max-w-7xl mx-auto px-4 sm:px-8 w-full'>

        <div className='text-center text-xl sm:text-2xl font-semibold text-yellow-500'>
          Course Name : {state?.title}
        </div>

        {(lectures && lectures.length > 0) ?
        (<div className='flex flex-col lg:flex-row justify-center items-start gap-8 w-full'>
          {/* Left section for playing video */}
          <div className='w-full lg:w-2/3 flex flex-col gap-4 shadow-[0_0_10px_black] p-3 sm:p-4 rounded-lg bg-gray-800/40 border border-gray-700'>
              {lectures && lectures[currentVideo]?.video?.secure_url ? (
                <video
                  src={lectures[currentVideo].video.secure_url}
                  className='object-cover rounded-lg w-full max-h-[450px]'
                  controls
                  autoPlay
                  controlsList='nodownload'
                  disablePictureInPicture
                />
              ) : (
                <div className='w-full h-64 sm:h-80 flex items-center justify-center bg-gray-800 rounded-lg'>
                  <p className='text-center text-gray-300'>Video not available for this lecture.</p>
                </div>
              )}

              <div className='space-y-2 p-1'>
                <h1 className='text-lg sm:text-xl font-bold'>
                  <span className='text-yellow-500'>
                    Title : {" "}
                  </span>
                  {lectures[currentVideo]?.title}
                </h1>
                <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
                  <span className='text-yellow-500 font-semibold'>
                    Description : {" "}
                  </span>
                  {lectures && lectures[currentVideo]?.description}
                </p>
            </div>

          </div>

          {/* Right section for lectures */}
          <div className='w-full lg:w-1/3 p-4 rounded-lg shadow-[0_0_10px_black] space-y-4 bg-gray-800/40 border border-gray-700'>
            <div className='font-semibold text-lg sm:text-xl text-yellow-500 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-700'>
              <p>Lecture List</p>
              {role === "ADMIN" && (
                <button onClick={()=>navigate(`/course/addlecture`,{state:{...state}})} className='bg-green-500 text-black hover:bg-green-600 transition-all duration-300 px-3 py-1.5 rounded-md font-semibold text-xs sm:text-sm cursor-pointer'>
                  Add New Lecture
                </button>
              )}
            </div>
            <ul className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
            {
              lectures &&
              lectures.map((lecture, idx) => {
                return (
                <li className={`p-3 rounded-md transition-all border ${currentVideo === idx ? 'bg-gray-700/90 border-yellow-500 shadow-md' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'}`} key={lecture._id}>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                <div className='cursor-pointer flex-1 flex items-center gap-2 font-semibold text-sm sm:text-base' onClick={() => setCurrentVideo(idx)}>
                  <span className='text-pink-500 shrink-0'>Lecture {idx + 1}:</span>
                  <span className='line-clamp-1'>{lecture.title}</span>
                  {currentVideo === idx && (
                    <span className='bg-yellow-500/20 text-yellow-500 border border-yellow-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ml-auto sm:ml-2'>
                      Playing
                    </span>
                  )}
                </div>
                {role === "ADMIN" && (
                  <button onClick={() => {
                    if (window.confirm('Delete this lecture? This action cannot be undone.')) {
                      onLectureDelete(state._id, lecture._id)
                    }
                  }} className='bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all px-2.5 py-1 text-xs rounded font-semibold cursor-pointer shrink-0'>
                    Delete
                  </button>
                )}
              </div>
            </li>
            )
          }
          )
            }
          </ul>
          </div>
        </div>):
        (
          <div className='flex flex-col items-center justify-center gap-6 py-20'>
            <p className='text-center text-gray-300 text-lg'>No lectures available for this course yet.</p>
            {role === "ADMIN" && (
              <button onClick={()=>navigate(`/course/addlecture`,{state:{...state}})} className='bg-green-500 text-black flex items-center justify-center hover:bg-green-600 duration-300 px-4 py-2 rounded-md font-semibold text-sm cursor-pointer'>
                Add New Lecture
              </button>
            )}
          </div>
        )
        }
      </div>
    </HomeLayout>
  )
}

export default Displaylectures;
