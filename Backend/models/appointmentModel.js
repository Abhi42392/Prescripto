import mongoose from 'mongoose'

const appointmentSchema=new  mongoose.Schema({
    userId:{type:String,required:true},
    docId:{type:String,required:true},
    slotDate:{type:String,required:true},
    slotTime:{type:String,required:true},
    userData:{type:Object,required:true},
    docData:{type:Object,required:true},
    payment:{type:Boolean,default:false},
    cancelled:{type:Boolean,default:false},
    amount:{type:Number,required:true},
    isCompleted:{type:Boolean,default:false},
    date:{type:Number,required:true}
})

const appointmentModel=mongoose.models.appointment||mongoose.model("appointment",appointmentSchema);

export default appointmentModel;