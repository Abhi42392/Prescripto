import React, { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Doctor from '../../components/Doctor'

const DoctorsList = () => {
  const{doctors}=useContext(AdminContext)
  const createDoctor=(props)=>{
    return <Doctor key={props._id} id={props._id} name={props.name} image={props.image} speciality={props.speciality} available={props.available}  />
  }
  return (
    <div>
      <div className='grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6 grids mb-4'> 
        {
          doctors.map(createDoctor)
        }
      </div>
    </div>
  )
}

export default DoctorsList