import React, { useContext ,useState} from 'react'
import { assets } from '../../assets/assets'
import { specialityData } from '../../../../Frontend/src/assets/assets'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const AddDoctor = () => {
  const{aToken,backendUrl}=useContext(AdminContext)
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[about,setAbout]=useState('');
  const[fees,setFees]=useState('');
  const[degree,setDegree]=useState('');
  const[speciality,setspeciality]=useState('General physician');
  const[experience,setExperience]=useState('1 Year');
  const[image,setImage]=useState(false);
  const[address,setAddress]=useState({
    "line1":'',"line2":''
  });

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const fd= new FormData();
      fd.append('name',name);
      fd.append('email',email);
      fd.append('password',password);
      fd.append('image',image);
      fd.append("address", JSON.stringify(address));
      fd.append('experience',experience);
      fd.append('speciality',speciality);
      fd.append('degree',degree);
      fd.append('fees',fees);
      fd.append('about',about);
      
      const response=await axios.post(`${backendUrl}/api/admin/add-doctor`,fd,{headers:{aToken}})
      if(response.data.success){
        setName('');
        setImage(false);
        setAddress({
          "line1":'',"line2":''
        });
        setPassword('');
        setExperience('1 year');
        setDegree('');
        setAbout('');
        setspeciality('General physician');
        setEmail('');
        setFees('');
        toast.success("Doctor Added");
      }else{
        throw new Error("Can't add doctor");
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }
  return (
    <div className='p-6 shadow-md w-full lg:w-[75%] rounded-sm max-h-[90vh] overflow-y-scroll'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-2'>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="upload image" className='w-20 cursor-pointer'  />
          </label>
          <input id="image" type="file" accept='image/*' hidden onChange={(e)=>{setImage(e.target.files[0])}} />
          <p>Upload doctor<br />picture</p>
        </div>
        <div className='add-doctor'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="name">Your name</label>
              <input type="text" placeholder='Name' className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setName(e.target.value)}}  value={name} required/>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="speciality">speciality</label>
              <select name="speciality"  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setspeciality(e.target.value)}}  value={speciality} required>
                {
                  specialityData.map((item)=>(
                    <option value={item.speciality}>{item.speciality}</option>
                  ))
                }
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="email">Doctor Email</label>
              <input type="text" placeholder='Email'  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setEmail(e.target.value)}}  value={email} required/>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="degree">Degree</label>
              <input type="text" placeholder='Degree'  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setDegree(e.target.value)}}  value={degree}  required/>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="password">Set Password</label>
              <input type="password" placeholder='Password'  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setPassword(e.target.value)}}  value={password}  required/>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="address">Address</label>
              <input type="text" placeholder='Address 1'  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setAddress(prev=>({...prev,["line1"]:e.target.value}))}}  value={address.line1}  required />
              <input type="text" placeholder='Adress 2'  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600' onChange={(e)=>{setAddress(prev=>({...prev,["line2"]:e.target.value}))}}  value={address.line2}  required/>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="experience">Experience</label>
              <select name="experience"  className='border-2 border-gray-500 w-full  rounded-sm px-4 py-2 outline-blue-600'  onChange={(e)=>{setExperience(e.target.value)}}  value={experience} required>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
                <option value="3 years">3 years</option>
                <option value="4 years">4 years</option>
                <option value="5 years">5 years</option>
                <option value="6 years">6 years</option>
                <option value="7 years">7 years</option>
                <option value="8 years">8 years</option>
                <option value="9 years">9 years</option>
                <option value="10 years">10 years</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="address">Fees</label>
              <input type="number" placeholder='Doctor fees'  required className='border-2 border-gray-500 w-full rounded-sm px-4 py-2 outline-blue-600'  onChange={(e)=>{setFees(e.target.value)}}  value={fees}  />
            </div>
            
          </div>
          <div className='flex flex-col gap-1'>
              <label htmlFor="about">About</label>
              <textarea type="text" placeholder='write about doctor'  required className='border-2 border-gray-500 w-full rounded-sm px-4 py-2 outline-blue-600'  onChange={(e)=>{setAbout(e.target.value)}}  value={about} />
          </div>
        </div>
        <button className='bg-[#5f6FFF] rounded-full px-8 py-2 text-white mt-6'>Add Doctor</button>
      </form>
    </div>
  )
}

export default AddDoctor