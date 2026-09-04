import { useState, useEffect } from "react";
import aboutMainImage from "../Assets/aboutMainImage.png";
import apj from "../Assets/apj.png";
import billGates from "../Assets/billGates.png";
import einstein from "../Assets/einstein.png";
import nelsonMandela from "../Assets/nelsonMandela.png";
import steveJobs from "../Assets/steveJobs.png";
import HomeLayout from '../Layouts/HomeLayout';

const quotes = [
    {
        id: 1,
        author: "A.P.J. Abdul Kalam",
        quote: "The best brains of the nation may be found on the last benches of the classroom.",
        image: apj,
    },
    {
        id: 2,
        author: "Steve Jobs",
        quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
        image: steveJobs,
    },
    {
        id: 3,
        author: "Albert Einstein",
        quote: "Imagination is more important than knowledge.",
        image: einstein,
    },
    {
        id: 4,
        author: "Bill Gates",
        quote: "It's fine to celebrate success but it is more important to heed the lessons of failure.",
        image: billGates,
    },
    {
        id: 5,
        author: "Nelson Mandela",
        quote: "It always seems impossible until it is done.",
        image: nelsonMandela,
    }
];

function AboutUs() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <HomeLayout>
            <div className='px-6 md:px-16 py-4 flex flex-col justify-evenly items-center text-white h-[calc(100vh-10vh)] max-w-7xl mx-auto overflow-hidden'>
                {/* Hero Section */}
                <div className='flex flex-col md:flex-row items-center justify-between gap-6 w-full'>
                    <section className='w-full md:w-1/2 space-y-3 md:space-y-4'>
                        <h1 className='text-3xl md:text-5xl text-yellow-500 font-bold leading-tight'>
                            Affordable and Quality Education
                        </h1>
                        <p className='text-sm md:text-base text-gray-200 leading-relaxed'>
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
                            className='drop-shadow-2xl max-h-44 md:max-h-60 object-contain pointer-events-none'
                            style={{
                                filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.5))"
                            }}
                        />
                    </div>
                </div>

                {/* Quotes Carousel */}
                <div className="w-full md:w-2/3 flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center gap-2 px-4 text-center min-h-[140px] transition-all duration-500 ease-in-out">
                        <img
                            src={quotes[currentSlide].image}
                            alt={quotes[currentSlide].author}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-400 object-cover shadow-lg"
                        />
                        <p className='text-sm md:text-base text-gray-200 italic max-w-lg'>
                            "{quotes[currentSlide].quote}"
                        </p>
                        <h3 className='text-sm md:text-base font-semibold text-yellow-500'>
                            {quotes[currentSlide].author}
                        </h3>
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex justify-center gap-2 mt-3">
                        {quotes.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentSlide === index ? "bg-yellow-500 w-6" : "bg-gray-500 hover:bg-gray-400"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default AboutUs;
