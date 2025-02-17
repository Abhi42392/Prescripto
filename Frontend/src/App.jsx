import React, { useContext } from 'react'
import {Route,Routes} from 'react-router-dom'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { AppContext } from './context/AppContext'
import Loader from './components/Loader'
const App = () => {
  const{isLoading}=useContext(AppContext)
  if(isLoading){
    return <Loader />
  }
  return (
    <div className='mx-4 sm:mx-[10vw] my-5'>
      <NavBar />
      <ToastContainer />
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/doctors' element={<Doctors />}/>
          <Route path='/doctors/:speciality' element={<Doctors />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/my-profile' element={<MyProfile />}/>
          <Route path='/my-appointments' element={<MyAppointments />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/appointments/:docId' element={<Appointment/>}/>
      </Routes>
      <Footer />
    </div>
  )
}
export default App