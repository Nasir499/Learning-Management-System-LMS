import { useState } from "react"
import toast from "react-hot-toast"
import {  AiOutlineArrowLeft } from "react-icons/ai"
import { useDispatch } from "react-redux"
import {Link, useNavigate} from "react-router-dom"

import HomeLayout from "../../Layouts/HomeLayout"
import { createNewCourse } from "../../Redux/Slices/CourseSlice"

function CreateCourse() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userInput,setUserInput] = useState({
        title:"",
        category:"",
        createdBy:"",
        description:"",
        thumbnail:null,
        previewImage:""
    })
    function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const reader = new FileReader();
            reader.readAsDataURL(uploadedImage);
            reader.addEventListener("load", () => {
                setUserInput({
                    ...userInput,
                    thumbnail: uploadedImage,
                    previewImage: reader.result
                });
            });
        }
    }

    function handleUserInput(e){
        const { name, value } = e.target;
        setUserInput((prevInput) => ({
            ...prevInput,
            [name]: value
        }));
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.title || !userInput.category || !userInput.createdBy || !userInput.description || !userInput.thumbnail) {
            // Handle form validation error
            toast.error("Please fill in all fields");
            return;
        }
        // Dispatch the create course action
        const response = await dispatch(createNewCourse(userInput));
        if (response?.payload?.success) {
            toast.success("Course created successfully");
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: ""
            });
            navigate('/courses');
        }
    }
  return (
    <HomeLayout>
        <div className="flex items-center justify-center min-h-[90vh] py-10 px-4">
            <form
            noValidate
            onSubmit={onFormSubmit}
            className="flex flex-col justify-center gap-5 rounded-lg p-5 text-white w-full max-w-[700px] my-5 shadow-[0_0_10px_black] relative"
            >

                <Link onClick={()=>navigate(-1)} className="absolute top-6 left-4 link cursor-pointer text-accent">
                    <AiOutlineArrowLeft size={22}/>
                </Link>

                <h1 className="text-2xl font-bold text-center mt-2">
                    Create New Course
                </h1>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10">
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <label 
                            htmlFor="image_uploads" 
                            className="cursor-pointer"
                            >
                                {  userInput.previewImage ? (
                                    <img 
                                        src={userInput.previewImage} 
                                        alt="Preview"
                                        className="w-full h-44 m-auto border object-cover rounded-sm"
                                           />
                                    ) : (
                                        <div className="w-full h-44 m-auto flex justify-center items-center border border-dashed rounded-sm hover:border-yellow-500 transition-all">
                                            <h1 className="font-bold text-lg text-gray-300">Upload Image</h1>
                                        </div>
                                    )
                                      }
                            </label>

                            <input 
                              type="file" 
                              className="hidden"
                              id="image_uploads"
                              accept=".jpg, .jpeg, .png"
                              name="image_uploads"
                              onChange={handleImageUpload}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-200" htmlFor="title" >
                                       Course Title
                                </label>
                                <input 
                                type="text" 
                                required
                                name="title"
                                id="title"
                                placeholder="Enter course title"
                                className="bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all"
                                value={userInput.title}
                                onChange={handleUserInput}
                                />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-200" htmlFor="createdBy" >
                                      Instructor
                                </label>
                                <input 
                                type="text" 
                                required
                                name="createdBy"
                                id="createdBy"
                                placeholder="Enter course Instructor"
                                className="bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all"
                                value={userInput.createdBy}
                                onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-200" htmlFor="category" >
                                      Course Category
                                </label>
                                <input
                                type="text"
                                required
                                name="category"
                                id="category"
                                placeholder="Enter course Category"
                                className="bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all"
                                value={userInput.category}
                                onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-200" htmlFor="description" >
                                      Course Description
                                </label>
                                <textarea
                                required
                                name="description"
                                id="description"
                                placeholder="Enter course Description"
                                className="bg-transparent px-3 py-2 h-24 overflow-y-auto resize-none border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all"
                                value={userInput.description}
                                onChange={handleUserInput}
                                />
                            </div>
                    </div>

                </main>
                
                <button type="submit" className="w-full py-2.5 rounded-sm font-semibold text-lg cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300">
                    Create Course
                </button>
              </form>
        </div>
    </HomeLayout>
  )
}

export default CreateCourse
