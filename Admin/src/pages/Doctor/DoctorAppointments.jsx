import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import {assets} from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
const DoctorAppointments = () => {
  const{appointments,fetchAppointments,dtoken,appointmentCancel,appointmentCompleted}=useContext(DoctorContext)
  const{calculateAge}=useContext(AppContext)
  useEffect(()=>{
    if(dtoken){
      fetchAppointments()
    }
  },[dtoken])
  return (
    <div className='max-h-[80vh] min-h[60vh] border-2 border-gray-600 overflow-y-scroll max-w-3xl sm:m-5 '>
          <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
            <p className='max-sm:hidden'>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p className='max-sm:hidden'>Age</p>
            <p>Date&Time</p> 
            <p>Fees</p>
            <p className='m-auto'>Actions</p> 
          </div>
          {
            appointments.map((item,index)=>(

              
              <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 border-b items-center text-gray-500 px-3 py-6 hover:bg-gray-50'>
                <div className='max-sm:hidden'>{index+1}</div>
                <div className='flex gap-2 items-center'><img src={item.userData.image} alt='patient image' className='w-8 h-8 rounded-full' /><p>{item.userData.name}</p></div>
                <p className='text-xs outline outline-gray-500 px-2 py-1 rounded-full w-fit'>{item.payment?"Online":"Cash"}</p>
                <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

                <div>{item.slotDate+" "+item.slotTime}</div>
                <p>{item.docData.fees}</p>
                {(!item.cancelled&&!item.isCompleted)&&<div className='flex'>
                  <img src={assets.cancel_icon} onClick={()=>{appointmentCancel(item._id)}} alt="cancel icon" className='w-9 cursor-pointer'/>
                  <img src={assets.tick_icon} onClick={()=>{appointmentCompleted(item._id)}} alt="tick icon" className='w-9 cursor-pointer'/>
                </div>}
                {item.cancelled&&<p className='text-red-400'>Cancelled</p>}
                {item.isCompleted&&<p className='text-green-400' >Completed</p>}
              </div>
            ))
          }
        </div>
  )
}

export default DoctorAppointments