import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import axiosInstance from "../../Helpers/axiosinstance"
import HomeLayout from "../../Layouts/HomeLayout"
import { getProfile } from "../../Redux/Slices/AuthSlice"

function CourseDescription() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    const { role, data } = useSelector((state) => state.auth)

    const isCourseCreator = role === "INSTRUCTOR" && (
        state?.createdBy?.trim().toLowerCase() === data?.fullName?.trim().toLowerCase() ||
        state?.createdBy?.trim().toLowerCase() === data?.email?.trim().toLowerCase()
    );

    const isEnrolled = data?.enrolledCourses?.some(
        c => c.courseId === state?._id || c.courseId?._id === state?._id
    );

    const canWatchLectures = role === "ADMIN" || isCourseCreator || isEnrolled || data?.subscription?.status === "active";

    async function handleBuyCourse() {
        if (!data?._id) {
            toast.error("Please login to purchase this course");
            navigate("/login");
            return;
        }

        try {
            const keyRes = await axiosInstance.get("/payments/razorpay-key");
            const razorpayKey = keyRes?.data?.key;

            const orderRes = await axiosInstance.post(`/payments/course-order/${state._id}`);
            const orderData = orderRes?.data?.order;

            if (!orderData) {
                toast.error("Failed to initialize course purchase");
                return;
            }

            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: "INR",
                name: "LMS Portal",
                description: `Enroll in ${state?.title}`,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axiosInstance.post("/payments/verify-course", {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: state._id
                        });

                        if (verifyRes?.data?.success) {
                            toast.success("Course purchased successfully!");
                            await dispatch(getProfile());
                            navigate("/course/displaylectures", { state: { ...state } });
                        }
                    } catch (err) {
                        toast.error(err?.response?.data?.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: data?.fullName || "",
                    email: data?.email || ""
                },
                theme: {
                    color: "#EAB308"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to initiate course purchase");
        }
    }

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

                                <p className="font-semibold text-green-400">
                                    <span className="text-yellow-500 font-bold">
                                        Price : {" "}
                                    </span>
                                    ₹{state?.price || 499}
                                </p>

                            </div>

                            { canWatchLectures ? (
                                <button onClick={() => navigate("/course/displaylectures", {state: {...state}})} className="bg-yellow-600 text-lg sm:text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300 cursor-pointer">
                                    Watch lectures
                                </button>
                                ) : (
                                    <button onClick={handleBuyCourse} className="bg-yellow-600 text-lg sm:text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300 cursor-pointer">
                                        Buy Course (₹{state?.price || 499})
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
