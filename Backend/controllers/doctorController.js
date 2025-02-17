import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const listDoctors=async(req,res)=>{
    try{
        const response=await doctorModel.find({}).select('-password');
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        
    }
}

const login=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const docData=await doctorModel.findOne({email:email});
      
        
        if(!docData){
            return res.json({success:false,message:"Doctor doesn't exist"})
        }
        const storedPassword=docData.password;
        const compare=await bcrypt.compare(password,storedPassword);
        
        
        if(!compare){
            return res.json({success:false,message:"Enter correct password"})
        }
        const token=createToken(docData._id);
        return res.json({success:true,token})
    }catch(err){
        return res.json({success:false,message:err.message})
    }
    
}

const appointmentsDoctor=async(req,res)=>{
    try{
        const{docId}=req.body;
        const response=await appointmentModel.find({docId:docId});
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
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

const appointmentCompleted=async(req,res)=>{
    try{
        const{appointmentId,docId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
        if(appointmentData&&appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
            return res.json({success:true,message:"Appointment completed"});
        }else{
            return res.json({success:flase,message:"Mark failed"});
        }
        
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}

const doctorDashBoard = async (req, res) => {
    try {
        const { docId } = req.body;

      
        const appointmentData = await appointmentModel.find({ docId: docId });

       
        const patients = await appointmentModel.distinct("userId", { docId: docId });

        
        const appointments = appointmentData.length;

        
        let earnings = 0;
        appointmentData.forEach((item) => {
            if(item.isCompleted){
                earnings += item.amount;
            }
        });

        
        const info = {
            patients: patients.length,
            appointments,
            earnings,
            latestAppointments: appointmentData.slice().reverse().slice(0, 5) // Fix mutation issue
        };

        return res.json({ success: true, message: info });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
};

const getDoctorInfo=async(req,res)=>{
    try{
        const{docId}=req.body;
        const response=await doctorModel.findOne({_id:docId}).select('-password');
        return res.json({success:true,message:response})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"Failed to retrive doctor information"})
    }
}

const editDoctorInfo=async(req,res)=>{
    try{
        const{name,about,fees,address,docId,available}=req.body;
        const imageFile=req.file;
        if(!name||!about||!fees||!available||!address){
            return res.json({success:false,message:"Data missing"});
        }
        await doctorModel.findByIdAndUpdate(docId,{address:JSON.parse(address),name,about,fees,available})
        if(imageFile){
            const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl=imageUpload.secure_url;
            await doctorModel.findByIdAndUpdate(id,{image:imageUrl})
        }
        
        return res.json({success:true,message:"doctor profile updated"});
    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message})
    }
}

export {listDoctors,login,appointmentsDoctor,appointmentCancel,appointmentCompleted,doctorDashBoard,getDoctorInfo,editDoctorInfo}