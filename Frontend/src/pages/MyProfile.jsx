import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
const MyProfile = () => {
  const{userInfo,setUserInfo,utoken,fetchUserInfo,backendUrl}=useContext(AppContext)
  const[isEdit,setIsEdit]=useState(false);
  const[image,setImage]=useState(false);
  const saveInfo=async()=>{
    try{
      const fd=new FormData();
      fd.append('name',userInfo.name);
      fd.append('email',userInfo.email);
      fd.append('phone',userInfo.phone);
      fd.append('address',JSON.stringify(userInfo.address));
      fd.append('gender',userInfo.gender);
      fd.append('dob',userInfo.dob);
      image&&fd.append('image',image);
      const {data}=await axios.post(`${backendUrl}/api/user/edit-info`,fd,{headers:{utoken}});
      if(data.success){
        toast.success(data.message);
        await fetchUserInfo();
        setImage(false)
        setIsEdit(false)
      }else{
        throw new Error("Failed to update user profile")
      }
      
    }catch(err){
      console.log(err.message||"Something went wrong");
      toast.error(err.message||"Something went wrong")
    }
    
  }
  return userInfo&&(
    <div className='list-none profile '>
      {
        isEdit?
        <div>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):userInfo.image} alt="" className='max-h-32 sm:max-h-44' />
            <p>Edit image</p>
          </label>
          <input id='image' type="file" accept='images/*' hidden onChange={(e)=>{setImage(e.target.files[0])}}/>
        </div>
        :<img src={image?URL.createObjectURL(image):userInfo.image} alt="profile pic" className='max-w-32 sm:max-w-44'/>
      }
      {
        isEdit?
        <input type="text" value={userInfo.name} className='font-medium text-4xl my-4 outline-none' onChange={(e)=>{setUserInfo(prev=>({...prev,name:e.target.value}))}} />
        :<p className='my-4 text-3xl font-medium sm:text-4xl'>{userInfo.name}</p>
      }
      <div>
        <p className='my-2 underline text-gray-600 font-mono text-lg sm:text-xl'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 max-w-[600px] my-4 text-lg sm:text-xl'>
          <p>Email id:</p><p>{userInfo.email}</p>
          <p>Phone:</p>
          {
          isEdit?
            <input type="text" value={userInfo.phone} className='outline-none' onChange={(e)=>{setUserInfo(prev=>({...prev,phone:e.target.value}))}} />
            :<p>{userInfo.phone}</p>
          }
          <p>Address:</p>
          {
          isEdit?
            <div>
            <input type="text" value={userInfo.address.line1} className='outline-none' onChange={(e)=>{setUserInfo(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}} />
            <input type="text" value={userInfo.address.line2} className='outline-none' onChange={(e)=>{setUserInfo(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}} /></div>
            :<div><p>{userInfo.address.line1}</p>
            <p>{userInfo.address.line2}</p>
            </div>
          }
        </div>
      </div>
      <div>
        <p className='my-2 underline text-gray-600 font-mono text-lg sm:text-xl'>BASIC INFORMATION</p>
          <div  className='grid grid-cols-[1fr_3fr]  max-w-[600px] gap-y-2.5 my-4text-lg sm:text-xl'>
          <p>Gender:</p>
          {isEdit?
            <select className='w-fit' onChange={(e)=>{setUserInfo(prev=>({...prev,gender:e.target.value}))}}>
              <option value="Male">Male</option>
              <option value="Female">female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            :<p>{userInfo.gender}</p>
          }
        
        <p>Birthday:</p>
        {
        isEdit?
          <input type="date" className='w-40 outline-none' onChange={(e)=>{setUserInfo(prev=>({...prev,dob:e.target.value}))}} />
          :<p>{userInfo.dob}</p>
        }
        
      </div>
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