import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

import { v4 as uuidv4 } from "uuid";

const initialState = {
  uid: "",
  userName: "",
  password: "",
  userAvailability: "",
  specificDays: [],
  specificDates: [],
};

const userSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateUserDetail(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

let createUser = async (userData) => {
  try {
    if (!userData.userName || !eventData.initialTime || !eventData.finishTime) {
      alert(
        "Please fill in all required fields (Event Name, Initial Time, Finish Time)."
      );
      return; // Exit function if validation fails
    }
    await setDoc(doc(db, "events", eventData.id), eventData); // Use the generated UUID as the document ID
    return true;
    //  alert("Event created successfully!");
  } catch (err) {
    console.error("Error creating event:", err);
    return;
  }
};
export const { updateUserDetail } = userSlice.actions;
export default userSlice.reducer;
