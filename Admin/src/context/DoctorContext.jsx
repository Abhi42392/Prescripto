import React, { useState ,useEffect} from 'react'
import { createContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const DoctorContext=createContext();

const DoctorContextProvider = (props) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const[dtoken,setDToken]=useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):'');
  const[appointments,setAppointments]=useState([]);
  const[dashBoardInfo,setDashBoardInfo]=useState(false)
  const[doctorInfo,setDoctorInfo]=useState(false)


  const fetchDoctorInfo=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/get-info`,{},{headers:{dtoken}});
      if(data.success){
        setDoctorInfo(data.message);
      }else{
        throw new Error("Failed to retrieve Doctor information");
      }
    }catch(err){
      console.log(err||"Something went wrong");
      toast.error(err.message||"Something went wrong");
    }
    
  }

  const appointmentCancel=async(id)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/appointment-cancel`,{appointmentId:id},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message);
        fetchAppointments();
        fetchDashBoardInfo();
      }else{
        throw new Error("Failed to cancel appointment")
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  const appointmentCompleted=async(id)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/appointment-completed`,{appointmentId:id},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message);
        fetchAppointments();
        fetchDashBoardInfo();
      }else{
        throw new Error("Failed to complete appointment")
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  const fetchAppointments=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/appointments-doctor`,{},{headers:{dtoken}});
      
      if(data.success){
        setAppointments(data.message.reverse());
      }else{
        throw new Error("can't retrieve appointments")
      }
    }catch(err){
      console.log(err||"something went wrong");
    }
  }


  const fetchDashBoardInfo=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/doctor-dashboard`,{},{headers:{dtoken}});
      if(data.success){
        setDashBoardInfo(data.message)
      }else{
        throw new Error("can't retrieve dashboard information")
      }
    }catch(err){
      console.log(err||"something went wrong");
    }
  }

  useEffect(()=>{
    fetchAppointments();
    fetchDashBoardInfo();
  },[])

  useEffect(()=>{
      if(dtoken){
        fetchDoctorInfo();
      }else{
        setDoctorInfo(false)
      }
    },[dtoken])
  return (
    <DoctorContext.Provider value={{backendUrl,dtoken,setDToken,fetchAppointments,appointments,appointmentCancel,doctorInfo,fetchDoctorInfo,
    appointmentCompleted,fetchDashBoardInfo,dashBoardInfo,setDoctorInfo}}>
        {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider