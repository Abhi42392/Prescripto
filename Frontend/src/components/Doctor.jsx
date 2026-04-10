import React from "react";
import { useNavigate } from "react-router-dom";

const Doctor = (props) => {
  const navigate = useNavigate();
  console.log(props);
  return (
    <div
      onClick={() => navigate(`/appointments/${props.id}`)}
      className="flex flex-col outline outline-gray-600 rounded-lg cursor-pointer hover:scale-105 transition ease-in-out duration-200"
    >
      <div className="bg-blue-100 rounded-t-lg">
        <img src={props.image} alt="doctor image" />
      </div>
      <div className="p-3">
        <li className="flex space-x-2 items-center">
          <div
            className={`w-2 h-2 rounded-full ${props.available ? "bg-green-500" : "bg-gray-500"}`}
          ></div>
          <p
            className={`${props.available ? "text-green-500" : "text-gray-500"} text-xs sm:text-sm`}
          >
            {props.available ? "Available" : "Not Available"}
          </p>
        </li>
        <h2 className="text-sm md:text-base lg:text-xl font-semibold">
          {props.name}
        </h2>
        <p className="text-xs">{props.speciality}</p>
        {props.totalReviews > 0 && (
          <p className="text-xs text-yellow-600 mt-1">
            ★ {props.averageRating}{" "}
            <span className="text-gray-500">({props.totalReviews})</span>
          </p>
        )}
        {props.address && (
          <p className="text-xs text-gray-600 mt-1">
            {props.address.line1}
            {props.address.line2 ? `, ${props.address.line2}` : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default Doctor;
