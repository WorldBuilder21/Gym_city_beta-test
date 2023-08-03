import React, { Fragment, useRef, useState } from "react";
import { Avatar, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import checkLimit from "../../../Services/filesizeChecker";
import MuiAlert from "@mui/material/Alert";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { white_spaces_remover } from "../../../Services/whitespaceRegex";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Charactercounter from "../../Auth/Components/BioCharacterCounter";
import DifficultySelector from "../Components/DifficultySelector";
import WorkoutModal from "../Components/WorkoutModal";
import WorkoutCard from "../Components/WorkoutCard";
import { useSelector } from "react-redux";
import { db, storage } from "../../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const difficultyLevels = [
  { name: "Beginner" },
  { name: "Intermediate" },
  { name: "Expert" },
];

const dayOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddWorkoutRoutine() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [workoutFile, setWorkoutFile] = useState(null);
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [day, setDay] = useState("");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  const [groupedWorkout, setGroupedWorkout] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const custom_user = useSelector((state) => state.user.user);

  const { handleSubmit, getValues, control, watch } = useForm();

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const openWorkoutModal = () => {
    setOpenModal(true);
  };

  const deleteWorkout = (item, day) => {
    let index = groupedWorkout[day].indexOf(item);
    if (index !== -1) {
      groupedWorkout[day].splice(index, 1);
      setGroupedWorkout((state) => ({
        ...state,
        day: state[index],
      }));
    }
  };

  const watchTracker = (fieldName) => {
    return watch(fieldName) ? watch(fieldName).length : "0";
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    console.log(file.size);
    const size_checker = checkLimit(file);
    console.log(size_checker);
    if (size_checker === false) {
      setImageFile(file);
      setWorkoutFile(URL.createObjectURL(file));
    } else {
      openSnackbar({
        message: "The image size must not exceed 20MB",
        severity: "error",
      });
    }
  };

  const calctotalWorkout = () => {
    let sum = 0;
    for (let i = 0; i < dayOfTheWeek.length; i++) {
      sum += groupedWorkout[dayOfTheWeek[i]].length;
    }
    return sum;
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { title, bio } = getValues();
    setIsLoading(true);
    try {
      const total_workouts = calctotalWorkout();
      const docRef = collection(db, `users/${custom_user.uid}/routines`);
      const routineRef = await addDoc(docRef, {
        title,
        bio,
        difficulty,
        photoUrl: "",
        creatorId: custom_user.uid,
        routines: groupedWorkout,
        ts: serverTimestamp(),
        docId: "",
        total_workouts,
      });
      const updateRef = doc(
        db,
        "users",
        custom_user.uid,
        "routines",
        routineRef.id
      );
      await updateDoc(updateRef, {
        docId: routineRef.id,
      });
      if (imageFile !== null) {
        const storageRef = ref(
          storage,
          `/routinepfp/${Date.now()}${workoutFile.name}`
        );
        const uploadImage = uploadBytes(storageRef, imageFile);
        uploadImage.then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const docRef = doc(
              db,
              "users",
              custom_user.uid,
              "routines",
              routineRef.id
            );
            await updateDoc(docRef, {
              photoUrl: url,
            });
            setIsLoading(false);
            navigate(-1);
          });
        });
      } else {
        setIsLoading(false);
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      openSnackbar({
        message: "An error has occured, please try again later.",
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
              Add workout routine
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col mt-16 mb-16 items-center">
        {workoutFile === null ? (
          <Avatar
            variant="rounded"
            sx={{ width: 200, height: 200, borderRadius: 3 }}
          >
            <CameraAltIcon sx={{ fontSize: 40 }} />
          </Avatar>
        ) : (
          <Avatar
            src={workoutFile}
            variant="rounded"
            sx={{ width: 200, height: 200 }}
          />
        )}
        <label className="rounded inline-flex text-center items-center px-5 py-2.5 hover:bg-slate-200 mt-4 mb-4 font-semibold text-lg text-blue-600">
          <AddAPhotoIcon />
          <span className="ml-2">Pick a workout icon</span>
          <input
            ref={imageRef}
            onChange={handleChange}
            hidden
            accept="image/*"
            type="file"
          />
        </label>
        <div className="w-full px-5 max-w-md md:max-w-lg flex flex-col">
          <DifficultySelector
            Fragment={Fragment}
            list={difficultyLevels}
            setSetectedLevel={setDifficulty}
            selectedLevel={difficulty}
          />
          <WorkoutModal
            Fragment={Fragment}
            isOpen={openModal}
            handleClose={closeModal}
            day={day}
            groupedWorkout={groupedWorkout}
          />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
            <div className="space-y-1">
              <Controller
                name="title"
                defaultValue=""
                control={control}
                rules={{
                  maxLength: {
                    value: 60,
                    message: "Cannot exceed 60 characters.",
                  },
                  required: "This field is required",
                  pattern: {
                    value: white_spaces_remover,
                    message:
                      "Entered value cant start/end or contain only white spacing",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextField
                      className="w-full"
                      inputProps={{
                        maxLength: 60,
                      }}
                      value={value}
                      onChange={onChange}
                      label="Title"
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  </>
                )}
              />
              <p
                className={`${
                  watchTracker("title") >= 60
                    ? "text-red-500"
                    : "text-slate-400"
                }  flex flex-row items-end justify-end`}
              >
                {watchTracker("title")}/ {60} characters
              </p>
            </div>
            <div className="space-y-1">
              <Controller
                name="bio"
                defaultValue=""
                control={control}
                rules={{
                  maxLength: {
                    value: 200,
                    message: "Cannot exceed 200 characters.",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    value={value}
                    error={!!error}
                    inputProps={{
                      maxLength: 200,
                    }}
                    helperText={error ? error.message : null}
                    onChange={onChange}
                    label="Bio"
                    className="w-full"
                    multiline
                    rows={5}
                  />
                )}
              />
              <Charactercounter
                control={control}
                number={200}
                defaultValue={""}
                name={"bio"}
              />
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
                              {day} · {groupedWorkout[day].length}
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
                            {groupedWorkout[day].length !== 0 ? (
                              <div className="space-y-2">
                                {groupedWorkout[day].map((data, index) => (
                                  <div key={index}>
                                    <WorkoutCard
                                      name_of_exercise={data.name_of_exercise}
                                      body_part={data.body_part}
                                      equipment={data.equipment}
                                      sets={data.sets}
                                      reps={data.reps}
                                      fragment={Fragment}
                                      data={data}
                                      day={day}
                                      delitem={deleteWorkout}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>
                                NB: If no workout is created on this day it will
                                be automatically setted as a rest day.
                              </p>
                            )}
                          </div>
                          <button
                            disabled={isLoading}
                            type="button"
                            onClick={() => {
                              setDay(day);

                              openWorkoutModal();
                            }}
                            className="w-full mt-2 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                          >
                            Create workout
                          </button>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full disabled:opacity-25 mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
