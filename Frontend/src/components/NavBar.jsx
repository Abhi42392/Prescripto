import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
const NavBar = () => {
  const navigate= useNavigate();
  const[showMenu,setShowMenu]=useState(false);
  const{utoken,setutoken,userInfo}=useContext(AppContext)
  const logout=()=>{
    setutoken(false);
    localStorage.removeItem('utoken')
  }
  return (
    <div className='flex sm:justify-between items-center mb-10'>
      <div className='flex-1 md:flex-none'><img onClick={()=>navigate("/")} src={assets.logo} alt="logo" className='w-44' /></div>
    
      <ul className='hidden md:flex justify-between items-center space-x-4 text-base lg:text-lg font-semibold'>
        <NavLink to={"/"} className='cursor-pointer'>
          <li className='py-1'>HOME</li>
          <hr className='hidden border-none outline-none h-0.5 w-3/5 bg-[#5f6FFF] m-auto' />
        </NavLink>
        <NavLink to={"/doctors"} className='cursor-pointer'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='hidden border-none outline-none h-0.5 w-3/5 bg-[#5f6FFF] m-auto' />
        </NavLink><NavLink to={"/contact"} className='cursor-pointer'>
          <li className='py-1'>CONTACT US</li>
          <hr className='hidden border-none outline-none h-0.5 w-3/5 bg-[#5f6FFF] m-auto' />
        </NavLink><NavLink to={"/about"} className='cursor-pointer'>
          <li className='py-1'>ABOUT US</li>
          <hr className='hidden border-none outline-none h-0.5 w-3/5 bg-[#5f6FFF] m-auto' />
        </NavLink>
      </ul>
      <div className='flex flex-col gap-4'>
        {
          utoken&&userInfo?
          <div className='flex space-x-1.5 group relative'>
            <img src={userInfo.image} alt='profile' className='w-8 h-8  rounded-full'/>
            <img src={assets.dropdown_icon} alt="drop down" className='w-3'/>
            <div className='absolute top-0 right-0 pt-14  z-20 text-gray-600 font-medium hidden group-hover:block '>
              <div className='min-w-30 text-sm space-y-2 sm:min-w-60 sm:text-lg  sm:space-y-3 bg-stone-100 p-4'>
                <NavLink to={"/my-profile"}><p className='hover:text-black cursor-pointer py-2 '>My Profile</p></NavLink>
                <NavLink to={"/my-appointments"}><p className='hover:text-black cursor-pointer py-2 '>My Appointments</p></NavLink>
                <p className='hover:text-black cursor-pointer py-2 ' onClick={logout}>Logout</p>
              </div>
            </div>
          </div>
          :
          <NavLink to={"/login"}><button className='hidden md:block bg-blue-700 text-white px-6 py-2 rounded-full'>Create account</button></NavLink>
        }
      </div>
      
      <img src={assets.menu_icon} alt="menu" className='w-7 mx-1 md:hidden' onClick={()=>{setShowMenu(true)}}/>
      <div className={`${showMenu? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
        <div className='flex justify-between items-center m-4'>
          <img src={assets.logo} alt="logo" />
          <img onClick={()=>{setShowMenu(false)}} src={assets.cross_icon} alt="cross icon" className='h-10'/>
        </div>
        <ul className='flex flex-col items-center mobile-menu space-y-3 mt-14'>
          <NavLink onClick={()=>setShowMenu(false)} to={"/"}><p>HOME</p></NavLink>
          <NavLink onClick={()=>setShowMenu(false)} to={"/doctors"}><p>ALL DOCTORS</p></NavLink>
          <NavLink onClick={()=>setShowMenu(false)} to={"/contact"} ><p>CONTACT</p></NavLink>
          <NavLink onClick={()=>setShowMenu(false)} to={"/about"} ><p>ABOUT</p></NavLink>
        </ul>
      </div>
      </div>
      
  
  )
}
export default NavBar