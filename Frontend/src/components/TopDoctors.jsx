import React, { useContext } from 'react'
import Doctor from './Doctor'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const TopDoctors = () => {
    const navigate=useNavigate();
    const{allDoctors}=useContext(AppContext);
  const createDoctor=(props)=>{
    return <Doctor key={props._id} id={props._id} name={props.name} image={props.image} speciality={props.speciality} available={props.available}  />
  }
  return (
    <div>
        <div className='flex flex-col items-center'>
            <h1 className='text-center text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='text-center font-light'>Simply browse through our extensive list of trusted doctors</p>
            <div className='pt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 '>
                {
                    allDoctors.slice(0,10).map(createDoctor)
                }
            </div>
            <button className='py-2 px-4 rounded-2xl bg-blue-100 mt-10 w-35' onClick={()=>{navigate('/doctors'); scrollTo(0,0)}}>more</button>
        </div>
    </div>
  )
}

export default TopDoctors