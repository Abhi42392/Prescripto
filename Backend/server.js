import express from "express";
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongoDb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRouter.js";
import doctorRouter from "./routes/doctorRouter.js";

const app=express();
const PORT=process.env.PORT
connectDB()
connectCloudinary()

app.use(express.json());
app.use(cors())
app.use('/api/admin',adminRouter);
app.use('/api/user',userRouter);
app.use('/api/doctor',doctorRouter);

app.get("/",(req,res)=>{
    res.send("I am in server.js")
})

app.listen(PORT,(req,res)=>{
    console.log("Server running on "+PORT);
    
})