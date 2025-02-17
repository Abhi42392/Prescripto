import React from 'react'
import { specialityData} from '../assets/assets'
import {Link} from 'react-router-dom'
const SpecialityMenu = () => {
  return (
    <div className='my-20'>
       <div className='text-center space-y-4'>
            <h1 className='font-medium text-3xl'>Find by Speciality</h1>
            <p className='font-light'>Simply browse through our extensive list of trusted doctors, schedule <br /> your appointment hassle-free.</p>
       </div>
       <div className='flex space-x-6 overflow-x-scroll sm:justify-center pt-15'>
        {
            specialityData.map((item,index)=>(
                <Link onClick={()=>scrollTo(0,0)} key={index} to={`/doctors/${item.speciality}`}
                className='flex flex-col gap-4 cursor-pointer flex-shrink-0 items-center hover:translate-y-[-10px] transition-all duration-500'>
                    <img src={item.image} alt="" className='max-w-20 sm:max-w-25 md:max-w-30'/>
                    <p className='text-xs sm:text-sm'>{item.speciality}</p>
                </Link>
            ))
        }
       </div>
    </div>
  )
}

export default SpecialityMenu