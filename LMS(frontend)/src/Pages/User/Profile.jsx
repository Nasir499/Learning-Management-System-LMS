import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getProfile } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

function Profile() {
  const dispatch = useDispatch();
   const userData = useSelector((state)=> state?.auth?.data);

   useEffect(() => {
       dispatch(getProfile());
   }, [dispatch]);

   async function handleCancelation() {
        await dispatch(cancelCourseBundle())
        await dispatch(getProfile())
        toast.success("Course bundle cancelled successfully")
   }

  return (
    <HomeLayout>
        <div className="min-h-[90vh] flex items-center justify-center py-10 px-4">
                <div className="my-5 flex flex-col gap-4 rounded-lg p-5 text-white w-full max-w-md shadow-[0_0_10px_black]">
                   <img 
                        src={userData?.avatar?.secure_url} 
                        className="w-36 h-36 m-auto rounded-full border-black border object-cover"
                    />
                    <h2 className="text-xl font-semibold text-center capitalize">
                            {userData?.fullName}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 text-sm sm:text-base border-t border-b border-gray-700 py-3">
                        <p className="font-semibold text-gray-300">Email:</p><p className="break-all">{userData?.email}</p>
                        <p className="font-semibold text-gray-300">Role:</p><p>{userData?.role}</p>
                        <p className="font-semibold text-gray-300">Subscription:</p><p>{userData?.subscription?.status === "active" ? "Active" : "Inactive"}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-3">
                        <Link to="/user/changepassword" className="w-full sm:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                          <button className="w-full">Change Password</button>
                        </Link>
                        <Link to="/user/editprofile" className="w-full sm:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                          <button className="w-full">Edit Profile</button>
                        </Link>
                    </div>
                    {userData?.subscription?.status === 'active' && (
                        <button onClick={handleCancelation} className="w-full bg-red-600 mt-2 py-2 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold cursor-pointer text-center">
                            Cancel Subscription
                        </button>
                    )}
                </div>
        </div>
    </HomeLayout>
  )
}

export default Profile
