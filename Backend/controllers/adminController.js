import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt  from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

const addDoctor=async(req,res)=>{
    try{
        const{name,email,password,about,address,speciality,fees,experience,degree}=req.body;
        const imageFile=req.file;
        
        
        if(!name||!email||!password||!about||!speciality||!degree||!experience||!fees||!address){
           return res.json({success:false,message:"Enter all details"});
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter your email correctly"});
        }
        if(password.length<8){
           return res.json({success:false,message:"Password should contain atleast 8 characters"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        
        const doctorData={
            name,
            email,
            password:hashedPassword,
            fees,
            address:JSON.parse(address),
            image:imageUrl,
            about,
            speciality,
            experience,
            degree,
            date:Date.now()
        }

        const newDoctor= new doctorModel(doctorData);
        await newDoctor.save();
        return res.json({success:true,message:"Doctor added successfully"})
    }catch(err){
        console.log(err);
        
        return res.json({success:false,message:err})
    }
}

const login=async(req,res)=>{
    const{email,password}=req.body;
    try{
        if(email!=process.env.ADMIN_EMAIL){
            return res.json({success:false,message:"Admin doesn't exist"})
        }
        if(password!=process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Enter password correctly"})
        }
        const token=jwt.sign(email+password,process.env.JWT_SECRET);
        return res.json({success:true,token})
    }catch(err){
        return res.json({success:false,message:err})
    }
    
}
const changeAvailability=async(req,res)=>{
    try{
        const{docId}=req.body;
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:"Availability changed"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Can't change Availability"})
    }
    
}


const allDoctors=async(req,res)=>{
    try{
        const response=await doctorModel.find({}).select('-password');
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"Failed to retrive doctors"})
    }
}

const allAppointments=async(req,res)=>{
    try{
        const response=await appointmentModel.find({})
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"Failed to retrive appointments"})
    }
}

const appointmentCancel=async(req,res)=>{
    try{
        const{appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        const {docId,slotTime,slotDate}=appointmentData;
        const docData=await doctorModel.findById(docId);

        let slots_booked=docData.slots_booked;
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime);
        
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        return res.json({success:true,message:"Appointment cancelled"});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}


const adminDashBoard=async(req,res)=>{
    try{
        const doctorData=await doctorModel.find({});
        const patientData=await userModel.find({});
        const appointmentData=await appointmentModel.find({});
        const doctors=doctorData.length;
        const patients=patientData.length;
        const appointments=appointmentData.length;
        const info={
            doctors,
            patients,
            appointments,
            latestAppointments:appointmentData.reverse().slice(0,5)
        }
        return res.json({success:true,message:info})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"something went wrong"})
    }
}
export{addDoctor,login,allDoctors,allAppointments,appointmentCancel,adminDashBoard,changeAvailability}
