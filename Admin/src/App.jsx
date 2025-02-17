import React, { useContext, useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import { ToastContainer, toast  } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import SideBar from './components/SideBar'
import NavBar from './components/NavBar';
import DashBoard from './pages/Admin/DashBoard'
import AddDoctor from './pages/Admin/AddDoctor'
import AllAppointments from './pages/Admin/AllAppointments'
import DoctorsList from './pages/Admin/DoctorsList'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import { DoctorContext } from './context/DoctorContext';

const App = () => {
  const{aToken}=useContext(AdminContext)
  const{dtoken}=useContext(DoctorContext)
  console.log(dtoken);
  
  return !aToken&&!dtoken?(
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
  :
  (
    <div>
      <NavBar />
      <ToastContainer />
      <div className='flex'>
        <SideBar />
        <div className='m-3 sm:mt-7 sm:mx-8 flex-1' >
        <Routes>
          <Route path={'/dashboard'} element={<DashBoard />} />
          <Route path={'/all-appointments'} element={<AllAppointments />} />
          <Route path={'/add-doctor'} element={<AddDoctor />} />
          <Route path={'/doctors-list'} element={<DoctorsList />} />
          <Route path={'/doctor-dashboard'} element={<DoctorDashboard />} />
          <Route path={'/doctor-appointments'} element={<DoctorAppointments />} />
          <Route path={'/doctor-profile'} element={<DoctorProfile />} />
        </Routes>
        </div>
      </div>
    </div>
  )

}

export default App