import React from 'react'
import { useNavigate } from 'react-router-dom'
const Doctor = (props) => {
    const navigate=useNavigate();
  return (
    <div onClick={()=>navigate(`/appointments/${props.id}`)} className='flex flex-col outline outline-gray-600 rounded-lg cursor-pointer hover:scale-105 transition ease-in-out duration-200'>
        <div className='bg-blue-100 rounded-t-lg'><img src={props.image} alt="doctor image"  /></div>
        <div className='p-3'>
            <li className='flex space-x-2 items-center'><div className={`w-2 h-2 rounded-full ${props.available?'bg-green-500':'bg-gray-500'}`}></div><p className={`${props.available?'text-green-500':'text-gray-500'} text-xs sm:text-sm`}>{props.available?'Available':'Not Available'}</p></li>
            <h2 className='text-sm md:text-base lg:text-xl font-semibold'>{props.name}</h2>
            <p className='text-xs'>{props.speciality}</p>
        </div>
    </div>
  )
}

export default Doctor