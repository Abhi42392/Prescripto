import React from 'react'
import { assets } from '../assets/assets'
const Banner = () => {
  return (
     <div className='header h-fit  relative rounded-md my-15 '>
            <div className='pt-[12vw] pb-[3vw] sm:pt-[3vw] pl-[5vw] sm:w-[60%] md:pt-[8vw]'>
                <h1 className='text-white font-semibold text-3xl sm:text-[6vh] leading:12'>Book Appointment  <br />With 100+ Trusted Doctors</h1>
                <button className='bg-white text-ray-600 rounded-full px-3 py-1 sm:px-6 sm:py-2 cursor-pointer hover:scale-105 transition-all duration-300 my-5'>Create Account</button>
            </div>
            <div className='sm:w-[40%]'><img src={assets.appointment_img} alt="header image" className='hidden sm:block absolute bottom-0 right-7 h-[110%]'/></div>
    </div>
  )
}

export default Banner