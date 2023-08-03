import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ImageIcon from "@mui/icons-material/Image";
import { Avatar } from "@mui/material";
import routineColorCode from "../../Services/routineColorCode";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import WorkoutCard from "./Components/WorkoutCard";
import BedIcon from "@mui/icons-material/Bed";

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
  const routineData = useSelector((state) => state.routine.routine);

  console.log(routineData.difficulty.name);

  return (
    <div>
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
      <div className="flex flex-col items-center justify-center">
        <div className="mt-10 w-full px-5 max-w-sm md:max-w-lg md:mx-2">
          <div className="flex flex-col md:flex-row">
            <Avatar
              src={routineData.photoUrl}
              sx={{ width: 150, height: 150 }}
              variant="rounded"
            >
              <ImageIcon />
            </Avatar>
            <div className="flex flex-col mt-2 md:mt-0 ml-0 md:ml-5 justify-center space-y-2">
              <div>
                <p className="font-semibold text-2xl truncate">
                  {routineData.title}
                </p>
                <p className="font-semibold text-gray-500">
                  total workouts: {routineData.total_workouts}
                </p>
                <p>{routineData.bio}</p>
              </div>
            </div>
          </div>
          <div
            className={`${routineColorCode(
              routineData
            )} text-center mb-3 text-white w-full mt-2 font-medium text-md px-2.5 py-1.5 rounded border`}
          >
            {routineData.difficulty.name}
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
                            {day} · {routineData.routines[day].length}
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
                          {routineData.routines[day].length !== 0 ? (
                            <div className="space-y-2">
                              {routineData.routines[day].map((data, index) => (
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
          <div className="mt-5"></div>
        </div>
      </div>
    </div>
  );
}
