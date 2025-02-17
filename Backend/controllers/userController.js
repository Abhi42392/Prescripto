import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

const editUserInfo=async(req,res)=>{
    try{
        const{name,gender,phone,dob,address,id}=req.body;
        const imageFile=req.file;
        if(!name||!phone||!dob||!gender){
            return res.json({success:false,message:"Data missing"});
        }
        await userModel.findByIdAndUpdate(id,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl=imageUpload.secure_url;
            await userModel.findByIdAndUpdate(id,{image:imageUrl})
        }
        
        return res.json({success:true,message:"User profile updated"});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const exsitingUser=await userModel.findOne({email});
        if(!exsitingUser){
            return res.json({success:false,message:"User does not exists"});
        }
        const storedPassword=exsitingUser.password;
        const compare=await bcrypt.compare(password,storedPassword);
        if(!compare){
            return res.json({success:false,message:"Enter correct password"})
        }
        const token=createToken(exsitingUser._id);
        return res.json({success:true,token})
    }catch(err){
        console.log(err)
        return res.json({success:false,message:err})
    }
}

const register=async(req,res)=>{
    try{
        const{email,password,name}=req.body;
        
        const exsitingUser=await userModel.findOne({email});
        if(!email||!password||!name){
            return res.json({success:false,message:"Enter all details"})
        }
        if(exsitingUser){
            return res.json({success:false,message:"User already exist"})
        }
        if(password.length<8){
            return res.json({success:false,message:"password should contain atleast 8 characters"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const data={name,email,password:hashedPassword}
        const newUser=await userModel(data);
        await newUser.save();
        const token=createToken(newUser._id);
        return res.json({success:true,token:token})
    }catch(err){
        console.log(err);
    }
}
const getUserInfo=async(req,res)=>{
    try{
        const{id}=req.body;
        const response=await userModel.findOne({_id:id}).select('-password');
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"Failed to retrive user information"})
    }
}

//API for appointment
const bookAppointment=async(req,res)=>{
    try{
        const{docId,id,slotTime,slotDate}=req.body;
        const userData=await userModel.findById(id).select('-password');
        const docData=await doctorModel.findById(docId).select('-password');
        if(!docData||!docData.available){
            return res.json({success:false,message:"Doctor is not available"})
        }
        let slots_booked=docData.slots_booked;
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot is not available"})
            }else{
                slots_booked[slotDate].push(slotTime);
            }
        }else{
            slots_booked[slotDate]=[];
            slots_booked[slotDate].push(slotTime);
        }
        delete docData.slots_booked;
        const data={
            docId,
            userId:id,
            docData,
            userData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointment=new appointmentModel(data);
        await newAppointment.save();
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        return res.json({success:true,message:'Appointment Booked'})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}

const listAppointment=async(req,res)=>{
    try{
        const{id}=req.body;
        const response= (await appointmentModel.find({userId:id})).reverse()
        return res.json({success:true,message:response});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}

const cancelAppointment=async(req,res)=>{
    try{
        const{id,appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
        if(appointmentData.userId!=id){
            return res.json({success:false,message:"Unauthorised action"});
        }

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

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorPay=async(req,res)=>{
    try{
        const{appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
        
        if(!appointmentData||appointmentData.cancelled){
            return res.json({success:false,message:"Appointment either cancelled or Unavailable"});
        }
        const options={
            currency:process.env.CURRENCY,
            amount:appointmentData.amount*100*85,
            receipt:appointmentId
        }
        const order=await razorpayInstance.orders.create(options);
        res.json({success:true,order})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message||"Something went wrong"})
    }
}


const verifyPayment=async(req,res)=>{
    try{
        const{razorpay_order_id}=req.body;
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status==="paid"){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            return res.json({success:true,message:"Payment sucessful"});
        }else{
            return res.json({success:false,message:"Payment failed"});
        }
        
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message||"Something went wrong"})
    }
}

export{register,login,editUserInfo,getUserInfo,bookAppointment,listAppointment,cancelAppointment,paymentRazorPay,verifyPayment}