import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getProfile, updateProfile } from "../../Redux/Slices/AuthSlice";

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.data);
    const userId = userData?._id;

    const [data, setData] = useState({
        previewImage: userData?.avatar?.secure_url || "",
        fullName: userData?.fullName || "",
        avatar: undefined,
        userId: userId
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadImage = e.target.files[0];
        if (uploadImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadImage);
            fileReader.addEventListener('load', function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadImage
                });
            });
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!data.fullName) {
            toast.error("Name field is mandatory");
            return;
        }
        if (data.fullName.length < 3) {
            toast.error("Name should have at least 3 characters");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }

        await dispatch(updateProfile([data.userId, formData]));
        await dispatch(getProfile());
        navigate("/user/profile");
    }
  
  return (
    <HomeLayout>
        <div className="flex items-center justify-center min-h-[90vh] py-10 px-4">
            <form 
               noValidate  
               onSubmit={onFormSubmit}
               className="flex flex-col justify-center gap-5 rounded-md p-5 text-white w-full max-w-sm min-h-[26rem] shadow-[0_0_10px_black]"            
            >
                        <h1 className="text-center text-2xl font-semibold">
                            Edit Profile
                        </h1>
                        <label htmlFor="image_uploads" className="cursor-pointer">
                                {data.previewImage ? (
                                <img src={data.previewImage}
                                  className="w-28 h-28 rounded-full m-auto object-cover"
                                />
                                ):(
                                    <BsPersonCircle className="w-28 h-28 rounded-full m-auto"/>
                                )}
                        </label>
                        <input type="file"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image_uploads"
                          name="image_uploads"
                          accept='.jpg,.jpeg,.png,.svg'
                         />

                         <div className="flex flex-col gap-1">
                            <label htmlFor="fullName" className="text-lg font-semibold">Full Name</label>
                            <input 
                               type="text"
                               required
                               name="fullName"
                               id="fullName"
                               placeholder="Enter Your Name"
                               className="bg-transparent px-2 py-1.5 border rounded-sm w-full"
                               value={data.fullName}
                               onChange={handleInputChange}
                             />
                         </div>
                         <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer font-semibold">
                            Update Profile
                         </button>
                         <Link to="/user/profile">
                              <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                                <AiOutlineArrowLeft/>    Go back to Profile
                              </p>
                         </Link>
            </form>

        </div>
    </HomeLayout>
  )
}

export default EditProfile
