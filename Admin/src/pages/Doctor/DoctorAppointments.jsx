import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorAppointments = () => {
  const {
    appointments,
    fetchAppointments,
    dtoken,
    appointmentCancel,
    appointmentCompleted,
    appointmentAccept,
    appointmentReschedule,
    getBookedSlots,
  } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);

  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (dtoken) {
      fetchAppointments();
    }
  }, [dtoken]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setNewDate(selectedDate);
    setNewTime("");

    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const [year, month, day] = selectedDate.split("-");
    const formattedDate = `${parseInt(day)}-${parseInt(month)}-${year}`;

    setLoadingSlots(true);
    const booked = await getBookedSlots(formattedDate);

    // Generate slots dynamically — same logic as Appointment.jsx
    const selected = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const today = new Date();
    const isToday =
      selected.getDate() === today.getDate() &&
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear();

    let startHour = 10;
    let startMinutes = 0;

    if (isToday) {
      let nextHour = today.getHours();
      let nextMinutes = today.getMinutes();

      if (nextMinutes > 30) {
        nextHour += 1;
        nextMinutes = 0;
      } else {
        nextMinutes = 30;
      }

      if (nextHour < 10) {
        nextHour = 10;
        nextMinutes = 0;
      } else if (nextHour >= 21) {
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }

      startHour = nextHour;
      startMinutes = nextMinutes;
    }

    const currentDate = new Date(selected);
    currentDate.setHours(startHour, startMinutes, 0, 0);

    const endTime = new Date(selected);
    endTime.setHours(21, 0, 0, 0);

    const slots = [];
    while (currentDate < endTime) {
      const formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!booked.includes(formattedTime)) {
        slots.push(formattedTime);
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    setAvailableSlots(slots);
    setLoadingSlots(false);
  };

  const isAppointmentPassed = (slotDate, slotTime) => {
    const parts = slotDate.split("-");
    const [time, period] = slotTime.split(" ");
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
    return new Date() > appointmentDate;
  };

  const handleReschedule = (id) => {
    if (!newDate || !newTime) return;

    const [year, month, day] = newDate.split("-");
    const formattedDate = `${parseInt(day)}-${parseInt(month)}-${year}`;

    appointmentReschedule(id, formattedDate, newTime);
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
    setAvailableSlots([]);
  };

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-h-[80vh] min-h-[60vh] border-2 border-gray-600 overflow-y-scroll max-w-4xl sm:m-5">
      <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] grid-flow-col py-3 px-6 border-b bg-gray-50 font-semibold text-gray-700">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Fees</p>
        <p className="text-center">Actions</p>
      </div>

      {appointments.map((item, index) => {
        const timePassed = isAppointmentPassed(item.slotDate, item.slotTime);

        return (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-1 border-b items-center text-gray-500 px-3 py-4 hover:bg-gray-50"
          >
            <div className="max-sm:hidden">{index + 1}</div>

            <div className="flex gap-2 items-center">
              <img
                src={item.userData.image}
                alt="patient"
                className="w-8 h-8 rounded-full"
              />
              <p>{item.userData.name}</p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

            <div>{item.slotDate + " " + item.slotTime}</div>

            <p>{item.docData.fees}</p>

            {/* Pending — Accept / Reject */}
            {!item.cancelled && !item.isCompleted && !item.isAccepted && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => appointmentAccept(item._id)}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                >
                  Accept
                </button>
                <button
                  onClick={() => appointmentCancel(item._id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Accepted — Completed / Reschedule */}
            {item.isAccepted && !item.cancelled && !item.isCompleted && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => appointmentCompleted(item._id)}
                    disabled={!timePassed}
                    className={`px-3 py-1 text-xs rounded transition-all ${
                      timePassed
                        ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      !timePassed
                        ? "Can only mark completed after appointment time"
                        : ""
                    }
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => {
                      setRescheduleId(
                        rescheduleId === item._id ? null : item._id,
                      );
                      setNewDate("");
                      setNewTime("");
                      setAvailableSlots([]);
                    }}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all"
                  >
                    Reschedule
                  </button>
                </div>

                {rescheduleId === item._id && (
                  <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 border rounded-lg">
                    <p className="text-xs font-semibold text-gray-700">
                      Pick new date & time:
                    </p>

                    <input
                      type="date"
                      min={getMinDate()}
                      value={newDate}
                      onChange={handleDateChange}
                      className="border rounded px-2 py-1 text-xs"
                    />

                    {loadingSlots && (
                      <p className="text-xs text-gray-400">Loading slots...</p>
                    )}

                    {newDate &&
                      !loadingSlots &&
                      availableSlots.length === 0 && (
                        <p className="text-xs text-red-500">
                          No slots available on this date
                        </p>
                      )}

                    {newDate && !loadingSlots && availableSlots.length > 0 && (
                      <select
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="">Select time slot</option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReschedule(item._id)}
                        disabled={!newDate || !newTime}
                        className={`px-3 py-1 text-xs rounded transition-all ${
                          newDate && newTime
                            ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setRescheduleId(null);
                          setNewDate("");
                          setNewTime("");
                          setAvailableSlots([]);
                        }}
                        className="px-3 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {item.cancelled && (
              <p className="text-red-400 font-medium">Rejected</p>
            )}
            {item.isCompleted && (
              <p className="text-green-400 font-medium">Completed</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DoctorAppointments;
