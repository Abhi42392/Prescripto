import React from 'react'
import {assets} from '../assets/assets'
const Contact = () => {
  return (
    <div className='pb-32' >
      <h1 className='font-semibold text-xl text-center pb-5'>CONTACT US</h1>
      <div className='flex flex-col  sm:flex-row gap-8 '>
        <img src={assets.contact_image} alt="" className='max-w-[360px]'/>
        <div className='flex flex-col space-y-4 justify-between'>
          <p className='font-medium text-lg'>OUR OFFICE</p>
          <p>54908 Willms station <br /> suite 350, Washington, USA</p>
          <p>Telephone:(415)555-0132 <br /> Email:prescripto@help.com</p>
          <p className='font-medium text-lg'>CAREER AT PRESCRIPTO</p>
          <p>Learn more about our team and job openings</p>
          <button className='p-3 outline outline-gray-600 w-fit font-medium'>Explore jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact