import express from 'express'
import {  appointmentCancel, appointmentCompleted, appointmentsDoctor, doctorDashBoard, editDoctorInfo, getDoctorInfo, listDoctors, login } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js'
import upload from '../middleware/multer.js';
const doctorRouter=express.Router();


doctorRouter.post('/list',listDoctors)
doctorRouter.post('/login',login)
doctorRouter.post('/appointments-doctor',authDoctor,appointmentsDoctor)
doctorRouter.post('/appointment-cancel',authDoctor,appointmentCancel)
doctorRouter.post('/appointment-completed',authDoctor,appointmentCompleted)
doctorRouter.post('/doctor-dashboard',authDoctor,doctorDashBoard)
doctorRouter.post('/get-info',authDoctor,getDoctorInfo)
doctorRouter.post('/edit-info',upload.single('image'),authDoctor,editDoctorInfo)


export default doctorRouter