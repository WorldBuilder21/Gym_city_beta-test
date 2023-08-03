import React, { useState } from "react";
import { useLocation } from "react-router";

export default function WorkoutCard({
  name_of_exercise,
  delitem,
  body_part,
  equipment,
  fragment,
  sets,
  reps,
  data,
  day,
}) {
  const location = useLocation();

  return (
    <div className="flex space-y-2 border-solid border-2 border-neutral-200 flex-col rounded-md bg-white p-3 shadow-lg">
      <div className="flex flex-row justify-between">
        <p className="font-semibold text-md">{name_of_exercise}</p>
        {location.pathname === "/home/addWorkoutRoutine" ||
        location.pathname === "/home/editWorkoutRoutine" ? (
          <button
            onClick={() => {
              delitem(data, day);
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="stroke-red-500 w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        ) : (
          <></>
        )}
      </div>
      <div>
        {body_part !== "" ? (
          <div className="flex flex-row">
            <p className="">Target area:</p> <p className="ml-2">{body_part}</p>
          </div>
        ) : (
          <div></div>
        )}
        {equipment !== "" ? (
          <div className="flex flex-row">
            <p className="">Equipment:</p> <p className="ml-2">{equipment}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="flex flex-row">
        <p>{sets}</p> x <p>{reps}</p>
      </div>
    </div>
  );
}
