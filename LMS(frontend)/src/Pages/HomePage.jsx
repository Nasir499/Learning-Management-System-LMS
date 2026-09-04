import { Link } from 'react-router-dom';

import abc from '../Assets/homePageMainImage.png';
import HomeLayout from '../Layouts/HomeLayout'

function HomePage() {
    return (
        <HomeLayout>
            <div className='py-10 text-white flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-10 px-4 sm:px-16 min-h-[90vh]'>
                <div className='w-full lg:w-1/2 space-y-6 text-center lg:text-left'>
                    <h1 className='text-3xl sm:text-5xl font-semibold leading-tight'>
                        Find out Best &nbsp;
                        <span className='text-yellow-500 font-bold block sm:inline'>
                            Online Courses
                        </span>
                    </h1>
                    <p className='text-lg sm:text-xl text-gray-300'>
                        Discover a variety of online courses tailored to your needs.
                    </p>

                    <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
                        <Link to="/courses" className="w-full sm:w-auto">
                            <button className='w-full sm:w-auto bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300'>Explore Courses</button>
                        </Link>

                        <Link to="/contact" className="w-full sm:w-auto">
                            <button className='w-full sm:w-auto border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-500 transition-all ease-in-out duration-300'>Contact Us</button>
                        </Link>

                    </div>
                </div>

                <div className='w-full lg:w-1/2 flex items-center justify-center'>
                    <img src={abc} alt="Description" className='max-w-xs sm:max-w-md lg:max-w-full rounded-lg shadow-[0_0_10px_black] object-contain' />
                </div>

            </div>
        </HomeLayout>
    )
}

export default HomePage
