import {BsFacebook,BsInstagram,BsLinkedin,BsTwitterX} from 'react-icons/bs'


function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear()
  return (
    <>
      <footer className='relative left-0 bottom-0 min-h-[10vh] h-auto flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 py-5 px-6 sm:px-20 gap-4 text-center sm:text-left'>
            <section className="text-base sm:text-lg">
                Copyright {year} | All rights reserved
            </section>
            <section className='flex items-center justify-center gap-5 text-2xl text-white cursor-pointer'>
                <a href="#" aria-label="Facebook" className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                  <BsFacebook/>
                </a>
                <a href="#" aria-label="Instagram" className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                  <BsInstagram/>
                </a>
                <a href="#" aria-label="LinkedIn" className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                  <BsLinkedin/>
                </a>
                <a href="#" aria-label="Twitter X" className='hover:text-yellow-500 transition-all ease-in-out duration-500 '>
                  <BsTwitterX/>
                </a>
            </section>
       </footer>
    </>
  )
}

export default Footer
