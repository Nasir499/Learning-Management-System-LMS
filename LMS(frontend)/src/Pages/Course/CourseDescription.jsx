import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import HomeLayout from "../../Layouts/HomeLayout"

function CourseDescription() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const {role,data} = useSelector((state) => state.auth)
    
    return (
        <HomeLayout>
            <div className="min-h-[90vh] py-10 px-4 sm:px-12 md:px-20 flex flex-col items-center justify-center text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 py-6 relative max-w-5xl w-full">
                    <div className="space-y-5">
                        <img 
                            className="w-full h-52 sm:h-64 object-cover rounded-lg shadow-lg"
                            alt="thumbnail"
                            src={state?.thumbnail?.secure_url}
                        />

                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-between text-base sm:text-xl gap-2">

                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Total lectures : {" "}
                                    </span>
                                    {state?.numberoflectures}
                                </p>

                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Instructor : {" "}
                                    </span>
                                    {state?.createdBy}
                                </p>

                            </div>

                            { role === "ADMIN" || data?.subscription?.status === "active" ? (
                                <button onClick={() => navigate("/course/displaylectures", {state: {...state}})} className="bg-yellow-600 text-lg sm:text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300 cursor-pointer">
                                    Watch lectures
                                </button>
                                ) : (
                                    <button onClick={() => navigate("/checkout")} className="bg-yellow-600 text-lg sm:text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300 cursor-pointer">
                                        Subscribe
                                    </button>
                                )

                            }
                        </div>
                       

                    </div>

                    <div className="space-y-4 text-base sm:text-lg">
                        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 text-center md:text-left">
                            {state?.title}
                        </h1>

                        <p className="text-yellow-500 font-semibold">Course description: </p>
                        <p className="text-gray-200 leading-relaxed">{state?.description}</p>
                    </div>
                </div>
            </div>
        </HomeLayout>

    )
}

export default CourseDescription
