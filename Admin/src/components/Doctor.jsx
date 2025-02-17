import React, { useContext, useEffect, useState, } from 'react'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext'
import {toast} from 'react-toastify'
const Doctor = (props) => {
  const{aToken,backendUrl}=useContext(AdminContext)
  const[isChecked,setIsChecked]=useState(props.available);
  const changeAvailability=async()=>{
    try{
      const response=await axios.post(`${backendUrl}/api/admin/change`,{docId:props.id},{headers:{aToken}})
      if(response.data.success){
        toast.success(response.data.message);
        setIsChecked(prev=>!prev);
      }else{
        throw new Error("Can't Change Availability")
      }
    }catch(err){
      toast.error(err)
    }
   }
  return (
    <div  className='flex flex-col outline outline-gray-600 rounded-lg cursor-pointer max-w-[300px] '>
        <div className='bg-blue-100 rounded-t-lg'><img src={props.image} alt="doctor image"  /></div>
        <div className='p-3'>
            <h2 className='text-sm md:text-base lg:text-xl font-semibold'>{props.name}</h2>
            <p className='text-xs'>{props.speciality}</p>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="available" checked={isChecked} onChange={changeAvailability} />
              <label htmlFor="available"  className='text-xs sm:text-sm'>Available</label>
            </div>
        </div>
    </div>
  )
}

export default Doctor