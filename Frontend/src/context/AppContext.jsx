import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
export const AppContext=createContext();
import {toast} from 'react-toastify'

const AppContextProvider = ({children}) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const[allDoctors,setDoctors]=useState([])
  const[userInfo,setUserInfo]=useState(false)
  const[utoken,setutoken]=useState(localStorage.getItem('utoken')?localStorage.getItem('utoken'):false)
  const[isLoading,setIsLoading]=useState(false)
  
  const fetchDoctorsData=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/doctor/list`);
      if(data.success){
        setDoctors(data.message);
      }else{
        throw new Error("Can't retrieve doctors data");
      }
    }catch(err){
      console.log(err||"Something went wrong");
      toast.error(err.message||"Something went wrong");
    }
    
  }

  const fetchUserInfo=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/user/get-info`,{},{headers:{utoken}});
      if(data.success){
        console.log(data.message);
        
        setUserInfo(data.message);
      }else{
        throw new Error("Failed to retrieve User information");
      }
    }catch(err){
      console.log(err||"Something went wrong");
      toast.error(err.message||"Something went wrong");
    }
    
  }

  
  useEffect(()=>{
    fetchDoctorsData();
  },[])

  useEffect(()=>{
    if(utoken){
      fetchUserInfo();
    }else{
      setUserInfo(false)
    }
  },[utoken])

  return (
    <AppContext.Provider value={{allDoctors,backendUrl,utoken,setutoken,userInfo,setUserInfo,fetchUserInfo,fetchDoctorsData,isLoading,setIsLoading}}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider