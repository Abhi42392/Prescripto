import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true }, // one feedback per appointment
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  userData: { type: Object, required: true }, // snapshot so reviews still show user name/image later
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  date: { type: Number, required: true }, // Date.now()
});

const feedbackModel =
  mongoose.models.feedback || mongoose.model("feedback", feedbackSchema);

export default feedbackModel;
