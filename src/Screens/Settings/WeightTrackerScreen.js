import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import moment from "moment/moment";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import FlagIcon from "@mui/icons-material/Flag";
import StarsIcon from "@mui/icons-material/Stars";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useQuery } from "@tanstack/react-query";
import { queryData, recieveGraphData } from "../../Services/firebase";
import MuiAlert from "@mui/material/Alert";
import GoalDialogBox from "./Components/GoalDialogBox";
import DetailsDialogBox from "./Components/DetailsDialogBox";
import { deleteGoalDoc } from "../../Services/firebase";

import EditGoalDialogBox from "./Components/EditGoalDialogBox";
import MenuComponent from "../Home/Components/MenuComponent";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import RecordEntryDialogBox from "./Components/RecordEntryDialogBox";
import {
  generateWeekArray,
  getWeeksInMonth as WeekGenerator,
} from "../../Services/timeDateutils";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function WeightTrackerScreen() {
  const navigate = useNavigate();
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const custom_user = useSelector((state) => state.user.user);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  const [openModal, setOOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenRecordModal = () => {
    setOpenRecordModal(true);
  };

  const handleCloseRecordModal = () => {
    setOpenRecordModal(false);
  };

  const handleClose = () => {
    setOpenMenu(false);
  };

  const handleOpen = () => {
    setOpenMenu(true);
  };

  const closeModal = () => {
    setOOpenModal(false);
  };

  const openGoalModal = () => {
    setOOpenModal(true);
  };

  const closeDetailsModal = () => {
    setOpenDetailsModal(false);
  };

  const openDetailsModalfunc = () => {
    setOpenDetailsModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const openEditModalFunc = () => {
    setOpenEditModal(true);
  };

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleEdit = () => {
    openEditModalFunc();
  };

  // const weightData = [
  //   {
  //     id: 1,
  //     weight: 65,
  //     ts: moment(new Date()).format("MMMM YYYY"),
  //   },
  // ];

  const findWeekInMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const totalWeekInMonth = WeekGenerator(currentYear, currentMonth);
    const weekArray = generateWeekArray(totalWeekInMonth);

    return weekArray;
  };

  // this is what will be fed to the graph
  const { status: record_status, data: record_data } = useQuery({
    queryKey: ["records"],
    queryFn: () =>
      queryData(
        custom_user.uid,
        new Date(pickedDate).getMonth(),
        new Date(pickedDate).getFullYear()
      ),
  });

  console.log("findWeeks:", findWeekInMonth());

  const [data, setData] = useState({
    // calculate by the week number, Week 1 , Week 2 etc
    labels: findWeekInMonth().map((data) => data),

    datasets: [
      {
        label:
          (record_data?.length === 0 || record_status === "loading") === true
            ? "No Records"
            : "Weight tracker",
        backgroundColor: record_data?.length === 0 && "red",
        data: record_data,
        borderColor: "black",
      },
    ],
  });

  console.log("record_data", record_data?.length === 0);

  const d = new Date();
  const formatted = moment(d).format("MMMM YYYY");

  const [pickedDate, setPickedDate] = useState(dayjs(formatted));

  const {
    status: weight_status,
    data: weight_data,
    refetch,
  } = useQuery(
    {
      queryKey: ["weights"],
      queryFn: () => recieveGraphData(custom_user.uid),
    },
    { enabled: false }
  );

  const handleDelete = async () => {
    console.log("Hello World");
    await deleteGoalDoc({ uid: custom_user.uid });
    refetch();
  };

  // delete mutation will be here

  const ts = weight_data?.lastEntryDate;
  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);

  console.log("format:", moment(date).format("LLL"));

  console.log("ts:", date);

  // const percentage = 66;
  function getWeeksInMonth(year, month) {
    const weeks = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let currentWeek = [];
    let currentDate = new Date(firstDayOfMonth);

    while (currentDate <= lastDayOfMonth) {
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);

      // Check if the current day is a Sunday (end of the week) or the last day of the month
      if (
        currentDate.getDay() === 0 ||
        currentDate.getTime() === lastDayOfMonth.getTime()
      ) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  }

  function findWeekNumberForDay(year, month, day) {
    const weeks = getWeeksInMonth(year, month);

    for (let i = 0; i < weeks.length; i++) {
      for (let j = 0; j < weeks[i].length; j++) {
        if (weeks[i][j].getDate() === day) {
          return i + 1;
        }
      }
    }

    // capping of 100
    // showing of percentage increase or decrease
    // testing

    return -1; // Day not found in any week
  }

  function getCurrentWeek(currentDate, startDate, endDate) {
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.ceil((endDate - startDate) / millisecondsPerWeek);
    const weeksElapsed = Math.ceil(
      (currentDate - startDate) / millisecondsPerWeek
    );

    return `${weeksElapsed} / ${totalWeeks}`;
  }

  // Example usage:
  const year = 2023;
  const month = 6; // 0-indexed, so 6 represents July
  const day = 23; // Day you want to find the week number for
  const weekNumber = findWeekNumberForDay(year, month, day);
  console.log(`Day ${day} is in Week ${weekNumber}`);

  if (weight_status === "loading" || record_status === "loading") {
    return <div>loading...</div>;
  }

  const checkEntryDate = () => {
    const ts = weight_data?.lastEntryDate;
    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);

    const curr_date = new Date();

    // console.log("func_date:", date);
    // console.log("month:", date.getMonth());
    // console.log("year:", date.getFullYear());
    // console.log("day:", date.getDate());

    const lastenry_weeknumber = findWeekNumberForDay(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const currentEntry_weeknumber = findWeekNumberForDay(
      curr_date.getFullYear(),
      curr_date.getMonth(),
      curr_date.getDate()
    );

    if (currentEntry_weeknumber === lastenry_weeknumber) {
      return true;
    }
    return false;
  };

  console.log("date: ", pickedDate);
  console.log("testingYear:", new Date(pickedDate).getFullYear());

  const displayPercentage = () => {
    const rounded_percent =
      Math.round((weight_data?.overallPercentage + Number.EPSILON) * 100) / 100;

    if (rounded_percent < 0) {
      return 0;
    } else if (rounded_percent > 100) {
      return 100;
    } else {
      return rounded_percent;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Snackbar
          open={open}
          autoHideDuration={10000}
          onClose={closeSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          key={vertical + horizontal}
        >
          <Alert
            onClose={closeSnackbar}
            sx={{ width: "100%" }}
            severity={severity}
          >
            {message}
          </Alert>
        </Snackbar>
        <nav className="bg-white px-4 py-4 relative w-full z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
          <div className="container flex flex-wrap  items-center">
            <div className="flex flex-wrap items-center justify-center">
              <button
                onClick={() => {
                  navigate(-1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="active:stroke-slate-200 -ml-1 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <span className="text-xl ml-4 font-semibold whitespace-nowrap">
                Weight Tracker
              </span>
            </div>
          </div>
        </nav>
        <div className="m-4">
          <DatePicker
            defaultValue={dayjs(formatted)}
            value={pickedDate}
            onChange={(item) => {
              console.log(new Date(item));
              setPickedDate(new Date(item));
            }}
            label={'"month and year"'}
            views={["month", "year"]}
          />
          <div className="flex items-center justify-center h-[70%]">
            <div className="mt-2 w-[100%] md:w-[70%]">
              <Line
                data={data}
                options={{
                  color: "red",
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => {
                // check if Goal is complete
                if (weight_data?.overallPercentage >= 100) {
                  refetch();
                  openSnackbar({
                    message: "Congratulations you have reached your goal!!!",
                  });
                  deleteGoalDoc({ uid: custom_user.uid });
                } else {
                  if (checkEntryDate()) {
                    openSnackbar({
                      message:
                        "Oops! It seems like you've already submitted your weight for this week. You can only add your weight once every week for this month. Please check back next week to update your progress",
                      severity: "error",
                    });
                  } else {
                    // enter data for goal keeping
                    console.log("Hello World");
                    handleOpenRecordModal();
                  }
                }
              }}
              className="max-w-sm md:w-auto mt-5 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            >
              Add weight entry for this week
            </button>
            <RecordEntryDialogBox
              refetch={refetch}
              Fragment={Fragment}
              handleClose={handleCloseRecordModal}
              isOpen={openRecordModal}
              data={weight_data}
            />
            <span className="text-gray-500 text-sm font-semibold">
              last entry date: {moment(date).format("LLL")}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <h1 className="font-semibold text-xl">Weight status</h1>
              {weight_data.goalStatus === "" ? (
                <>
                  <button
                    onClick={() => {
                      openGoalModal();
                    }}
                    className="max-w-sm ml-4 md:w-auto disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
                  >
                    Set goal
                  </button>
                  <GoalDialogBox
                    Fragment={Fragment}
                    isOpen={openModal}
                    handleClose={closeModal}
                    startingWeight={weight_data.startingWeight}
                    refetch={refetch}
                  />
                </>
              ) : (
                <div></div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center space-y-4 md:justify-start md:flex-row md:space-x-4 md:space-y-0  mt-2">
              <div className="w-full max-w-sm border p-4 rounded-md shadow-md">
                <div className="flex">
                  <FlagIcon />
                  <span className="ml-1">Starting weight</span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="flex items-end">
                    <h1 className="text-8xl">
                      {weight_data?.goalStatus === ""
                        ? weight_data?.currentWeight
                        : weight_data?.week1Weight}
                    </h1>
                    <h5>kg</h5>
                  </span>
                </div>
              </div>

              {weight_data.goalStatus !== "" ? (
                <>
                  <div className="w-full max-w-sm border p-4 rounded-md shadow-md">
                    <div className="flex">
                      <MonitorWeightIcon />
                      <span className="ml-1">Last inputted weight</span>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="flex items-end">
                        <h1 className="text-8xl">
                          {weight_data.currentWeight}
                        </h1>
                        <h5>kg</h5>
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-sm border p-4 rounded-md shadow-md">
                    <div className="flex">
                      <StarsIcon />
                      <h1 className="ml-1 ">Target weight</h1>
                    </div>
                    <div className="flex justify-center items-center">
                      <span className="flex items-end">
                        <h1 className="ml-2 text-8xl">
                          {weight_data.targetWeight}
                        </h1>
                        <h5>kg</h5>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div></div>
              )}
            </div>
            {weight_data.goalStatus !== "" ? (
              <div>
                <div className="mt-4 font-semibold text-xl">
                  Progress tracking
                </div>
                <div className="mt-2">
                  <div className="max-w-sm border relative p-5 rounded-md shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xl">
                        {weight_data?.goalStatus?.name === "Lossing weight"
                          ? "Weight loss"
                          : "Weight Gain"}
                      </span>
                      <Menu as="div" className="flex md:order-2">
                        <div>
                          <Menu.Button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <EllipsisVerticalIcon className="w-6 h-6" />
                          </Menu.Button>
                        </div>
                        <MenuComponent
                          Fragment={Fragment}
                          openModal={handleOpen}
                          isOpen={openMenu}
                          handleClose={handleClose}
                          message={
                            "Are you sure you want to delete this goal? All progress made would also be deleted"
                          }
                          deleteFunc={handleDelete}
                          editFunc={handleEdit}
                        />
                      </Menu>
                      <EditGoalDialogBox
                        isOpen={openEditModal}
                        Fragment={Fragment}
                        handleClose={closeEditModal}
                        startDate={weight_data.startDate}
                        deadline={weight_data.deadline}
                        goalStatus={weight_data.goalStatus}
                        currentWeight={weight_data.currentWeight}
                        targetWeight={weight_data.targetWeight}
                        startingWeight={weight_data.startingWeight}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center mt-4">
                      <div className="w-[50%]">
                        <CircularProgressbar
                          value={displayPercentage()}
                          text={`${displayPercentage()}%`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="mt-2 flex justify-center items-center">
                        {weight_data?.goalStatus?.name === "Lossing weight" ? (
                          <>
                            Weight lost this week:
                            <p className="ml-2">{weight_data?.WeightLoss}kg</p>
                          </>
                        ) : (
                          <>
                            Weight gained this week
                            <p className="ml-2">{weight_data?.WeightGain}kg</p>
                          </>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          openDetailsModalfunc();
                        }}
                        className="border p-2 px-16 rounded-md w-full hover:bg-gray-100 hover:text-blue-500"
                      >
                        Details
                      </button>
                      <DetailsDialogBox
                        isOpen={openDetailsModal}
                        Fragment={Fragment}
                        handleClose={closeDetailsModal}
                        data={weight_data}
                        lastEntryDate={moment(date).format("LLL")}
                        getCurrentWeek={getCurrentWeek}
                      />
                    </div>
                    {weight_data?.currentPercentage !== 0 ? (
                      <div
                        className={`flex items-start justify-end mt-2 text-xl font-semibold ${
                          Math.sign(weight_data?.currentPercentage) === 1
                            ? "text-green-500"
                            : "text-rose-500"
                        }`}
                      >
                        {Math.sign(weight_data?.currentPercentage) ? "+" : "-"}{" "}
                        {weight_data?.currentPercentage}%
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-10"></div>
      </div>
    </LocalizationProvider>
  );
}
