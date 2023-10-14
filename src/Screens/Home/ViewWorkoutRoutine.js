import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ImageIcon from "@mui/icons-material/Image";
import { Avatar, Chip } from "@mui/material";
import routineColorCode from "../../Services/routineColorCode";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import WorkoutCard from "./Components/WorkoutCard";
import BedIcon from "@mui/icons-material/Bed";
import { useState } from "react";
import {
  addActivity,
  declineRequest,
  getUserDataUid,
} from "../../Services/firebase";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const dayOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ViewWorkoutRoutine() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.userId.userId);
  const routineData = useSelector((state) => state.routine.routine);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });

  const query = useQueryClient();

  const { status, data: userdata } = useQuery(
    {
      queryKey: ["user_routine_data"],
      queryFn: () => getUserDataUid(userId),
    }
    // { enabled: userId === routineData.createId }
  );

  const { vertical, horizontal, open, message, severity } = state;

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  console.log(routineData.difficulty.name);

  console.log("RoutineData: ", routineData);

  const handleAccept = async () => {
    const docId = routineData?.docId;
    const gymId = routineData?.gymId;
    const creatorId = routineData?.senderId;

    setIsLoading(true);

    const docRef = collection(db, `users/${gymId}/routines`);
    const routineRef = await addDoc(docRef, {
      title: routineData.title,
      bio: routineData.bio,
      difficulty: routineData.difficulty,
      photoUrl: routineData.photoUrl,
      creatorId,
      routines: routineData.routines,
      ts: serverTimestamp(),
      total_workouts: routineData.total_workouts,
    });

    addActivity(gymId, creatorId, "Routineapproved");

    const updateRef = doc(db, "users", gymId, "routines", routineRef.id);
    await updateDoc(updateRef, {
      docId: routineRef.id,
    });

    const request_ref = doc(db, "users", gymId, "requests", docId);
    await deleteDoc(request_ref);

    navigate(-1);
    query.invalidateQueries("requests");
    query.invalidateQueries("count_instructors");
    query.invalidateQueries('routines')
    setIsLoading(false);
  };

  const handleDecline = async () => {
    const docId = routineData.docId;
    const gymId = routineData.gymId;

    try {
      setIsLoading(true);
      await declineRequest(gymId, docId);

      addActivity(gymId, routineData.senderId, "Routinerejected");
      openSnackbar({ message: "Request Declined.", severity: "error" });
      navigate(-1);
      query.invalidateQueries("requests");
      query.invalidateQueries("count_instructors");
      query.invalidateQueries('routines')
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        message: "An error has occurred. Please try again later.",
        severity: "error",
      });
    }
  };

  return (
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
              View routine
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col w-full items-center justify-center">
        <div className="mt-10 w-full px-5 max-w-lg md:max-w-lg md:mx-2">
          <div className="flex flex-col md:flex-row">
            <Avatar
              src={routineData?.photoUrl}
              sx={{ width: 150, height: 150 }}
              variant="rounded"
            >
              <ImageIcon />
            </Avatar>
            <div className="flex flex-col mt-2 md:mt-0 ml-0 md:ml-5 justify-center space-y-2">
              <div>
                <p className="font-semibold text-2xl truncate">
                  {routineData?.title}
                </p>
                <p className="font-semibold text-gray-500">
                  total workouts: {routineData?.total_workouts}
                </p>
                <p>{routineData?.bio}</p>
              </div>
            </div>
          </div>

          {routineData?.creatorId === userId ? (
            <></>
          ) : (
            <div className="mt-2 mb-2 flex items-center">
              <span className="mr-2 font-semibold">Original creator:</span>
              <div
                onClick={() => {
                  navigate(`/${userdata?.uid}`);
                }}
              >
                <Chip
                  className="hover:bg-gray-200 hover:cursor-pointer"
                  avatar={<Avatar src={userdata?.photoUrl} />}
                  label={
                    <div className="font-semibold">
                      {userdata?.usertype === "Gym"
                        ? userdata?.gymname
                        : userdata?.fullname}
                    </div>
                  }
                  variant="outlined"
                />
              </div>
            </div>
          )}
          <div
            className={`${routineColorCode(
              routineData
            )} text-center mb-3 text-white w-full mt-2 font-medium text-md px-2.5 py-1.5 rounded border`}
          >
            {routineData?.difficulty?.name}
          </div>
          <div className="w-full space-y-5">
            {dayOfTheWeek.map((day, index) => (
              <div
                key={index}
                className="w-full drop-shadow-md rounded-lg border border-gray-200 p-2"
              >
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-green-100 px-4 py-2 text-left text-sm font-medium hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
                        <div>
                          <span>
                            {day} · {routineData?.routines[day]?.length}
                          </span>
                        </div>
                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-green-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-800">
                        <div className="flex flex-col space-y-2">
                          {routineData?.routines[day]?.length !== 0 ? (
                            <div className="space-y-2">
                              {routineData?.routines[day]?.map((data, index) => (
                                <div key={index}>
                                  <WorkoutCard
                                    name_of_exercise={data.name_of_exercise}
                                    body_part={data.body_part}
                                    equipment={data.equipment}
                                    sets={data.sets}
                                    reps={data.reps}
                                    data={data}
                                    day={day}
                                    delitem={""}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className=" text-center items-center w-full mt-2 font-medium text-md px-2.5 py-1.5 rounded border border-gray-400">
                              <BedIcon /> Rest day
                            </div>
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            ))}
          </div>
          {location.pathname !== "/requests/viewRoutine" ? (
            <></>
          ) : (
            <div className="flex space-x-4 justify-between">
              <button
                disabled={isLoading}
                onClick={handleAccept}
                className="w-full disabled:opacity-25 mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Post
              </button>
              <button
                onClick={handleDecline}
                disabled={isLoading}
                className="w-full text-red-500 border-red-500 disabled:opacity-25 mt-5 hover:border-red-300 hover:text-red-300  border font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
              >
                Decline
              </button>
            </div>
          )}

          <div className="mt-5"></div>
        </div>
      </div>
    </div>
  );
}
