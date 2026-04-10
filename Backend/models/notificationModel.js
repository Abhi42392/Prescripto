import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  appointmentId: { type: String, required: true },
  type: {
    type: String,
    enum: ["accepted", "rejected", "rescheduled", "completed"],
    required: true,
  },
  message: { type: String, required: true },
  newSlotDate: { type: String },
  newSlotTime: { type: String },
  isRead: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
});

const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default notificationModel;
