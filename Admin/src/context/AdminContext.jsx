import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import {toast} from 'react-toastify'

export const AdminContext=createContext();

const AdminContextProvider =(props) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const[aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
  const[appointments,setAppointments]=useState([]);
  const[doctors,setDoctors]=useState([]);
  const[dashBoardInfo,setDashBoardInfo]=useState(false)

  const fetchDashBoardInfo=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/admin/admin-dashboard`,{},{headers:{aToken}});
      if(data.success){
        
        setDashBoardInfo(data.message)
      }else{
        throw new Error("can't retrieve dashboard information")
      }
    }catch(err){
      console.log(err||"something went wrong");
    }
  }

  const fetchAppointments=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/admin/list-appointments`,{},{headers:{aToken}});
      if(data.success){
        setAppointments(data.message);
      }else{
        throw new Error("can't retrieve appointments")
      }
    }catch(err){
      console.log(err||"something went wrong");
    }
  }

  const fetchDoctors=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/admin/list-doctors`,{},{headers:{aToken}});
      if(data.success){
        setDoctors(data.message);
      }else{
        throw new Error("can't retrieve doctors")
      }
    }catch(err){
      console.log(err||"something went wrong");
    }
  }
  const appointmentCancel=async(id)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/admin/appointment-cancel`,{appointmentId:id},{headers:{aToken}})
      if(data.success){
        toast.success(data.message);
        fetchAppointments();
      }else{
        throw new Error("Failed to cancel appointment")
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  useEffect(()=>{
    fetchDoctors();
    fetchAppointments();
  },[])

  const value={backendUrl,setAToken,aToken,doctors,appointments,appointmentCancel,dashBoardInfo,fetchDashBoardInfo}

  return (
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider