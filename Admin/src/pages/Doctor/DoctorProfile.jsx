import React, { useContext, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios'
import { toast } from 'react-toastify';
const MyProfile = () => {
  const{doctorInfo,setDoctorInfo,dtoken,fetchDoctorInfo,backendUrl}=useContext(DoctorContext)
  const[isEdit,setIsEdit]=useState(false);
  const[image,setImage]=useState(false);
  const saveInfo=async()=>{
    try{
      const fd=new FormData();
      fd.append('name',doctorInfo.name);
      fd.append('fees',doctorInfo.fees);
      fd.append('about',doctorInfo.about);
      fd.append('address',JSON.stringify(doctorInfo.address));
      fd.append('available',doctorInfo.available);
      image&&fd.append('image',image);
      const {data}=await axios.post(`${backendUrl}/api/doctor/edit-info`,fd,{headers:{dtoken}});
      if(data.success){
        toast.success(data.message);
        await fetchDoctorInfo();
        setImage(false)
        setIsEdit(false)
      }else{
        throw new Error("Failed to update doctor profile")
      }
      
    }catch(err){
      console.log(err.message||"Something went wrong");
      toast.error(err.message||"Something went wrong")
    }
    
  }
  return doctorInfo&&(
    <div className='list-none profile space-y-4 '>
      {
        isEdit?
        <div>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):doctorInfo.image} alt="" className='max-h-32 sm:max-h-44' />
            <p>Edit image</p>
          </label>
          <input id='image' type="file" accept='images/*' hidden onChange={(e)=>{setImage(e.target.files[0])}}/>
        </div>
        :<img src={image?URL.createObjectURL(image):doctorInfo.image} alt="profile pic" className='max-w-32 sm:max-w-44'/>
      }
      {
        isEdit?
        <input type="text" value={doctorInfo.name} className='font-medium text-4xl my-4 outline-none' onChange={(e)=>{setDoctorInfo(prev=>({...prev,name:e.target.value}))}} />
        :<p className='my-4 text-3xl font-medium sm:text-4xl'>{doctorInfo.name}</p>
      }
      <div className='flex gap-2 items-center'>
        <p className='font-medium'>{doctorInfo.degree+" - "+doctorInfo.speciality}</p>
        <p className='border border-gray-600 px-2 py-1 rounded-full'>{doctorInfo.experience}</p>
      </div>
      <div>
        <p className='font-medium'>About:</p>
        {
          isEdit?
          <textarea value={doctorInfo.about}  onChange={(e)=>{setDoctorInfo(prev=>({...prev,about:e.target.value}))}} className='w-[70%]'  />
          :
          <p>{doctorInfo.about}</p>
        }
      </div>
      
      <div>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 max-w-[600px] my-4'>
          
          <p className='font-medium'>Address:</p>
          {
          isEdit?
            <div>
            <input type="text" value={doctorInfo.address.line1} className='outline-none' onChange={(e)=>{setDoctorInfo(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}} />
            <input type="text" value={doctorInfo.address.line2} className='outline-none' onChange={(e)=>{setDoctorInfo(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}} /></div>
            :<div><p>{doctorInfo.address.line1}</p>
            <p>{doctorInfo.address.line2}</p>
            </div>
          }
        </div>
      </div>
      <div className='flex gap-1'>
        <p className='font-medium '>Appointment fee:</p>
        {
          isEdit?
          <input type='text' value={doctorInfo.fees}  onChange={(e)=>{setDoctorInfo(prev=>({...prev,fees:e.target.value}))}}  />
          :
          <p>${doctorInfo.fees}</p>
        }
      </div>
      
      <div className='flex gap-1'>
        {
          isEdit?
          <input type='checkbox' checked={doctorInfo.available}  onChange={(e)=>{setDoctorInfo(prev=>({...prev,available:e.target.checked}))}}  />
          :
          <input type='checkbox' checked={doctorInfo.available}    />

        }
        <p className='font-medium '>Available</p>
      </div>
          
      {
        isEdit?
        <button onClick={saveInfo} className='text-lg sm:text-xl rounded-full px-8 py-2 mt-5 text-white bg-[#5f6FFF]'>Save</button>
        :<button onClick={()=>{setIsEdit(!isEdit)}} className=' text-lg sm:text-xl rounded-full py-1 px-8 sm:py-2 mt-5 text-white bg-[#5f6FFF]'>Edit</button>
      }
    </div>
  )
}

export default MyProfile