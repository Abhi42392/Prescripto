import React, { useContext,useEffect } from 'react'
import {AdminContext} from '../../context/AdminContext'
import {assets} from '../../assets/assets'
const DashBoard = () => {
  const{dashBoardInfo,fetchDashBoardInfo,aToken,appointmentCancel}=useContext(AdminContext)
  const{doctors,patients,appointments,latestAppointments}=dashBoardInfo;
  console.log(latestAppointments);
  
  useEffect(()=>{
    if(aToken){
      fetchDashBoardInfo();
    }
  },[aToken])
  return dashBoardInfo&& (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3 '>
        <div className='flex items-center gap-2 p-4 min-w-58   shadow-md rounded-sm border-2 border-gray-100 cursor-pointer transition-all'>
          <img src={assets.doctor_icon} alt="doctor icon" className='w-20' />
          <div>
            <p className='font-bold text-2xl text-center'>{doctors}</p>
            <p>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 min-w-58 shadow-md rounded-sm border-2 border-gray-100 cursor-pointer transition-all'>
          <img src={assets.patients_icon} alt="patients icon" className='w-20' />
          <div>
            <p className='font-bold text-2xl text-center'>{patients}</p>
            <p>Patients</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 min-w-58 shadow-md rounded-sm border-2 border-gray-100 cursor-pointer transition-all'>
          <img src={assets.appointments_icon} alt="appointment icon" className='w-20' />
          <div>
            <p className='font-bold text-2xl text-center'>{appointments}</p>
            <p>Appointments</p>
          </div>
        </div>
      </div>

      <div className='border-2 border-gray-500 px-4 py-2 sm:px-8 sm:py-4 max-w-3xl my-8'>
        <div className='flex gap-2 items-center'>
          <img src={assets.list_icon} alt="list icon" />
          <p>Latest Appointments</p>
        </div>
        <div className='my-4 space-y-4'>
          {
            latestAppointments.map((item,index)=>(
              <div key={index} className='flex justify-between items-center'>
                <img src={item.docData.image} alt="doctor image"  className='w-10 h-10 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-8'/>
                <div className='flex-1'>
                  <p className='sm:text-xl font-semibold'>{item.docData.name}</p>
                  <p className='text-xs sm:text-sm'>{item.slotDate +" "+item.slotTime}</p>
                </div>
                {
                  item.cancelled
                  ?
                  <p className='text-red-500 text-xs font-medium '>Cancelled</p>
                  :
                  <div onClick={()=>{appointmentCancel(item._id)}}><img src={assets.cancel_icon} alt="cancel icon" className='w-10 sm:w-12 cursor-pointer'/></div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DashBoard