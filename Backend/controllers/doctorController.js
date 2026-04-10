import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import notificationModel from "../models/notificationModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const listDoctors = async (req, res) => {
  try {
    const response = await doctorModel.find({}).select("-password");
    return res.json({ success: true, message: response });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const docData = await doctorModel.findOne({ email: email });

    if (!docData) {
      return res.json({ success: false, message: "Doctor doesn't exist" });
    }
    const storedPassword = docData.password;
    const compare = await bcrypt.compare(password, storedPassword);

    if (!compare) {
      return res.json({ success: false, message: "Enter correct password" });
    }
    const token = createToken(docData._id);
    return res.json({ success: true, token });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const response = await appointmentModel.find({ docId: docId });
    return res.json({ success: true, message: response });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    const { docId, slotTime, slotDate } = appointmentData;
    const docData = await doctorModel.findById(docId);

    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Create notification
    await notificationModel.create({
      userId: appointmentData.userId,
      docId,
      appointmentId,
      type: "rejected",
      message: `Dr. ${appointmentData.docData.name} has declined your appointment on ${slotDate} at ${slotTime}. You can book a new appointment with another available slot.`,
      date: Date.now(),
    });

    return res.json({ success: true, message: "Appointment cancelled" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const appointmentCompleted = async (req, res) => {
  try {
    const { appointmentId, docId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Mark failed" });
    }
    if (!appointmentData.isAccepted) {
      return res.json({
        success: false,
        message: "Appointment not yet accepted",
      });
    }

    const parts = appointmentData.slotDate.split("-");
    const [time, period] = appointmentData.slotTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const appointmentDate = new Date(
      parts[2],
      parts[1] - 1,
      parts[0],
      hours,
      minutes,
    );
    if (new Date() < appointmentDate) {
      return res.json({
        success: false,
        message: "Cannot complete before scheduled time",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    // Create notification
    await notificationModel.create({
      userId: appointmentData.userId,
      docId,
      appointmentId,
      type: "completed",
      message: `Your appointment with Dr. ${appointmentData.docData.name} on ${appointmentData.slotDate} has been completed. Thank you for visiting! Please leave a feedback.`,
      date: Date.now(),
    });

    return res.json({ success: true, message: "Appointment completed" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const doctorDashBoard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointmentData = await appointmentModel.find({ docId: docId });

    const patients = await appointmentModel.distinct("userId", {
      docId: docId,
    });

    const appointments = appointmentData.length;

    let earnings = 0;
    appointmentData.forEach((item) => {
      if (item.isCompleted) {
        earnings += item.amount;
      }
    });

    const info = {
      patients: patients.length,
      appointments,
      earnings,
      latestAppointments: appointmentData.slice().reverse().slice(0, 5), // Fix mutation issue
    };

    return res.json({ success: true, message: info });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const getDoctorInfo = async (req, res) => {
  try {
    const { docId } = req.body;
    const response = await doctorModel
      .findOne({ _id: docId })
      .select("-password");
    return res.json({ success: true, message: response });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Failed to retrive doctor information",
    });
  }
};

const editDoctorInfo = async (req, res) => {
  try {
    const { name, about, fees, address, docId, available } = req.body;
    const imageFile = req.file;
    if (!name || !about || !fees || !available || !address) {
      return res.json({ success: false, message: "Data missing" });
    }
    await doctorModel.findByIdAndUpdate(docId, {
      address: JSON.parse(address),
      name,
      about,
      fees,
      available,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await doctorModel.findByIdAndUpdate(id, { image: imageUrl });
    }

    return res.json({ success: true, message: "doctor profile updated" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const appointmentAccept = async (req, res) => {
  try {
    const { appointmentId, docId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    if (appointmentData.cancelled || appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "Cannot accept this appointment",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isAccepted: true,
    });

    // Create notification
    await notificationModel.create({
      userId: appointmentData.userId,
      docId,
      appointmentId,
      type: "accepted",
      message: `Dr. ${appointmentData.docData.name} has accepted your appointment on ${appointmentData.slotDate} at ${appointmentData.slotTime}. Please proceed with the payment.`,
      date: Date.now(),
    });

    return res.json({ success: true, message: "Appointment accepted" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const appointmentReschedule = async (req, res) => {
  try {
    const { appointmentId, docId, newSlotDate, slotTime } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    if (appointmentData.cancelled || appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "Cannot reschedule this appointment",
      });
    }

    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    const oldDate = appointmentData.slotDate;

    if (slots_booked[oldDate]) {
      slots_booked[oldDate] = slots_booked[oldDate].filter(
        (e) => e !== appointmentData.slotTime,
      );
    }

    if (!slots_booked[newSlotDate]) {
      slots_booked[newSlotDate] = [];
    }
    if (slots_booked[newSlotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    slots_booked[newSlotDate].push(slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: slotTime,
    });

    // Create notification
    await notificationModel.create({
      userId: appointmentData.userId,
      docId,
      appointmentId,
      type: "rescheduled",
      message: `Dr. ${appointmentData.docData.name} has rescheduled your appointment to ${newSlotDate} at ${slotTime}. If this doesn't work for you, you can cancel and rebook.`,
      newSlotDate,
      newSlotTime: slotTime,
      date: Date.now(),
    });

    return res.json({
      success: true,
      message: `Rescheduled to ${newSlotDate}`,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { docId, date } = req.body;
    const docData = await doctorModel.findById(docId);
    const slots_booked = docData.slots_booked || {};
    const booked = slots_booked[date] || [];
    return res.json({ success: true, bookedSlots: booked });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

export {
  listDoctors,
  login,
  appointmentsDoctor,
  appointmentReschedule,
  appointmentAccept,
  appointmentCancel,
  appointmentCompleted,
  doctorDashBoard,
  getDoctorInfo,
  editDoctorInfo,
  getBookedSlots,
};
