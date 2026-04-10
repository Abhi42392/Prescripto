import express from "express";
import {
  appointmentCancel,
  appointmentCompleted,
  appointmentsDoctor,
  appointmentAccept,
  appointmentReschedule,
  doctorDashBoard,
  editDoctorInfo,
  getDoctorInfo,
  listDoctors,
  login,
  getBookedSlots,
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";
import upload from "../middleware/multer.js";
import notificationModel from "../models/notificationModel.js";
const doctorRouter = express.Router();

doctorRouter.post("/list", listDoctors);
doctorRouter.post("/login", login);
doctorRouter.post("/appointments-doctor", authDoctor, appointmentsDoctor);
doctorRouter.post("/appointment-cancel", authDoctor, appointmentCancel);
doctorRouter.post("/appointment-completed", authDoctor, appointmentCompleted);
doctorRouter.post("/doctor-dashboard", authDoctor, doctorDashBoard);
doctorRouter.post("/get-info", authDoctor, getDoctorInfo);
doctorRouter.post("/appointment-accept", authDoctor, appointmentAccept);
doctorRouter.post("/appointment-reschedule", authDoctor, appointmentReschedule);
doctorRouter.post(
  "/edit-info",
  upload.single("image"),
  authDoctor,
  editDoctorInfo,
);
// doctorRouter.js
doctorRouter.post("/get-booked-slots", authDoctor, getBookedSlots);

export default doctorRouter;
