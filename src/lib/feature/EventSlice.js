import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
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
import { db } from "@/app/firebaseConfig";

import { v4 as uuidv4 } from "uuid"; // Import the v4 function from the uuid library
import { useDispatch } from "react-redux";

const initialState = {
  id: "",
  eventName: "",
  timeZone: "",
  surveyType: "",
  specificDays: [],
  specificDates: [],
  initialTime: "",
  finishTime: "",
  hours: [],
  participants: {},
  isSuccess: false,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateEventDetail(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    logEventData(state) {
      const initialTime = state.initialTime;
      const finishTime = state.finishTime;
      const timeZone = state.timeZone;
      const specificDates = state.specificDates;

      console.log(specificDates);

      state.specificDates = convertToUTC(specificDates);

      // console.log(state.specificDates, "Dates After Conversion");
      const hoursDifference = calculateTimeSlots(initialTime, finishTime);
      state.hours = hoursDifference;

      const eventId = uuidv4();
      state.id = eventId;

      if (createEvent(state)) {
        state.isSuccess = true;
      }
    },

    setEventData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateParticipants(state, action) {
      state.participants.push(action.payload);
    },
  },
});

// function calculateHoursArrayWithAMPM(initialTime, finishTime) {
//   const initialHour = parseInt(initialTime.split(":")[0], 10);
//   const initialMinute = parseInt(initialTime.split(":")[1], 10);
//   const finishHour = parseInt(finishTime.split(":")[0], 10);
//   const finishMinute = parseInt(finishTime.split(":")[1], 10);

//   const adjustedFinishHour =
//     finishHour < initialHour ? finishHour + 12 : finishHour;

//   let differenceInHours = adjustedFinishHour - initialHour;

//   if (differenceInHours < 0) {
//     differenceInHours += 24;
//   }

//   const hoursArray = [];
//   for (let i = initialHour; i <= adjustedFinishHour; i++) {
//     const hour = i % 12 === 0 ? 12 : i % 12;
//     const ampm = i < 12 || i === 24 ? "AM" : "PM";
//     hoursArray.push(
//       `${hour.toString().padStart(2, "0")}:${initialMinute
//         .toString()
//         .padStart(2, "0")} ${ampm}`
//     );
//   }

//   return hoursArray;
// }

// function calculateHoursArrayWithAMPM(initialTime, finishTime) {
//   const initialHour = parseInt(initialTime.split(":")[0], 10);

//   console.log(initialHour, "Event Initial Hour");
//   const initialMinute = parseInt(initialTime.split(":")[1], 10);
//   const initialAMPM = initialTime.split(" ")[1];
//   const finishHour = parseInt(finishTime.split(":")[0], 10);
//   console.log(finishHour, "Event Finish Hour");
//   const finishMinute = parseInt(finishTime.split(":")[1], 10);
//   const finishAMPM = finishTime.split(" ")[1];

//   let adjustedFinishHour = finishHour;
//   if (finishAMPM === "AM" && initialAMPM === "PM") {
//     adjustedFinishHour += 12;
//   } else if (
//     finishAMPM === "PM" &&
//     initialAMPM === "AM" &&
//     finishHour < initialHour
//   ) {
//     adjustedFinishHour += 24;
//   }

//   let differenceInHours = adjustedFinishHour - initialHour;

//   if (differenceInHours < 0) {
//     differenceInHours += 24;
//   }

//   const hoursArray = [];
//   for (let i = initialHour; i <= adjustedFinishHour; i++) {
//     const hour = i % 12 === 0 ? 12 : i % 12;
//     const ampm = i < 12 || i === 24 ? "AM" : "PM";
//     hoursArray.push(
//       `${hour.toString().padStart(2, "0")}:${initialMinute
//         .toString()
//         .padStart(2, "0")} ${ampm}`
//     );
//   }

//   return hoursArray;
// }

function calculateTimeSlots(initialTime, finishTime) {
  const initialHour = parseInt(initialTime.split(":")[0], 10);
  const initialMinute = parseInt(initialTime.split(":")[1], 10);
  const initialPeriod = initialTime.split(" ")[1];

  const finishHour = parseInt(finishTime.split(":")[0], 10);
  const finishMinute = parseInt(finishTime.split(":")[1], 10);
  const finishPeriod = finishTime.split(" ")[1];

  let initialHour24 = initialHour;
  if (initialPeriod === "PM" && initialHour !== 12) {
    initialHour24 += 12;
  }

  let finishHour24 = finishHour;
  if (finishPeriod === "PM" && finishHour !== 12) {
    finishHour24 += 12;
  }

  if (
    finishHour24 < initialHour24 ||
    (finishHour24 === initialHour24 && finishMinute < initialMinute)
  ) {
    finishHour24 += 24;
  }

  const timeSlots = [];

  let currentHour = initialHour;
  let currentPeriod = initialPeriod;

  while (currentHour !== finishHour || currentPeriod !== finishPeriod) {
    const formattedHour =
      currentHour === 0
        ? 12
        : currentHour > 12
        ? currentHour - 12
        : currentHour;

    // Push formatted time to time slots array
    timeSlots.push(
      `${formattedHour.toString().padStart(2, "0")}:${initialMinute
        .toString()
        .padStart(2, "0")} ${currentPeriod}`
    );

    // Increment time
    currentHour++;
    if (currentHour === 12 && initialMinute === 0) {
      currentPeriod = currentPeriod === "AM" ? "PM" : "AM";
    }
    if (currentHour === 13) {
      currentHour = 1;
    }
  }

  // Push the finish time to time slots array
  timeSlots.push(
    `${finishHour}:${finishMinute.toString().padStart(2, "0")} ${finishPeriod}`
  );

  return timeSlots;
}

function convertDatesToUTCWithTimeZoneAndDay(dates, timeZone) {
  console.log(
    dates,
    timeZone,
    "Dates And Time Zone ibd betefhdjfdhfdgfdhfvfgggdghv"
  );
  const outputFormat = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    weekday: "long",
  };
  const options = { timeZone: timeZone, ...outputFormat };

  const convertedDates = dates.map((dateString) => {
    const [month, day, year] = dateString.split("/");
    const date = new Date(`${month}/${day}/${year}`);
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  });

  return convertedDates;
}

function convertToUTC(dateArray) {
  // Iterate through the array
  return dateArray.map(function (dateString) {
    // Split the date string by '/'
    var parts = dateString.split("/");
    // Create a new Date object using the parts
    var date = new Date(parts[2], parts[1] - 1, parts[0]);
    // Get the UTC string representation of the date
    var utcString = date.toUTCString();
    return utcString;
  });
}

let createEvent = async (eventData) => {
  try {
    if (
      !eventData.eventName ||
      !eventData.initialTime ||
      !eventData.finishTime
    ) {
      alert(
        "Please fill in all required fields (Event Name, Initial Time, Finish Time)."
      );
      return false; // Exit function if validation fails
    }
    await setDoc(doc(db, "events", eventData.id), eventData); // Use the generated UUID as the document ID
    return true;
    //  alert("Event created successfully!");
  } catch (err) {
    console.error("Error creating event:", err);
    return false;
  }
};

export const getDocsbyID = async (eventID) => {
  try {
    console.log(eventID, "Mather in Docs");
    const q = query(collection(db, "events"), where("id", "==", eventID));
    const querySnapshot = await getDocs(q);
    let documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const eventData = documents[0].data;

    return eventData;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
};

export const handlememberUpdate = async (eventId, participant) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      alert("Event not found", "error");

      return;
    }

    const member = eventSnap.data();

    if (member.participants) {
      if (member.participants[participant.userName]) {
        alert("Participant already exists ", "warning");
        return participant;
      }
    }
    member.participants = member.participants || {};
    member.participants[participant.userName] = participant;

    await setDoc(eventRef, member, { merge: true });
    alert("Event is Updated Successfully", "success");
    return participant;
  } catch (err) {
    console.error(err);
    alert("Something went wrong", "error");
  }
};

export const handleAvailabilityUpdate = async (eventId, participant) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      alert("Event not found", "error");
      return;
    }

    const member = eventSnap.data();
    if (member.participants) {
      for (let i = 0; i < member.participants.length; i++) {
        const participantObject = member.participants[i];
        if (participantObject.userName === participant.userName) {
          if (!participantObject.availability) {
            participantObject.availability = []; // Ensure availability array is initialized
          }

          participantObject.availability.push(participant.availability);

          await setDoc(eventRef, member); // Save the updated member object
          return participant;
        }
      }
    }

    member.participants = member.participants || {};
    member.participants[participant.userName] = participant;
    await setDoc(eventRef, member, { merge: true });
    return participant;
  } catch (err) {
    console.error(err);
  }
};

export const getParticipantByUsername = async (
  eventId,
  userName,
  setFilteredParticipant
) => {
  try {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const eventData = docSnap.data();

      if (eventData.participants) {
        const participants = eventData.participants;
        for (const participantKey in participants) {
          if (participants.hasOwnProperty(participantKey)) {
            const participant = participants[participantKey];
            if (participant.userName === userName) {
              setFilteredParticipant({ eventId: docSnap.id, participant });
              return; // Exit the loop once participant is found
            }
          }
        }
      }

      console.log("No participant found with username:", userName);
      setParticipant(null);
    } else {
      console.log("No event found for the specified ID:", eventId);
      setParticipant(null);
    }
  } catch (error) {
    console.error("Error getting participant by username:", error);
    setParticipant(null);
  }
};

export const {
  updateEventDetail,
  logEventData,
  getEventData,
  setEventData,
  updateParticipants,
} = eventSlice.actions;

export default eventSlice.reducer;
