import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import Doctor from '../components/Doctor'
import { NavLink, useParams } from 'react-router-dom'
import { specialityData } from '../assets/assets'
const Doctors = () => {
  const{allDoctors}=useContext(AppContext)
  const {speciality} = useParams();
  console.log(speciality);
  
  
  const createDoctor=(props)=>{
    return <Doctor key={props._id} id={props._id} name={props.name} image={props.image} speciality={props.speciality} available={props.available}  />
  }
  return (
    <div className='flex  items-start gap-10 doctors-main'>
      <div className='flex flex-col speciality-menu gap-4 w-full sm:w-fit  overflow'>
        {specialityData.map((item)=>(
          <NavLink to={speciality===`${item.speciality}`?'/doctors':`/doctors/${item.speciality}`}  ><p className='py-2 md:px-2 lg:px-4  outline outline-gray-600 rounded-sm text-gray-800 cursor-pointer lg:w-[max(11vw,230px)] md:text-md lg:text-lg '>{item.speciality}</p></NavLink>
        ))}
      </div>
            <div className='grid lg:grid-cols-4 gap-6 grids'> 
                {
                    allDoctors
                    .filter((item) =>{
                      if(!speciality){
                        return true;
                      }else{
                        return item.speciality===speciality;
                      }
                    }).map(createDoctor)
                }
            </div>
    </div>
  )
}

export default Doctors