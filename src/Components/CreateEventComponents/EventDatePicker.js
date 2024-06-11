"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEventDetail } from "@/lib/feature/EventSlice";
import { Calendar } from "react-multi-date-picker";

const EventDatePicker = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("specific Dates");
  const [surveyType, setSurveyType] = useState("specific Dates");
  const [selectedDates, setSelectedDates] = useState([]);
  let [value, setValue] = useState([]);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === "specific Dates") {
      setSelectedDaysOfWeek([]);
    } else {
      setSelectedDates([]);
    }
  };

  const handleDatesChange = (newDates) => {
    const formattedDates = newDates.map((date) => {
      const isoDate = new Date(date);
      const formattedDate = `${isoDate.getDate()}/${
        isoDate.getMonth() + 1
      }/${String(isoDate.getFullYear()).slice(-2)}`;
      return formattedDate;
    });

    setSelectedDates(formattedDates);

    console.log(formattedDates);
    dispatch(
      updateEventDetail({ key: "specificDates", value: formattedDates })
    );

    setSelectedDates();
  };

  const handlesurveyChange = (event) => {
    const selectedValue = event.target.value;
    setSurveyType(selectedValue);

    dispatch(updateEventDetail({ key: "surveyType", value: selectedValue }));
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSelectDayOfWeek = (day) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
      } else {
        return [...prevSelectedDays, day];
      }
    });

    dispatch(updateEventDetail({ key: "specificDays", value: selectedDays })); // Assuming you have an action creator named updateSelectedDays
  };

  useEffect(() => {
    handlesurveyChange({ target: { value: surveyType } }); // Simulate an event object
  }, []);

  console.log(selectedDays, "Selected days of week ");

  let eventData = useSelector((state) => state.eventdetail);

  console.log(eventData.timeZone, "Time Zone In Global Event State?");

  return (
    <div className="flex flex-col gap-10">
      <div className="p-9 rounded-3xl bg-blackD flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-white font-bold">
            {" "}
            What <span className="text-greenF">Dates</span> Might work?
          </h3>
          <p className="text-white text-[16px]">
            Click and drag dates to choose possibilities. Click and drag labels
            to shift the calendar.
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center gap-y-3">
            <div className="text-white text-[12px] w-full lg:w-[17%]">
              Survey Using
            </div>
            <select
              value={surveyType}
              onChange={handlesurveyChange}
              className="w-full px-[24px] py-[12px] bg-gray-900 text-white rounded-[12px] border-none appearance-none focus:outline-none"
            >
              <option value={"specific Dates"}>Specific Dates</option>
              <option value={"Week Days"}>Week Days</option>
            </select>
          </div>

          {surveyType === "specific Dates" ? (
            <div>
              <Calendar
                multiple
                onlyShowInRangeDates
                value={value}
                onChange={handleDatesChange} // Pass handleDatesChange as onChange handler
                format="DD/MM/YY"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {weekdays.map((day, index) => (
                <div
                  key={index}
                  className={`h-[40px] flex items-center justify-center rounded-lg border ${
                    selectedDays.includes(day)
                      ? "bg-greenF text-blackOA"
                      : "bg-gray-300"
                  }`}
                  onClick={() => handleSelectDayOfWeek(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDatePicker;
