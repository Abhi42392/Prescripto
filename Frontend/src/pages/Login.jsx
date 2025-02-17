import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {AppContext} from '../context/AppContext'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
const Login = () => {
  const navigate=useNavigate();
  const[currState,setCurrState]=useState('Login');
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const{backendUrl,setutoken,utoken}=useContext(AppContext)

  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      if(currState==='Login'){
        const url=backendUrl+'/api/user/login';
        const {data}=await axios.post(url,{email,password});
        if(data.success){
          setutoken(data.token)
          localStorage.setItem('utoken',data.token)
          
        }else{
          throw new Error(data.message);
        }
      }else{
        const url=backendUrl+'/api/user/register';
        const {data}=await axios.post(url,{name,email,password});
        if(data.success){
          setutoken(data.token)
          localStorage.setItem('utoken',data.token)
  
        }else{
          throw new Error(data.message);
        }
      }
    }catch(err){
      console.log(err);
      toast.error(err.message||"Something went wrong")
    }
  }

  useEffect(()=>{
    if(utoken){
      navigate('/')
    }
  },[utoken])

  return (
    <div className='flex justify-center mt-[10vh] text-base sm:text-lg text-slate-600'>
      <div className='border-2 border-gray-400 rounded-lg p-6 w-[400px]'>
        {currState==="Login"?<h1 className='text-2xl font-medium text-black'>Login</h1>:<h1 className='text-2xl font-medium text-black'>Create Account</h1>}
        <p>Please {currState==="Login"?`login`:`sign up`} to book appointment</p>
        
        <form onSubmit={submitHandler}>
          {currState!='Login'?
            <div className='my-3 w-full'>
            <label htmlFor="fullname" className='text-lg sm:text-xl text-gray-800'>Full Name</label>
            <input type="text"  className='outline outline-gray-400 mt-2 rounded-sm py-2 px-4 block  w-full ' onChange={(e)=>{setName(e.target.value)}} value={name} />
          </div>
          :<></>}
          <div className='my-3 w-full'>
            <label htmlFor="email" className='text-lg sm:text-xl text-gray-800'>Email</label>
            <input type="text"  className='outline outline-gray-400 mt-2  rounded-sm py-2 px-4 block  w-full' onChange={(e)=>{setEmail(e.target.value)}} value={email} />
          </div>
          <div className='my-3 w-full'>
            <label htmlFor="password " className='text-lg sm:text-xl text-gray-800'>Password</label>
            <input type="password" className='outline outline-gray-400 mt-2  rounded-sm py-2 px-4 block  w-full' onChange={(e)=>{setPassword(e.target.value)}} value={password} />
          </div>
          {currState==="Login"?<button className='bg-[#5f6FFF] text-center py-1 rounded-sm w-full text-white my-2'>Login</button>:<button className='bg-[#5f6FFF] text-center py-1 rounded-sm w-full text-white my-2'>Create account</button>}
          {currState==="Login"?<p className='text-center'>Dont't have an Account?<span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>{setCurrState("Sign up")}}>Sign up here</span></p>:<p  className='text-center'>Already have an Account?<span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>{setCurrState("Login")}}>Login here</span></p>}
        </form>
        
      </div>
    </div>
  )
}

export default Login