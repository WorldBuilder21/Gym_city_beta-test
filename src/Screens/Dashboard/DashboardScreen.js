import React, { useEffect, useState, Fragment } from "react";
import MembershipSubscriptionCard from "./components/MembershipSubscriptionCard";
import NoticeDialog from "./components/NoticeDialog";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment/moment";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import CircularProgress from "@mui/material/CircularProgress";
import {
  generateWeekArray,
  getWeeksInMonth as WeekGenerator,
  findWeekNumberForDay,
} from "../../Services/timeDateutils";
import { useNavigate } from "react-router";
import { recentActivities } from "../../Services/firebase";
import ActivityCard from "./ActivityScreen/components/ActivityCard";


export default function DashboardScreen() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const d = new Date();
  const formatted = moment(d).format("MMMM YYYY");

  const [pickedDate, setPickedDate] = useState(formatted);

  // things that count as activities
  
  // members joining
  // members leaving
  // instructor leaving
  // instructors joining
  // instructors creating posts and routines
  // Instructors being added to the gym
  // Instructors being blocked
  // Instructors being unblocked

  // Clients making bookings

  // Record model: only for members
  // {
  //    ts: serverTimestamp()
  //    type: 'left' || 'joined'
  //    uid: custom_user.uid
  //    month: date.getMonth()
  //    year: date.getFullyear()
  //    week: findWeekNumberForDay()
  //  }
  // to prevent spam: you want to make it individual users

  const [data, setData] = useState({ datasets: [{ data: [] }] });

  const findWeekInMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const totalWeekInMonth = WeekGenerator(currentYear, currentMonth);
    const weekArray = generateWeekArray(totalWeekInMonth);

    return weekArray;
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  useEffect(() => {}, []);

  return (
    <>
      <NoticeDialog
        isOpen={openModal}
        Fragment={Fragment}
        handleClose={handleClose}
      />
      <div className="m-4">
        <div className="flex flex-col">
          {/* 
              for now it would be done checking if the members have joined or left the gym. In the next update it will be recorded by the number of people who have suscribe to the memberships.
          */}
          <div className="flex flex-col">
            <div className="font-semibold text-red-500 mb-2">
              Developer notice:
            </div>
            <div className="rounded-md flex flex-row border px-4 justify-center text-red-500 py-1.5 font-semibold border-red-500 text-sm">
              In the next update there will be a graph to show the amount of
              users who have suscribed to a membership plan to enable gyms to
              track their membership intakes. It was not included in this
              version because the feature to create membership plans has not
              been created yet.
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <div className="font-semibold text-2xl">Recent activities</div>
            <button
              onClick={() => navigate("/dashboard/viewActivity")}
              className="w-full p-3 border text-center rounded-md"
            >
              View all activities
            </button>
          </div>
          <button
            className="max-w-sm md:w-auto mt-5 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            onClick={() => {
              handleOpen();
            }}
          >
            Create a membership plan
          </button>
          <div>
            <MembershipSubscriptionCard />
          </div>
        </div>
      </div>
    </>
  );
}
