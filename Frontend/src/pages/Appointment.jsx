import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import Doctor from "../components/Doctor"
import { assets} from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
const Appointment = () => {
  const navigate=useNavigate();
  const{allDoctors,backendUrl,utoken,fetchDoctorsData}=useContext(AppContext);
  const{docId}=useParams();
  const[docInfo,setDocInfo]=useState(null);
  const[docSlots,setDocSlots]=useState([])
  const[slotIndex,setSlotIndex]=useState(0)
  const[slotTime,setSlotTime]=useState('')
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const createDoctor=(props)=>{
    return <Doctor key={props._id} id={props._id} name={props.name} image={props.image} speciality={props.speciality} available={props.available}  />
  }

  const fetchDocInfo=async()=>{
      const doc=allDoctors.find((item)=>item._id===docId);
      setDocInfo(doc);
    
      
  }

  const getAvailableSlots = async () => {
    let today = new Date();
    let slots = [];

    for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        currentDate.setSeconds(0, 0); // Reset seconds and milliseconds

        let endTime = new Date(today);
        endTime.setDate(today.getDate() + i);
        endTime.setHours(21, 0, 0, 0); // 9:00 PM cutoff

        if (i === 0) { // Handling today's start time
            let nextHour = today.getHours();
            let nextMinutes = today.getMinutes();

            // Align to the next half-hour slot
            if (nextMinutes > 30) {
                nextHour += 1;
                nextMinutes = 0;
            } else {
                nextMinutes = 30;
            }

            // Ensure it's at least 10:00 AM but not after 9:00 PM
            if (nextHour < 10) {
                nextHour = 10;
                nextMinutes = 0;
            } else if (nextHour >= 21) {
                continue; // No slots available today, move to the next day
            }

            currentDate.setHours(nextHour, nextMinutes, 0, 0);
        } else {
            // Future days start at 10:00 AM  
            currentDate.setHours(10, 0, 0, 0);
        }

        let timeSlots = [];
        while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const day=currentDate.getDate();
            const month=currentDate.getMonth()+1;
            const year=currentDate.getFullYear();
            const slotDate=day+"-"+month+"-"+year;
            const slotTime=formattedTime;
            const isSlotAvailable=docInfo.slots_booked[slotDate]&&docInfo.slots_booked[slotDate].includes(slotTime)?false:true;
            if(isSlotAvailable){
              timeSlots.push({
                dateTime: new Date(currentDate),
                time: formattedTime
              });
            }

            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  const bookAppointment=async()=>{
    if(!utoken){
      toast.warn("Login to book appointment");
      return navigate('/login')
    }
    try{
      const date=docSlots[slotIndex][0].dateTime;
      const day=date.getDate();
      const month=date.getMonth()+1;
      const year=date.getFullYear();
      const slotDate=day+"-"+month+"-"+year;

      const {data}=await axios.post(`${backendUrl}/api/user/book-appointment`,{docId,slotDate,slotTime},{headers:{utoken}})
      if(data.success){
        toast.success(data.message);
        fetchDoctorsData();
        navigate("/my-appointments")
      }else{
        toast.error(data.message);
      }
      
    }catch(err){
      console.log(err);
      toast.error(err.message)
    }
  }

  useEffect(()=>{
    fetchDocInfo();
  },[allDoctors,docId])
  
  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])


  return docInfo&& (
    <div>
      <div className='flex flex-col lg:flex-row gap-6 items-center sm:items-start '>
        <div className='bg-[#5f6FFF] rounded-lg w-[max(15vw,200px)] flex-shrink-0 h-full'><img src={docInfo.image} alt="Doctor image" className='w-full h-full'/></div>
        <div className='list-none rounded-lg outline outline-gray-600 p-8 max-h-full'>
          <div className='space-y-2'>
            <li className='flex space-x-1 sm:space-x-3'><h1 className='text-2xl font-semibold'>{docInfo.name}</h1><img src={assets.verified_icon}/></li>
            <li className='flex flex-col sm:flex-row gap-2 '><p>{`${docInfo.degree} - ${docInfo.speciality}`}</p><p className='rounded-lg outline outline-gray-600 p-1 w-fit '>{docInfo.experience}</p></li>
          </div>
          <div className='w-full lg:w-[70%] my-5'>
            <li className='font-semibold text-xl flex space-x-3'><p>About</p><img src={assets.info_icon} alt="info icon"/></li>
            <p>{docInfo.about}</p>
          </div>
          <li className='text-xl space-x-1 flex'><p>Appointment fee:</p><p className='font-medium'>${docInfo.fees}</p></li>
        </div>
      </div>
      <div className='lg:ml-[max(15vw,200px)] lg:pl-6 my-5'>
        <p className='text-2xl'>Booking slots</p>
        <div className='flex  space-x-4 overflow-x-scroll w-full p-2 my-4'>
        {
          docSlots.length&&docSlots.map((item,index)=>(
            <div key={index} className='py-3 px-2 sm:py-6 sm:px-4 w-10 text-sm sm:w-16 outline outline-gray-600  rounded-full flex flex-col space-y-2 items-center ' style={slotIndex===index?{"backgroundColor":"#5f6FFF","outline":"none","color":"white"}:{}} onClick={()=>{setSlotIndex(index)}}>
               <p>{item[0]&&daysOfWeek[item[0].dateTime.getDay()]}</p>
               <p>{item[0]&&item[0].dateTime.getDate()}</p>
            </div>
          ))
        }
        </div>
        <div className='flex overflow-x-scroll p-2 gap-4'>
          {
            docSlots.length&&docSlots[slotIndex].map((item,index)=>(
              <div key={index} className='py-1 px-3 sm:py-2 sm:px-6  text-xs sm:text-sm whitespace-nowrap outline outline-gray-600  rounded-full' style={slotTime===item.time?{"backgroundColor":"#5f6FFF","outline":"none","color":"white"}:{}} onClick={()=>{setSlotTime(item.time)}}>
                 <p>{item.time.toLowerCase()}</p>
              </div>
            ))
          }
        </div>
        <button onClick={bookAppointment} className='bg-[#5f6FFF] rounded-full px-6 py-2 sm:px-10 sm:py-3 text-white my-3 text-sm sm:text-base cursor-pointer'>Book an appointment</button>
      </div>
       <div className='flex flex-col items-center mt-20'>
                <h1 className='text-center text-3xl font-medium'>Related Doctors</h1>
                <p className='text-center font-light'>Simply browse through our extensive list of trusted doctors</p>
                <div className='pt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5 '>
                      {
                          allDoctors.filter((doc)=>doc._id!=docInfo._id&&doc.speciality===docInfo.speciality).map(createDoctor)
                      }
                </div>
        </div>
    </div>
  )
}

export default Appointment