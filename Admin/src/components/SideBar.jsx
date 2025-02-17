import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import {NavLink} from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
const SideBar = () => {
  const{aToken}=useContext(AdminContext)
  const{dtoken}=useContext(DoctorContext)
  return (
    <div className='w-fit md:w-[17vw]   border-r-2 py-2 sm:py-4 border-gray-500 space-y-1 sm:space-y-3 sidebar min-h-screen '>
      {
        aToken&&
        <div>
          <NavLink to={"/dashboard"} className='flex gap-2 py-2 sm:py-3 px-4 md:pl-[3vw]'>
            <img src={assets.home_icon} alt="dashboard"  />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink to={"/all-appointments"} className='flex gap-2 px-4  py-2 sm:py-3 md:pl-[3vw]'>
            <img src={assets.appointment_icon} alt="appointments"  />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink to={"/add-doctor"} className='flex gap-2  py-2 sm:py-3 px-4 md:pl-[3vw]'>
            <img src={assets.add_icon} alt="add icon"  />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to={"/doctors-list"} className='flex gap-2  py-2 sm:py-3 px-4 md:pl-[3vw]'>
            <img src={assets.people_icon} alt="people"  />
            <p className='hidden md:block'>Doctor list</p>
          </NavLink>
        </div>
      }
      {dtoken&&
         <div>
         <NavLink to={"/doctor-dashboard"} className='flex gap-2 py-2 sm:py-3 px-4 md:pl-[3vw]'>
           <img src={assets.home_icon} alt="dashboard"  />
           <p className='hidden md:block'>Dashboard</p>
         </NavLink>
         <NavLink to={"/doctor-appointments"} className='flex gap-2 px-4  py-2 sm:py-3 md:pl-[3vw]'>
           <img src={assets.appointment_icon} alt="appointments"  />
           <p className='hidden md:block'>Appointments</p>
         </NavLink>
         <NavLink to={"/doctor-profile"} className='flex gap-2  py-2 sm:py-3 px-4 md:pl-[3vw]'>
           <img src={assets.people_icon} alt="add icon"  />
           <p className='hidden md:block'>Profile</p>
         </NavLink>
       </div>
      }
    </div>
  )
}

export default SideBar