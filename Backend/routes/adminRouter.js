import { addDoctor, adminDashBoard, allAppointments, allDoctors, appointmentCancel, login,changeAvailability } from "../controllers/adminController.js";
import express from 'express';
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
const adminRouter=express.Router();

adminRouter.post("/add-doctor",authAdmin,upload.single('image'),addDoctor);
adminRouter.post("/admin-login",login);
adminRouter.post("/list-doctors",authAdmin,allDoctors);
adminRouter.post("/list-appointments",authAdmin,allAppointments);
adminRouter.post("/appointment-cancel",authAdmin,appointmentCancel);
adminRouter.post("/admin-dashboard",authAdmin,adminDashBoard);
adminRouter.post("/change",authAdmin,changeAvailability);

export default adminRouter;