import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Doctor from "../components/Doctor";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";
const Appointment = () => {
  const navigate = useNavigate();
  const { allDoctors, backendUrl, utoken, fetchDoctorsData } =
    useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const { docId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/doctor-feedback/${docId}`,
        );
        if (data.success) setReviews(data.feedback);
      } catch (err) {
        console.log(err);
      }
    };
    if (docId) fetchReviews();
  }, [docId]);

  const createDoctor = (props) => {
    return (
      <Doctor
        key={props._id}
        id={props._id}
        name={props.name}
        image={props.image}
        speciality={props.speciality}
        available={props.available}
        address={props.address}
        averageRating={props.averageRating}
        totalReviews={props.totalReviews}
      />
    );
  };

  const fetchDocInfo = async () => {
    const doc = allDoctors.find((item) => item._id === docId);
    setDocInfo(doc);
  };

  const getAvailableSlots = async () => {
    const today = new Date();
    let slots = [];

    for (let i = 0; i < 7; i++) {
      const year = today.getFullYear();
      const month = today.getMonth();
      const date = today.getDate() + i;

      const endTime = new Date(year, month, date, 21, 0, 0, 0);
      let currentDate;

      if (i === 0) {
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
          slots.push([]);
          continue;
        }

        currentDate = new Date(year, month, date, nextHour, nextMinutes, 0, 0);
      } else {
        currentDate = new Date(year, month, date, 10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate.getTime() < endTime.getTime()) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const slotDate =
          currentDate.getDate() +
          "-" +
          (currentDate.getMonth() + 1) +
          "-" +
          currentDate.getFullYear();

        const isSlotBooked =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime);

        if (!isSlotBooked) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
    console.log(slots);
  };

  const bookAppointment = async () => {
    if (!utoken) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].dateTime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = day + "-" + month + "-" + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { utoken } },
      );
      if (data.success) {
        toast.success(data.message);
        fetchDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [allDoctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col lg:flex-row gap-6 items-center sm:items-start ">
          <div className="bg-[#5f6FFF] rounded-lg w-[max(15vw,200px)] flex-shrink-0 h-full">
            <img
              src={docInfo.image}
              alt="Doctor image"
              className="w-full h-full"
            />
          </div>
          <div className="list-none rounded-lg outline outline-gray-600 p-8 max-h-full">
            <div className="space-y-2">
              <li className="flex space-x-1 sm:space-x-3">
                <h1 className="text-2xl font-semibold">{docInfo.name}</h1>
                <img src={assets.verified_icon} />
              </li>
              <li className="flex flex-col sm:flex-row gap-2 ">
                <p>{`${docInfo.degree} - ${docInfo.speciality}`}</p>
                <p className="rounded-lg outline outline-gray-600 p-1 w-fit ">
                  {docInfo.experience}
                </p>
                {docInfo.totalReviews > 0 && (
                  <li className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-lg">
                      ★ {docInfo.averageRating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({docInfo.totalReviews} reviews)
                    </span>
                  </li>
                )}
              </li>
            </div>
            <div className="w-full lg:w-[70%] my-5">
              <li className="font-semibold text-xl flex space-x-3">
                <p>About</p>
                <img src={assets.info_icon} alt="info icon" />
              </li>
              <p>{docInfo.about}</p>
            </div>
            <li className="text-xl space-x-1 flex">
              <p>Appointment fee:</p>
              <p className="font-medium">${docInfo.fees}</p>
            </li>
          </div>
        </div>
        <div className="lg:ml-[max(15vw,200px)] lg:pl-6 my-5">
          <p className="text-2xl">Booking slots</p>
          <div className="flex  space-x-4 overflow-x-scroll w-full p-2 my-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  className="py-3 px-2 sm:py-6 sm:px-4 w-10 text-sm sm:w-16 outline outline-gray-600  rounded-full flex flex-col space-y-2 items-center "
                  style={
                    slotIndex === index
                      ? {
                          backgroundColor: "#5f6FFF",
                          outline: "none",
                          color: "white",
                        }
                      : {}
                  }
                  onClick={() => {
                    setSlotIndex(index);
                  }}
                >
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex flex-wrap p-2 gap-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <div
                  key={index}
                  className="py-1 px-3 sm:py-2 sm:px-6  text-xs sm:text-sm whitespace-nowrap outline outline-gray-600  rounded-full"
                  style={
                    slotTime === item.time
                      ? {
                          backgroundColor: "#5f6FFF",
                          outline: "none",
                          color: "white",
                        }
                      : {}
                  }
                  onClick={() => {
                    setSlotTime(item.time);
                  }}
                >
                  <p>{item.time.toLowerCase()}</p>
                </div>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-[#5f6FFF] rounded-full px-6 py-2 sm:px-10 sm:py-3 text-white my-3 text-sm sm:text-base cursor-pointer"
          >
            Book an appointment
          </button>
        </div>
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-center text-3xl font-medium">Related Doctors</h1>
          <p className="text-center font-light">
            Simply browse through our extensive list of trusted doctors
          </p>
          <div className="pt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5 ">
            {allDoctors
              .filter(
                (doc) =>
                  doc._id != docInfo._id &&
                  doc.speciality === docInfo.speciality,
              )
              .map(createDoctor)}
          </div>
        </div>
        <div className="lg:ml-[max(15vw,200px)] lg:pl-6 my-8">
          <h2 className="text-2xl mb-4">Patient Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {r.userData.image && (
                        <img
                          src={r.userData.image}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{r.userData.name}</p>
                        <p className="text-yellow-500 text-sm">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Appointment;
