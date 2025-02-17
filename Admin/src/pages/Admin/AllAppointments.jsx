import React from 'react'
import { useContext } from 'react'
import {assets} from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const{appointments,atoken,fetchAppointments,appointmentCancel}=useContext(AdminContext)
  const{calculateAge}=useContext(AppContext)
  
  useEffect(()=>{
    if(atoken){
      fetchAppointments();
    }
  },[atoken])
  return (
    <div className='max-h-[80vh] min-h[60vh] border-2 border-gray-600 overflow-y-scroll max-w-6xl sm:m-5 '>
      <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
        <div>#</div>
        <div >Patient</div>
        <div className='max-sm:hidden'>Age</div>
        <div>Date&Time</div> 
        <div>Doctor</div>  
        <div>Fees</div>
        <div >Actions</div> 
      </div>
      {
        appointments.map((item,index)=>(
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] border-b items-center text-gray-500 px-3 py-6 hover:bg-gray-50'>
            <div>{index+1}</div>
            <div className='flex gap-2 items-center'><img src={item.userData.image} alt='patient image' className='w-8 h-8 rounded-full' /><p>{item.userData.name}</p></div>
            <div className='max-sm:hidden'>{calculateAge(item.userData.dob)}</div>
            <div>{item.slotDate+" "+item.slotTime}</div>
            <div className='flex gap-2 items-center'><img src={item.docData.image} alt='doctor image' className='w-8 h-8 rounded-full' /><p>{item.docData.name}</p></div>
            <div>{item.docData.fees}</div>
            {
              item.cancelled
              ?
              <p className='text-red-500 text-xs font-medium '>Cancelled</p>
              :
              <div onClick={()=>{appointmentCancel(item._id)}}><img src={assets.cancel_icon} alt="cancel icon" className='w-10 cursor-pointer'/></div>
            }
          </div>
        ))
      }
    </div>
  )
}

export default AllAppointments