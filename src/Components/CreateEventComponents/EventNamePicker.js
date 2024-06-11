"use client";
import React, { useState, useEffect } from "react";

import { logEventData } from "@/lib/feature/EventSlice";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { updateEventDetail } from "@/lib/feature/EventSlice";

export const navigateToEvent = (eventId) => {
  router.push(`/events/${eventId}`);
};

const EventNamePicker = () => {
  const dispatch = useDispatch();
  const [eventName, setEventName] = useState();
  const [paramid, setParamId] = useState();

  const handleEventName = () => {
    dispatch(updateEventDetail({ key: "eventName", value: eventName }));
  };

  useEffect(() => {
    handleEventName();
  }, [eventName]);

  const handleInputChange = (event) => {
    setEventName(event.target.value);
  };

  return (
    <div>
      <div className="flex  flex-col gap-5">
        <h3 className="text-2xl text-white font-bold">
          {" "}
          Create a <span className="text-greenF">New Event</span>
        </h3>

        <div className=" flex flex-col lg:flex-row  lg:items-center  gap-y-3  ">
          <div className="text-white text-[12px]  w-full lg:w-[17%]  ">
            Event Name
          </div>

          <input
            className="w-full px-[24px] py-[12px]  bg-gray-900  text-white  rounded-[12px] border-none appearance-none focus:outline-none "
            placeholder="Enter Event Name"
            value={eventName}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default EventNamePicker;
