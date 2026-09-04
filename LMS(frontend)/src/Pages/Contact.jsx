import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axiosinstance";
import { isEmail } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout"

function Contact() {
  const [userInput,setUserInput] = useState({
    name: "",
    email: "",
    message: ""
  })  

  const handleInputChange = (e)=>{
    const {name,value} = e.target;
    console.log(name,value);
    
    setUserInput({
      ...userInput,
      [name]: value
    })
  }
  const onFormSubmit =async(e) => {
    e.preventDefault();
    if(!userInput.name || !userInput.email || !userInput.message) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = axiosInstance.post("/contact", userInput)
      toast.promise(response, {
        loading: "Sending...",
        success: "Message sent successfully!",
        error: "Error sending message"
      })
      const contactResponse = await response;
      if(contactResponse?.data?.success){
        setUserInput({
          name: "",
          email: "",
          message: ""
        })
      }
    } catch {
      toast.error("Failed to send message. Please try again later."); 
    }
  }
  return (
    <HomeLayout>
        <div className="flex items-center justify-center min-h-[90vh] py-10 px-4">
            <form className="flex flex-col items-center justify-center gap-3 p-5 rounded-md text-white shadow-[0_0_10px_black] w-full max-w-sm" noValidate onSubmit={onFormSubmit}>
                    <h1 className="text-3xl font-semibold">
                        Contact Form
                    </h1>

                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="name" className="text-lg font-semibold text-gray-200">Name</label>
                        <input 
                         type="text" 
                         className="bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all" 
                         id="name"
                          name="name" 
                          placeholder="Enter your name" 
                          onChange={handleInputChange}
                          value={userInput.name}
                          />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="email" className="text-lg font-semibold text-gray-200">Email</label>
                        <input 
                         type="email" 
                         className="bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all" 
                         id="email"
                         name="email"
                         placeholder="Enter your email" 
                         onChange={handleInputChange}
                         value={userInput.email}
                          />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="message" className="text-lg font-semibold text-gray-200">Message</label>
                        <textarea 
                         className="bg-transparent px-3 py-2 border border-gray-600 rounded-md resize-none h-36 w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all" 
                         id="message"
                         name="message"
                         placeholder="Enter your message" 
                         onChange={handleInputChange}
                         value={userInput.message}
                          />
                    </div>

                    <button type="submit"
                      className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2.5 text-lg cursor-pointer mt-2 text-white shadow-md"
                    >
                        Submit 
                    </button>
            </form>
        </div>
    </HomeLayout>
  )
}

export default Contact
