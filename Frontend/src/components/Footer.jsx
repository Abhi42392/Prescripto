import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
    <div className='mt-30 flex flex-col space-y-4 justify-between sm:items-start sm:flex-row'>
      <div>
        <img src={assets.logo} alt="" className='w-[max(13vw,120px)] pb-2 sm:pb-4'/>
        <p className='text-xs sm:text-sm sm:w-[300px] lg:text-base'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
        Quam atque eligendi ipsam quis nemo saepe laboriosam, animi possimus.</p>
      </div>
      
        <div>
          <h2 className='font-medium text-base md:text-lg pb-2 sm:pb-4'>COMPANY</h2>
          <div className='text-xs sm:text-sm flex flex-col lg:text-base'>
            <a href="#">Home</a>
            <a href="#">About us</a>
            <a href="#">Contact us</a>
            <a href="#">Privacy policy</a>
          </div>
        </div>
        <div>
          <h2 className='font-medium text-base md:text-lg pb-2 sm:pb-4'>GET IN TOUCH</h2>
          <p className='text-xs sm:text-sm lg:text-base'>+101-292-029</p>
          <p className='text-xs sm:text-sm lg:text-base '>helpprescripto@gmail.com</p>
        </div>
      </div>
      <div>
        <hr />
        <p className='text-center text-xs sm:text-sm'>Copy Rights 2024@Prescripto-All rights reserved</p>
      </div>
      </div>
    
  )
}

export default Footer