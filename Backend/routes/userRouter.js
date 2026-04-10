import express from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/authUser.js";
import {
  bookAppointment,
  cancelAppointment,
  editUserInfo,
  getUserInfo,
  listAppointment,
  login,
  paymentRazorPay,
  register,
  verifyPayment,
  submitFeedback,
  getDoctorFeedback,
  getNotifications,
  markNotificationRead,
  getUnreadCount,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), register);
userRouter.post("/login", login);
userRouter.post("/get-info", authUser, getUserInfo);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.post("/edit-info", upload.single("image"), authUser, editUserInfo);
userRouter.post("/list-appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorPay);
userRouter.post("/verify-payment", authUser, verifyPayment);
userRouter.post("/submit-feedback", authUser, submitFeedback);
userRouter.get("/doctor-feedback/:docId", getDoctorFeedback);
userRouter.post("/notifications", authUser, getNotifications);
userRouter.post("/mark-notification-read", authUser, markNotificationRead);
userRouter.post("/unread-count", authUser, getUnreadCount);
export default userRouter;
