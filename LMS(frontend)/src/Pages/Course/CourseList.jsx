import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";

function CourseCardSkeleton() {
  return (
    <div className="w-full max-w-[22rem] sm:w-[22rem] h-[430px] rounded-lg bg-zinc-800 border border-zinc-700 animate-pulse flex flex-col justify-between overflow-hidden">
      <div className="h-48 bg-zinc-700 w-full"></div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="h-6 bg-zinc-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-full"></div>
          <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
        </div>
        <div className="pt-3 border-t border-zinc-700 space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
          <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

function CourseList() {
   const dispatch = useDispatch();

   const { courseData } = useSelector((state) => state.course);
   
   useEffect(() => {
      dispatch(getAllCourses());
   }, [dispatch]);


  return (
    <HomeLayout>
        <div className="min-h-[90vh] py-10 px-4 sm:px-12 md:px-20 flex flex-col items-center justify-center gap-10 text-white max-w-7xl mx-auto">
                <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-2">
                    Explore the courses made by&nbsp;               
                    <span className="font-bold text-yellow-500 block sm:inline">
                        Industry Experts
                    </span>
                </h1>
                <div className="mb-10 flex flex-wrap justify-center items-stretch gap-8 sm:gap-14 w-full">
                      {!courseData ? (
                        [1, 2, 3].map((n) => <CourseCardSkeleton key={n} />)
                      ) : courseData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                          <p className="text-xl text-gray-300">No courses available at the moment.</p>
                          <p className="text-sm text-gray-400">Check back later for new course releases!</p>
                        </div>
                      ) : (
                        courseData.map((element) => (
                          <CourseCard key={element._id} data={element} />
                        ))
                      )}
                </div>
                
        </div>
    </HomeLayout>
  )
}

export default CourseList
