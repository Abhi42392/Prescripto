import React from 'react'
import { assets } from '../assets/assets'
const Header = () => {
  return (
    <div className='header h-fit pt-[10vw] md:pt-[8vw] pl-[5vw] pb-[6vw]  relative rounded-md'>
        <div >
            <h1 className='text-white font-semibold text-3xl sm:text-[6vh] leading:12'>Book Appointment <br />With Trusted Doctors</h1>
            <div className='flex flex-col-reverse lg:flex-row gap-2 lg:items-center py-4 sm:py-6'>
                <img src={assets.group_profiles} alt="people profiles" className='w-[80px]' />
                <p className='font-light text-white leading-6 text-base'>Simply browse through our extensive list of trusted doctors,<br /> schedule your appointment hassle-free</p>
            </div>
            <a href="#speciality" className='bg-white text-gray-600 rounded-full px-3 py-1 sm:px-6 sm:py-2 cursor-pointer hover:scale-105 transition-all duration-300'>Book appointment</a>
        </div>
        <img src={assets.header_img} alt="header image" className='hidden lg:block absolute bottom-0 right-16 h-0 md:h-[85%]'/>
    </div>
  )
}

export default Header