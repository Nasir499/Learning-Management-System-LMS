import aboutMainImage from "../Assets/aboutMainImage.png"
import apj from "../Assets/apj.png"
import billGates from "../Assets/billGates.png"
import einstein from "../Assets/einstein.png"
import nelsonMandela from "../Assets/nelsonMandela.png"
import steveJobs from "../Assets/steveJobs.png"
import HomeLayout from '../Layouts/HomeLayout'

function AboutUs() {
    return (
        <HomeLayout>
            <div className='px-6 md:px-16 py-6 flex flex-col justify-between items-center gap-6 text-white min-h-[85vh] max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-8 w-full mt-4'>
                    <section className='w-full md:w-1/2 space-y-4'>
                        <h1 className='text-3xl md:text-5xl text-yellow-500 font-bold leading-tight'>
                            Affordable and Quality Education
                        </h1>
                        <p className='text-base md:text-lg text-gray-200 leading-relaxed'>
                            Our goal is to provide Affordable and Quality Education to the world.
                            We are providing a platform to aspiring teachers and students to share
                            their skills, creativity, and knowledge with each other to empower and contribute
                            to the growth and wellness of mankind.
                        </p>
                    </section>

                    <div className='w-full md:w-1/2 flex justify-center'>
                        <img
                            src={aboutMainImage}
                            alt="About us illustration"
                            className='drop-shadow-2xl max-h-52 md:max-h-64 object-contain pointer-events-none'
                            style={{
                                filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.5))"
                            }}
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col items-center mb-4">
                    <div className="carousel w-full">
                        <div id="item1" className="carousel-item w-full justify-center">
                            <div className='flex flex-col items-center justify-center gap-2 px-4 md:px-12 text-center max-w-xl'>
                                <img
                                    src={apj}
                                    alt="APJ Abdul Kalam"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-400 object-cover" 
                                />
                                <p className='text-sm md:text-base text-gray-200 italic'>"The best brains of the nation may be found on the last benches of the classroom."</p>
                                <h3 className='text-base md:text-lg font-semibold text-yellow-500'>A.P.J. Abdul Kalam</h3>
                            </div>
                        </div>
                        <div id="item2" className="carousel-item w-full justify-center">
                            <div className='flex flex-col items-center justify-center gap-2 px-4 md:px-12 text-center max-w-xl'>
                                <img
                                    src={steveJobs}
                                    alt="Steve Jobs"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-400 object-cover" 
                                />
                                <p className='text-sm md:text-base text-gray-200 italic'>"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work."</p>
                                <h3 className='text-base md:text-lg font-semibold text-yellow-500'>Steve Jobs</h3>
                            </div>
                        </div>
                        <div id="item3" className="carousel-item w-full justify-center">
                            <div className='flex flex-col items-center justify-center gap-2 px-4 md:px-12 text-center max-w-xl'>
                                <img
                                    src={einstein}
                                    alt="Albert Einstein"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-400 object-cover" 
                                />
                                <p className='text-sm md:text-base text-gray-200 italic'>"Imagination is more important than knowledge."</p>
                                <h3 className='text-base md:text-lg font-semibold text-yellow-500'>Albert Einstein</h3>
                            </div>
                        </div>
                        <div id="item4" className="carousel-item w-full justify-center">
                            <div className='flex flex-col items-center justify-center gap-2 px-4 md:px-12 text-center max-w-xl'>
                                <img
                                    src={billGates}
                                    alt="Bill Gates"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-400 object-cover" 
                                />
                                <p className='text-sm md:text-base text-gray-200 italic'>"It's fine to celebrate success but it is more important to heed the lessons of failure."</p>
                                <h3 className='text-base md:text-lg font-semibold text-yellow-500'>Bill Gates</h3>
                            </div>
                        </div>
                        <div id="item5" className="carousel-item w-full justify-center">
                            <div className='flex flex-col items-center justify-center gap-2 px-4 md:px-12 text-center max-w-xl'>
                                <img
                                    src={nelsonMandela}
                                    alt="Nelson Mandela"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-400 object-cover" 
                                />
                                <p className='text-sm md:text-base text-gray-200 italic'>"It always seems impossible until it is done."</p>
                                <h3 className='text-base md:text-lg font-semibold text-yellow-500'>Nelson Mandela</h3>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 py-2">
                        <a href="#item1" className="btn btn-xs btn-circle">1</a>
                        <a href="#item2" className="btn btn-xs btn-circle">2</a>
                        <a href="#item3" className="btn btn-xs btn-circle">3</a>
                        <a href="#item4" className="btn btn-xs btn-circle">4</a>
                        <a href="#item5" className="btn btn-xs btn-circle">5</a>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AboutUs
