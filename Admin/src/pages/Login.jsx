import React,{useContext, useState} from 'react'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
const Login = () => {
    const{backendUrl,setAToken}=useContext(AdminContext);
    const{setDToken}=useContext(DoctorContext)
    const[currState,setCurrState]=useState("Admin");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            if(currState==="Admin"){
                const response=await axios.post(`${backendUrl}/api/admin/admin-login`,{email,password});
                console.log(response.data);
                if(response.data.success){
                    setEmail("");
                    setPassword("");
                    setAToken(response.data.token)
                    localStorage.setItem('aToken',response.data.token)
                }else{
                    toast.error(response.data.message);
                }
            }else{
                const response=await axios.post(`${backendUrl}/api/doctor/login`,{email,password});
                if(response.data.success){
                    setEmail("");
                    setPassword("");
                    setDToken(response.data.token)
                    localStorage.setItem('dtoken',response.data.token)
                }else{
                    toast.error(response.data.message);
                }
            }
        }catch(err){
            console.log(err);
        }
    }

  return (
    <div className='flex justify-center pt-[20vh]'>
        <div className='px-4 py-8 shadow-md rounded-xl w-[300px]'>
            <h2 className='font-bold text-2xl text-center'><span  className='text-[#5f6FFF] mr-2'>{currState==="Admin"?"Admin":"Doctor"}</span>Login</h2>
            <form onSubmit={handleSubmit} className='flex flex-col mt-4'>
                <label htmlFor="email" >Email</label>
                <input type="text" placeholder='Enter email' className='border-[1px] outline outline-[#5f6FFF] px-2 rounded-sm  border-gray-500' onChange={(e)=>{setEmail(e.target.value)}} value={email} />
                <label htmlFor="password" className='mt-2'>Password</label>
                <input type="password" placeholder='Enter password' className='border-[1px] outline outline-[#5f6FFF] px-2 rounded-sm  border-gray-500 ' onChange={(e)=>{setPassword(e.target.value)}} value={password} />
                <button className='my-4 bg-[#5f6FFF] text-white rounded-sm py-1'>Login</button>
                {currState==="Admin"?<p onClick={()=>{setCurrState("Doctor")}} className='text-center'>Doctor Login?<span className='ml-1 underline text-blue-500 cursor-pointer'>click here</span></p>:
                <p onClick={()=>{setCurrState("Admin")}} className='text-center '>Admin Login?<span className='ml-1 underline text-blue-500 cursor-pointer'>click here</span></p>}
            </form>
        </div>
    </div>
  )
}

export default Login