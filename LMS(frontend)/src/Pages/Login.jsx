import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import HomeLayout from '../Layouts/HomeLayout'
import { login } from '../Redux/Slices/AuthSlice'

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [LoginData,setLoginData] = useState({
        email:'',
        password:'',
    })

    function handleUserInput(e){
        const {name,value} = e.target;
        setLoginData({
            ...LoginData,
            [name]:value
        })
    }

    async function onLogin(e){
        e.preventDefault();
        if(!LoginData.email  || !LoginData.password ){
                toast.error("Please fill all the details")
                return;
        }
        

        // dispatch create account action
        const response = await dispatch(login(LoginData))
        if(response?.payload?.success) navigate('/')
       
        setLoginData({
        email:'',
        password:'',
      })
    }

  return (
    <HomeLayout>
        <div className='flex items-center justify-center min-h-[90vh] py-10 px-4'>
            <form noValidate onSubmit={onLogin} className='flex flex-col justify-center gap-4 rounded-lg p-5 text-white w-full max-w-md shadow-[0_0_10px_black]'>
                <h1 className='text-center text-2xl font-bold'>Login Page</h1>
                 <div className='flex flex-col gap-1'>
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input
                     type="email"
                     required
                     name='email'
                     id='email'
                     placeholder='Enter your Email'
                     className='bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all'
                     onChange={handleUserInput}
                     value={LoginData.email}
                      />
                 </div>
        
                 <div className='flex flex-col gap-1'>
                    <label htmlFor="password" className='font-semibold text-gray-200'>Password</label>
                    <input
                     type="password"
                     required
                     name='password'
                     placeholder='Enter your Password'
                     className='bg-transparent px-3 py-2 border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all'
                     id='password'
                     onChange={handleUserInput}
                     value={LoginData.password}
                      />
                 </div>

                 <button type="submit" className='w-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 py-2.5 rounded-md transition-all ease-in-out duration-300 font-bold cursor-pointer mt-2 text-black shadow-md'>
                    Login
                 </button>

                 <p className="text-center">
                    Do not have an account? <Link to='/signup'><span className='text-blue-600 font-semibold'>Register</span></Link>
                 </p>
            </form>
        </div>
    </HomeLayout>
  )
}

export default Login
