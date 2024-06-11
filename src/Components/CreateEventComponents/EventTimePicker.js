"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateEventDetail } from "@/lib/feature/EventSlice";
const { timehours } = require("../../../src/Data.json");
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import TimezoneSelect from "react-timezone-select";
import TimePicker from "react-time-picker";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
  "Europe/Berlin": "Frankfurt",
};

const EventTimePicker = () => {
  const dispatch = useDispatch();
  const [initialTime, setInitialTime] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [hours, setHours] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const handleInitialTimeChange = (event) => {
    const selectedValue = event.target.value;
    setInitialTime(selectedValue);

    dispatch(updateEventDetail({ key: "initialTime", value: selectedValue }));
  };

  const handleFinishTimeChange = (event) => {
    const selectedValue = event.target.value;
    setFinishTime(selectedValue);
    dispatch(updateEventDetail({ key: "finishTime", value: selectedValue }));
  };

  const handleTimeZoneChange = (event) => {
    const selectedValue = event.target.value;
    setTimeZone(selectedValue);
    dispatch(updateEventDetail({ key: "timeZone", value: selectedValue }));
  };

  // const handleTimeZoneChange = (selectedValue) => {
  //   setTimeZone(selectedValue);
  //   dispatch(updateEventDetail({ key: "timeZone", value: selectedValue }));
  // };

  return (
    <div className="p-9 rounded-3xl bg-blackD flex flex-col gap-6">
      <h3 className="text-2xl text-white font-bold">
        {" "}
        What <span className="text-greenF">Times</span> Might Work
      </h3>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-x-3 md:flex-row justify-between gap-4">
          <div className="flex flex-col lg:flex-row justify-between gap-y-3 lg:items-center w-full">
            <div className="text-white text-[12px] w-full lg:w-[45%]">
              No Earlier Then
            </div>
            <select
              id="initialTime"
              className="block w-full px-[24px] py-[12px] bg-gray-900 border-none rounded-[12px] focus:outline-none text-white appearance-none"
              onChange={handleInitialTimeChange}
              value={initialTime}
            >
              <option value="default">Select the Time</option>
              {timehours.map((hour, index) => (
                <option key={`init-hour-${index}`} value={hour[1]}>
                  {hour[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-y-3 justify-between lg:items-center w-full">
            <div className="text-white text-[12px] w-full lg:w-[45%]">
              No Later Then
            </div>
            <select
              id="finishTime"
              className="block w-full px-[24px] py-[12px] bg-gray-900 border-none rounded-[12px] focus:outline-none text-white appearance-none"
              onChange={handleFinishTimeChange}
              value={finishTime}
            >
              <option value="default">Select the Time</option>
              {timehours.map((hour, index) => (
                <option key={`finish-hour-${index}`} value={hour[1]}>
                  {hour[1]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-y-3 items-center">
          <div className="text-white text-[12px] w-full lg:w-[17%]">
            Time Zone
          </div>
          <select
            value={timeZone}
            onChange={handleTimeZoneChange}
            className="w-full px-[24px] py-[12px] bg-gray-900 text-white rounded-[12px] border-none appearance-none focus:outline-none"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* <TimezoneSelect
            value={timeZone}
            onChange={handleTimeZoneChange}
            displayValue="'GMT' | 'UTC'"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default EventTimePicker;
