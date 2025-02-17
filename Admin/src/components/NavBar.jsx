import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext';
const NavBar = () => {
  const{setAToken,aToken}=useContext(AdminContext);
  const{setDToken,dtoken}=useContext(DoctorContext);
  const logout=()=>{
    if(aToken){
      localStorage.removeItem('aToken');
      setAToken('')
    }else{
      localStorage.removeItem('dtoken');
      setDToken('')
    }
    
  }
  return (
    <div className='flex w-full items-center px-[3vw] py-[1.5vw] justify-between border-b-2 border-gray-500 bg-white'>
      <div className='flex items-center gap-4'>
        <img src={assets.admin_logo} alt="" className='w-32 md:w-48' />
        <p className='outline-2 outline-gray-600 rounded-full px-2 text-sm sm:px-4 sm:py-1 h-fit '>Admin</p>
      </div>
      <button className='bg-[#5f6FFF] rounded-full px-4 sm:px-8 py-1 text-white cursor-pointer ' onClick={logout}>Logout</button>
    </div>
  )
}

export default NavBar