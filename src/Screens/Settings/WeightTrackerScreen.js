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
  const [openMenu, setOpenMenu] = useState(false);

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

  const handleDelete = () => {
    console.log("Hello World");
  };

  const handleEdit = () => {
    openEditModalFunc();
  };

  const calculatePercentageValue = () => {
    const value = (weight_data.previousWeight / weight_data.targetWeight) * 100;
    const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100;
    return roundedValue;
  };

  const weightData = [
    {
      id: 1,
      weight: 65,
      ts: moment(new Date()).format("MMMM YYYY"),
    },
  ];

  const [data, setData] = useState({
    // calculate by the week number, Week 1 , Week 2 etc
    labels: weightData.map((data) => data.ts),

    datasets: [
      {
        label: "No Records",
        backgroundColor: "red",
        data: [],
      },
    ],
  });

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

  // delete mutation will be here

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

    return -1; // Day not found in any week
  }

  // Example usage:
  const year = 2023;
  const month = 6; // 0-indexed, so 6 represents July
  const day = 23; // Day you want to find the week number for
  const weekNumber = findWeekNumberForDay(year, month, day);
  console.log(`Day ${day} is in Week ${weekNumber}`);

  if (weight_status === "loading") {
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
                  animation: false,
                  color: "red",
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => {
                if (checkEntryDate()) {
                  openSnackbar({
                    message:
                      "Oops! It seems like you've already submitted your weight for this week. You can only add your weight once every week for this month. Please check back next week to update your progress",
                    severity: "error",
                  });
                } else {
                  console.log("Hello World");
                }
              }}
              className="max-w-sm md:w-auto mt-5 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            >
              Add weight entry for this week
            </button>
            <span className="text-gray-500 text-sm font-semibold">
              last entry date: {d.toDateString()} , {d.toLocaleTimeString()}
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
                    <h1 className="text-8xl">{weight_data.startingWeight}</h1>
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
                      <span className="font-semibold text-xl">Weight loss</span>
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
                        startingWeight={weightData.startingWeight}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center mt-4">
                      <div className="w-[50%]">
                        <CircularProgressbar
                          value={calculatePercentageValue()}
                          text={`${calculatePercentageValue()}%`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="max-w-sm border p-5 rounded-md shadow-md">
                    <span className="font-semibold text-xl">Weight loss</span>
                    <div className="flex flex-col justify-center items-center mt-4">
                      <div className="w-[50%]">
                        <CircularProgressbar value={66} text={"66%"} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="mt-2 flex justify-center items-center">
                        Weight lost this week: <p className="ml-2">2kg</p>
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
                      />
                    </div>
                    <div className="flex items-start justify-end mt-2 text-xl text-green-500 font-semibold">
                      + 2%
                    </div>
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
