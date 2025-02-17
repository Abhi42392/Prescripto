import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios';

import { toast } from 'react-toastify';
const MyAppointments = () => {
  const{backendUrl,utoken,fetchDoctorsData,setIsLoading}=useContext(AppContext)
  const[appointments,setAppointments]=useState([]);
  const verifyPayment=async(razorpay_order_id)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/user/verify-payment`,{razorpay_order_id},{headers:{utoken}})
      if(data.success){
        fetchAppointments();
      }else{
        throw new Error(data.message)
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  const initPay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:"Appointment payment",
      description:"Appointment payment",
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        verifyPayment(response.razorpay_order_id)
      }
    }
    const rzp=new window.Razorpay(options);
    rzp.open();
    
  }

  const appointmentRazorpay=async(appointmentId)=>{
    try{
      setIsLoading(true)
      const {data}=await axios.post(`${backendUrl}/api/user/payment-razorpay`,{appointmentId},{headers:{utoken}})
      if(data.success){
        initPay(data.order)
      }
      setIsLoading(false)
    }catch(err){
      console.log(err);
      setIsLoading(false)
    }
  }

  const cancelAppointmet=async(id)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/user/cancel-appointment`,{appointmentId:id},{headers:{utoken}})
      if(data.success){
        toast.success(data.message);
        fetchAppointments();
        fetchDoctorsData();
      }else{
        throw new Error("Failed to cancel appointment")
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  const fetchAppointments=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/user/list-appointments`,{},{headers:{utoken}});
      if(data.success){
        setAppointments(data.message);
      }else{
        throw new Error(data.message);
      }
    }catch(err){
      console.log(err);
      toast.error(err.message)
    }
  }
  useEffect(()=>{
    fetchAppointments();
  },[])

  return (
    <div className='flex flex-col space-y-6'>
      {
        appointments.map((item)=>
          (<div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 border border-gray-300 shadow-lg p-4 rounded-xl'>
            
              <div><img src={item.docData.image} alt="doctorr image" className='w-32 bg-indigo-50' /></div>
              <div className='flex-1 text-sm text-zinc-600'>

                <h2 className='font-semibold text-neutral-800'>{item.docData.name}</h2>
                <p>{item.docData.speciality}</p>
              
                <h2 className='text-zinc-700 font-medium mt-1'>Address:</h2>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                
              
              <p className='text-xs mt-1'><span className=''>Date & Time:</span>{`${item.slotDate} || ${item.slotTime}`}</p>
              </div>
            
            <div></div>
            <div className='flex flex-col justify-end'>
              {!item.cancelled&&!item.isCompleted&&item.payment&&<button className="bg-indigo-50 py-2 mb-4 ">Paid</button>}
              {!item.cancelled&&!item.isCompleted&&!item.payment&&<button onClick={()=>{appointmentRazorpay(item._id)}} className='px-8 py-2  bg-[#5f6FFF] text-white  mb-4 cursor-pointer'>Pay here</button>}
              {!item.cancelled&&!item.isCompleted&&<button className='border-2 border-gray-400  px-8 py-2 hover:text-red-500 hover:border-red-500 cursor-pointer ' onClick={()=>{cancelAppointmet(item._id)}}>Cancel Appointment</button>}
              {item.cancelled&&<button className='sm:min-w-48 py-2 px-4 text-red-500 border-2 border-red-500 '>Appointment Cancelled</button>}
              {item.isCompleted&&<button className='sm:min-w-48 py-2 px-4 text-green-500 border-2 border-green-500 '>Completed</button>}
              
            </div>
          </div>)
        )
      }
    </div>
  )
}

export default MyAppointments