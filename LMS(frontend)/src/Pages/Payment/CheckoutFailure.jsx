import { Link } from 'react-router-dom'

import HomeLayout from '../../Layouts/HomeLayout'

function CheckoutFailure() {
  return (
    <HomeLayout>
        <div className='min-h-[90vh] py-10 px-4 flex items-center justify-center text-white'>
                <div className='w-full max-w-sm flex flex-col justify-between items-center shadow-[0_0_10px_black] rounded-lg relative overflow-hidden bg-gray-800/40 border border-gray-700 min-h-[24rem] pb-5'>
                        <h1 className='bg-red-500 w-full py-4 text-xl sm:text-2xl font-bold text-center text-white'>Payment Failed</h1>

                        <div className='p-5 flex flex-col items-center justify-center space-y-4 text-center my-auto'>
                                <div className='space-y-2'>
                                    <h2 className='text-lg font-semibold'>
                                        Oops!! Your payment failed
                                    </h2>
                                    <p className='text-sm text-gray-300'>
                                        Please try again
                                    </p>
                                </div>
                        </div>
                        
                        <Link to='/checkout' className='w-4/5 bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 rounded-md font-semibold py-2.5 cursor-pointer text-center text-white'><button className="w-full">Try Again</button></Link>
                </div>
        </div>
    </HomeLayout>
  )
}

export default CheckoutFailure
