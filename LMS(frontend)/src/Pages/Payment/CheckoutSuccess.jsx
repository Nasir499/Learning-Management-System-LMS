import { useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import HomeLayout from '../../Layouts/HomeLayout'
import { getProfile } from '../../Redux/Slices/AuthSlice';

function CheckoutSuccess() {
  const dispatch = useDispatch();
 useEffect(()=>{dispatch(getProfile())})
  return (
    <HomeLayout>
        <div className='min-h-[90vh] py-10 px-4 flex items-center justify-center text-white'>
                <div className='w-full max-w-sm flex flex-col justify-between items-center shadow-[0_0_10px_black] rounded-lg relative overflow-hidden bg-gray-800/40 border border-gray-700 min-h-[24rem] pb-5'>
                        <h1 className='bg-green-500 w-full py-4 text-xl sm:text-2xl font-bold text-center text-black'>Payment Successful</h1>

                        <div className='p-5 flex flex-col items-center justify-center space-y-4 text-center my-auto'>
                                <div className='space-y-2'>
                                    <h2 className='text-lg font-semibold'>
                                        Welcome to provat kaku pvt limited
                                    </h2>
                                    <p className='text-sm text-gray-300'>
                                        Now enjoy your learning
                                    </p>
                                </div>
                                <AiFillCheckCircle className='text-green-500 text-6xl'/>
                        </div>
                        
                        <Link to='/' className='w-4/5 bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 rounded-md font-semibold py-2.5 cursor-pointer text-center text-black'><button className="w-full">Go to Home</button></Link>
                </div>
        </div>
    </HomeLayout>
  )
}

export default CheckoutSuccess
