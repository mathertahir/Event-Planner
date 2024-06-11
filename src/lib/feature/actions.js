import {
  setDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  arrayUnion,
  documents,
  push,
} from "firebase/firestore";

import { DateTime } from "luxon";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/app/firebaseConfig";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid library

export const createEvent = async (eventData) => {
  try {
    if (
      !eventData.eventName ||
      !eventData.initialTime ||
      !eventData.finishTime
    ) {
      alert(
        "Please fill in all required fields (Event Name, Initial Time, Finish Time)."
      );
      return; // Exit function if validation fails
    }
    await setDoc(doc(db, "events", eventData.id), eventData); // Use the generated UUID as the document ID
    alert("Event created successfully!");
    return eventData.id;
  } catch (err) {
    console.error("Error creating event:", err);
  }
};

export const toggleAvailability = async (
  timeslot,
  weekday,
  userData,
  setUserData
) => {
  await setUserData((prevUserData) => {
    const currentSlots = prevUserData?.availability?.[weekday] || [];
    const isPresent = currentSlots.includes(timeslot);

    const newSlots = isPresent
      ? currentSlots.filter((slot) => slot !== timeslot) // Remove the timeslot if present
      : [...currentSlots, timeslot]; // Add the timeslot if not present

    const newAvailability = {
      ...prevUserData?.availability,
      [weekday]: newSlots,
    };

    return {
      ...prevUserData,
      availability: newAvailability,
    };
  });
};

export const logEventData = createAsyncThunk(
  "event/logEventData",
  async (state) => {
    try {
      const router = useRouter();
      const initialTime = state.initialTime;
      const finishTime = state.finishTime;
      const hoursDifference = calculateHoursArrayWithAMPM(
        initialTime,
        finishTime
      );
      state.hours = hoursDifference;

      const eventId = uuidv4();
      state.id = eventId;

      await createEvent(state);

      // Navigate to the new route with the eventId in the URL
      router.push(`/${eventId}`);
    } catch (err) {
      console.error("Error logging event data:", err);
      throw err; // Propagate error
    }
  }
);

export const getDayOfWeek = (specificDates) => {
  console.log(specificDates, "Dates are");
  return specificDates?.map((dateString) => {
    const [day, month, year] = dateString.split("/");
    const formattedDate = `20${year}-${month}-${day}`;
    console.log("Formatted Date:", formattedDate);

    const date = new Date(formattedDate);

    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()} ${days[date.getDay()]}

    ${date.getFullYear()}
    `;
  });
};

function calculateHoursArrayWithAMPM(initialTime, finishTime) {
  const initialHour = parseInt(initialTime.split(":")[0], 10);
  const initialMinute = parseInt(initialTime.split(":")[1], 10);
  const finishHour = parseInt(finishTime.split(":")[0], 10);
  const finishMinute = parseInt(finishTime.split(":")[1], 10);

  const adjustedFinishHour =
    finishHour < initialHour ? finishHour + 12 : finishHour;

  let differenceInHours = adjustedFinishHour - initialHour;

  if (differenceInHours < 0) {
    differenceInHours += 24;
  }

  const hoursArray = [];
  for (let i = initialHour; i <= adjustedFinishHour; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 || i === 24 ? "AM" : "PM";
    hoursArray.push(
      `${hour.toString().padStart(2, "0")}:${initialMinute
        .toString()
        .padStart(2, "0")} ${ampm}`
    );
  }

  return hoursArray;
}

export function convertDateFormat(dateString) {
  // Remove leading/trailing whitespaces and split the date string by newline and spaces
  const parts = dateString.trim().split(/[\n\s]+/);

  // Check if the parts array has the expected length
  if (parts.length !== 4) {
    console.error("Invalid date string format");
    return null; // Return null if the format is invalid
  }

  // Extract month, day, year from the split parts
  const month = parts[0];
  const day = parseInt(parts[1]);
  const year = parseInt(parts[3]); // Parsing the full year

  // Create a mapping for month names to their corresponding numeric values
  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  // Convert month name to its numeric value
  const numericMonth = monthMap[month];

  // Check if month abbreviation is valid
  if (!numericMonth) {
    console.error("Invalid month abbreviation:", month);
    return null; // Return null if the month abbreviation is invalid
  }

  // Return the formatted date string
  return `${day}/${numericMonth}/${year}`;
}

// Example usage:
const originalDate = "May 14 Tue 2024";
const convertedDate = convertDateFormat(originalDate);

export const getAllEvents = async (setAllEvent) => {
  try {
    const array = [];
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      array.push({ id: doc.id, ...data }); // Include the document ID in the data object
    });
    setAllEvent(array);
  } catch (error) {
    console.error("Error getting all events: ", error);
  }
};

export const getCurrentEventData = async (eventids) => {
  console.log(eventids, userName, "ffffff");
  const d = await getDoc(doc(db, "events", eventids));

  console.log(d.data());
};

export const getParticularEventdata = async (eventId) => {
  try {
    const particularEventRef = doc(db, "events", eventId);
    const particulareventData = await getDoc(particularEventRef);

    if (!particulareventData.exists()) {
      console.error("Event not found!");
      return;
    }

    const particularData = particulareventData.data();

    console.log(particularData, "Particular EventData");

    return particularData;
  } catch (error) {
    console.error("Error fetching event or participant data:", error);
    throw error;
  }
};

export const getParticipantEventData = async (eventId, userName) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      console.error("Event not found!");
      return null; // Explicitly return null to indicate the event was not found.
    }

    const eventData = eventSnapshot.data();

    if (
      eventData.participants &&
      eventData.participants.hasOwnProperty(userName)
    ) {
      const userData = eventData.participants[userName];
      console.log(userData, `Data for ${userName}`);
      return userData; // Return the found user data.
    } else {
      console.log(
        `No data found for user: ${userName} or no participants in this event`
      );
      return null; // Explicitly return null to indicate user was not found.
    }
  } catch (error) {
    console.error("Error fetching event or participant data:", error);
    throw error; // Rethrow to allow further error handling.
  }
};

// useEffect(() => {
//   const fetchData = async () => {
//     setIsLoading(true);
//     const eventData = await getDocsbyID(params.eventId);
//     dispatch(setEventData(eventData));
//     setIsLoading(false);
//   };

//   fetchData();
// }, [dispatch]);

export function sortHoursByTimezone(hours, timeZone) {
  const currentTime = DateTime.local().setZone(timeZone);

  const systemTimeZoneOffset = currentTime.offset;

  const utcHours = hours.map((hour) => {
    const [hourStr, period] = hour.split(" ");
    let [hourNum, minute] = hourStr.split(":");
    hourNum = parseInt(hourNum);
    if (period === "pm" && hourNum !== 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }
    return hourNum * 60 + parseInt(minute);
  });
  const adjustedHours = utcHours.map((hour) => {
    let adjustedHour = hour - systemTimeZoneOffset;
    if (adjustedHour < 0) {
      adjustedHour += 24 * 60;
    } else if (adjustedHour >= 24 * 60) {
      adjustedHour -= 24 * 60;
    }
    return adjustedHour;
  });

  adjustedHours.sort((a, b) => a - b);
  const sortedHours = adjustedHours.map((adjustedHour) => {
    const hour = Math.floor(adjustedHour / 60);
    const minute = adjustedHour % 60;
    const period = hour < 12 ? "am" : "pm";
    const formattedHour =
      (hour % 12 || 12) +
      ":" +
      (minute < 10 ? "0" : "") +
      minute +
      " " +
      period;
    return formattedHour;
  });

  return sortedHours;
}

// export function arrangeHoursByTimeZone(timeZone, hours) {
//   const formatter = new Intl.DateTimeFormat("en-US", {
//     hour: "numeric",
//     hour12: true,
//     timeZone: timeZone,
//   });

//   const arrangedHours = hours.map((hour) => {
//     // Split hour string to extract hour and AM/PM
//     const [time, period] = hour.split(" ");
//     // Get the hour from the time string
//     const [hourStr, minuteStr] = time.split(":");
//     const hourNumber = parseInt(hourStr);
//     // Adjust hour based on AM/PM
//     const adjustedHour = period === "AM" ? hourNumber : hourNumber + 12;
//     // Create a new date object and set the hour
//     const hourDate = new Date();
//     hourDate.setHours(adjustedHour);
//     hourDate.setMinutes(parseInt(minuteStr));
//     // Format the hour using the provided time zone
//     return formatter.format(hourDate);
//   });

//   return arrangedHours;
// }

export function arrangeHoursByTimeZone(timeZone, hours) {
  const arrangedHours = hours.map((hour) => {
    // Split hour string to extract hour and AM/PM
    const [time, period] = hour.split(" ");
    // Get the hour from the time string
    const [hourStr, minuteStr] = time.split(":");
    let hourNumber = parseInt(hourStr);
    // Adjust hour based on AM/PM
    if (period === "PM" && hourNumber !== 12) {
      hourNumber += 12;
    } else if (period === "AM" && hourNumber === 12) {
      hourNumber = 0;
    }
    // Create a new date object and set the hour
    const hourDate = new Date();
    hourDate.setUTCHours(hourNumber);
    hourDate.setUTCMinutes(parseInt(minuteStr));
    // Check if time zone is other than Asia/Karachi
    if (timeZone !== "Asia/Karachi") {
      // Format the hour using the provided time zone
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: timeZone,
      });
      return formatter.format(hourDate);
    } else {
      // Return the original hour string if time zone is Asia/Karachi
      return hour;
    }
  });

  return arrangedHours;
}
export function formatDateArray(dateArray, timeZone) {
  // Define an array of month abbreviations
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Define an array of day abbreviations
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create a new Intl.DateTimeFormat object with the specified time zone
  var formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  // Iterate through the array
  return dateArray.map(function (utcString) {
    // Create a new Date object from the UTC string
    var date = new Date(utcString);
    // Format the date according to the specified time zone
    var formattedDate = formatter.format(date);
    return formattedDate;
  });
}
