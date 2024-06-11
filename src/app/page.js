"use client";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Assuming db is your Firebase Firestore instance
import EventTimePicker from "@/Components/CreateEventComponents/EventTimePicker";
import EventNamePicker from "@/Components/CreateEventComponents/EventNamePicker";
import EventDatePicker from "@/Components/CreateEventComponents/EventDatePicker";
import { logEventData } from "@/lib/feature/EventSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const eventData = useSelector((state) => state.eventdetail);
  useEffect(() => {
    if (eventData.isSuccess) {
      const currentId = eventData.id;
      router.push(`/${currentId}`);
    }
  }, [eventData]);

  return (
    <div className="">
      <div className="container  flex  flex-col lg:flex-row  gap-4 py-10">
        <div>
          <EventDatePicker />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <EventTimePicker />

          <div className="p-9  rounded-3xl  bg-blackD  flex flex-col gap-6 ">
            <EventNamePicker />

            <div className="flex flex-row justify-end items-center gap-3">
              <div className="text-white text-[12px]     ">Ready?</div>
              <button
                type="button"
                onClick={() => dispatch(logEventData())}
                className="text-blackOA bg-greenF hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
}
