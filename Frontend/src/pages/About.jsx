import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <h1 className='text-2xl text-center mb-10'>ABOUT US</h1>
      <div className='flex flex-col md:flex-row gap-4'>
        <img src={assets.about_image} alt="about image" className='w-full sm:max-w-[360px] flex-grow-0 sm:max-h-[360px]' />
        <div className='flex flex-col justify-between text-base sm:text-lg text-gray-600'>
        <p >
        Welcome to Prescripto, where we are passionate about making a difference. 
        Our journey began with a simple yet powerful vision—to provide innovative, reliable, and high-quality solutions that cater to 
        the evolving needs of our customers. With a strong commitment to excellence, we strive to deliver services that not only meet 
        expectations but exceed them.

          </p>
          <p className='my-10'>At Prescripto, we believe in the power of innovation, customer satisfaction, and integrity.
           Our dedicated team works tirelessly to bring you products and services that add value to your life. 
           Whether it’s through cutting-edge technology, exceptional customer support, or sustainable business practices,
            we are always focused on growth and improvement.

          We take pride in building lasting relationships with our customers, partners, and community. 
          Thank you for being part of our journey—we look forward to growing together and making a meaningful impact.
        </p>
        <p className='text-lg sm:text-xl text-black'>Our Vision</p>
          <p>We are committed to excellence, transparency, and customer satisfaction, 
            ensuring that our services not only meet but exceed expectations. By embracing cutting-edge technology 
            and sustainable practices, we aim to make a positive impact on our community and the industry as a whole.</p>
        
        </div>
      </div>
      <div className='mt-13'>
        <h2 className='text-2xl font-semibold my-5'>WHY CHOOSE US</h2>
        <div className='flex flex-col sm:flex-row  border-2 border-gray-600'>
            <div className='p-[3vw] border-b-2 sm:border-r-2 sm:border-b-0' >
              <h3 className='text-xl font-semibold pb-4'>EFFICIENCY</h3>
              <p className='sm:w-[70%]'>
              Streamlined appointment scheduling that fits into your busy lifestyle.
              </p>
            </div>
            <div className='p-[3vw] border-b-2 sm:border-r-2 sm:border-b-0'>
            <h3 className='text-xl font-semibold pb-4 '>CONVENIENCE</h3>
            <p className='sm:w-[70%]'>Access to a network of trusted healthcare professionals in your area.</p>
            </div>
            <div className='p-[3vw]'>
            <h3 className='text-xl font-semibold pb-4'>PERSONALIZATION</h3>
            <p className='sm:w-[70%]'>Tailored recommendations and reminders to help you stay on top of your health.</p>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default About